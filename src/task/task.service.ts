import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { ETH_API_TOKEN } from '../config';
import { TokenEntity } from '../tokens/token.entity';
import { TokenService } from '../tokens/token.service';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionEntity } from '../transaction/transaction.entity';
import { ContractEntity } from '../contract/contract.entity';
import { ContractService } from '../contract/contract.service';

import InputDataDecoder from 'ethereum-input-data-decoder';
import BN from 'bn.js';
import moment from 'moment';
import LRU from 'lru-cache';

const pageProcessing = new LRU(500);
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly tokenService: TokenService,
    private readonly transactionService: TransactionService,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    private httpService: HttpService,
    private contractService: ContractService,
  ) {}

  // TODO 15分钟运行一次，每次只加载10条token
  @Cron('00 */15 * * * *')
  async handleCron() {
    this.logger.debug('定时任务');
    let page = pageProcessing.get('page');
    if (page !== undefined) {
      page++;
    } else {
      page = 0;
    }
    pageProcessing.set('page', page, 1000 * 60 * 1000);
    const [tokens, count] = await this.tokenService.findAll(page);
    if ((page + 1) * 10 >= count) {
      pageProcessing.set('page', undefined, 1000 * 60 * 1000);
    }
    if (tokens.length) {
      const requestPromise = [];
      const latestTransactionsPromise = [];
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        console.log(token);
        // TODO 数据阻塞，需要用web3的api代替回调，因为回调的
        const t = token.token;
        const result = this.httpService
          .get(
            `https://api.etherscan.io/api?module=account&action=txlist&address=${t}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${ETH_API_TOKEN}`,
          )
          .toPromise();

        // 请求接口
        requestPromise.push(result);
        // 找到数据库里已经存在的最新交易记录
        latestTransactionsPromise.push(
          this.transactionService.findLatestTransactionsByToken(token.token),
        );
      }
      const resAll = await Promise.all(requestPromise);
      const latestTransactions = await Promise.all(latestTransactionsPromise);

      for (let i = 0; i < resAll.length; i++) {
        const res = resAll[i];

        const resultData = res.data.result;
        const transactionsNotZero = resultData.filter(
          (item: any) => item.input !== '0x',
        );
        const ingoreContractAddress = [
          '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          '0xdac17f958d2ee523a2206206994597c13d831ec7',
        ];
        const transactionsNotZeroWithoutUSD = transactionsNotZero.filter(
          (item: any) => {
            const toIngore = !_.includes(ingoreContractAddress, item.to);
            const fromIngore = !_.includes(ingoreContractAddress, item.from);
            return toIngore && fromIngore;
          },
        );
        // TODO 把USDT USDC筛出掉
        const latestTransaction = latestTransactions[i];

        let notifyTransaction = [];

        if (!latestTransaction) {
          // 所有数据都是最新数据
          notifyTransaction = [...transactionsNotZeroWithoutUSD];
        } else {
          // 找到最新数据的index，index之前的是最新数据
          const index = _.findIndex(transactionsNotZeroWithoutUSD, [
            'hash',
            latestTransaction.transactionHash,
          ]);
          notifyTransaction = transactionsNotZeroWithoutUSD.slice(0, index);
        }
        const transactionsSaveDatas: TransactionEntity[] = [];
        for (let j = 0; j < notifyTransaction.length; j++) {
          // 组装数据
          const currentTransaction = notifyTransaction[j];
          // if (
          //   currentTransaction.hash !==
          //   '0xf9a1e46d3ffaf5f1bf7ea2aec87a4ba2dc84609ed11121703417a59811d1e537'
          // ) {
          //   continue;
          // }
          const token = tokens[i];
          const direction = currentTransaction.from === token ? 1 : 0;
          // 发通知
          const notifyData = await this.formatNotifyData(
            token,
            currentTransaction,
          );

          // 检查合约在数据库里是否存在，不存在存起来
          const isExistContractAddress = await this.checkContract(
            notifyData.contractAddress,
          );
          let contractE;
          if (!isExistContractAddress) {
            const contract = new ContractEntity();
            contract.address = notifyData.contractAddress;
            contract.name = notifyData.contractName;
            contract.price = 0;
            contractE = await this.contractService.save(contract);
          } else {
            contractE = isExistContractAddress;
          }

          // 通知完了后把所有通知过的交易存数据库
          const transactionSaveData = new TransactionEntity();
          transactionSaveData.transactionHash = currentTransaction.hash;
          transactionSaveData.token = token;
          transactionSaveData.contract = contractE;
          transactionSaveData.direction = direction;
          transactionSaveData.transactionTime =
            moment.unix(currentTransaction.timeStamp).toDate() ||
            moment().toDate();
          transactionSaveData.value = notifyData.value;
          transactionSaveData.to = currentTransaction.to;
          transactionSaveData.from = currentTransaction.from;
          transactionSaveData.input = currentTransaction.input;
          transactionSaveData.price = 0;
          transactionSaveData.totalPay = 0;

          transactionsSaveDatas.push(transactionSaveData);
          this.notify(notifyData);
          // await this.transactionService.save(transactionSaveData);
        }
        try {
          await this.transactionService.savaTransactions(transactionsSaveDatas);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  async formatNotifyData(tokenEntity: TokenEntity, transaction: any) {
    // 方向 交易量 时间 账号所属 币种？ 当前持仓量？ 当前持仓金额？最高持仓量？
    const { token, name: tokenName } = tokenEntity; // 账号token 账号所属
    // const direction =
    // const value = input 16进制转10进制，小数点未确定
    const transactionTime = transaction.timeStamp; // 交易时间
    // 通过tansaction to 获取
    const direction = transaction.from === token ? 1 : 0;
    const contractAddress = direction ? transaction.to : transaction.from;
    const address = !direction ? transaction.to : transaction.from;
    const abiRes = await this.httpService
      .get(
        `https://api.etherscan.io/api?module=contract&action=getabi&address=${
          direction ? transaction.to : transaction.from
        }&apikey=${ETH_API_TOKEN}`,
      )
      .toPromise();
    const abi = JSON.parse(abiRes.data.result);
    const decoder = new InputDataDecoder(abi);
    const inputData = decoder.decodeData(transaction.input);
    const value = new BN(inputData.inputs[1]).toString(10); // 交易量

    const contractRes = await this.httpService
      .get(
        `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&page=1&offset=1&startblock=0&endblock=27025780&sort=desc&apikey=${ETH_API_TOKEN}`,
      )
      .toPromise();
    const contractInfo = contractRes.data.result[0];
    return {
      token,
      tokenName,
      time: moment.unix(transactionTime).format('YYYY-MM-DD HH:mm:ss'),
      value,
      contractAddress,
      contractName: contractInfo.tokenName,
      direction,
    };
  }

  formatSavaData() {}

  notify(data: any) {
    this.httpService
      .post(
        '钉钉机器人回调',
        {
          msgtype: 'markdown',
          markdown: {
            title: '交易通知',
            text: `# 交易通知 \n ### 交易钱包：${
              data.tokenName
            } \n ### 钱包地址：${data.token} \n ### 交易方向：${
              data.direction ? '卖出' : '买进'
            } \n ### 交易币种：${data.contractName} \n ### 币种合约：${
              data.contractAddress
            } \n ### 交易数量：${data.value} \n ### 交易时间：${data.time}
            `,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .toPromise();
  }

  async checkContract(contract: string) {
    const result = await this.contractService.checkContract(contract);
    return result;
  }
}

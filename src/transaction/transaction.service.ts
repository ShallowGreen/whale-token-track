import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransactionEntity } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async findLatestTransactionsByToken(token: string) {
    const transactions = await this.transactionRepository.find({
      relations: ['token'],
      where: {
        token: {
          token,
        },
      },
      order: {
        transactionTime: 'DESC',
      },
      skip: 0,
      take: 1,
    });
    if (transactions.length) {
      return transactions[0];
    } else {
      return null;
    }
  }

  async savaTransactions(transactions: TransactionEntity[]) {
    console.log(transactions, 'transactions');
    await this.transactionRepository.save(transactions);
  }

  async save(transaction: TransactionEntity) {
    await this.transactionRepository.save(transaction);
  }
}

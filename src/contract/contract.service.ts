import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContractEntity } from './contract.entity';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
  ) {}

  async checkContract(address: string) {
    const res = await this.contractRepository.findOne({
      where: { address: address },
    });
    return res;
  }

  async save(contract: ContractEntity) {
    await this.contractRepository.save(contract);
  }
}

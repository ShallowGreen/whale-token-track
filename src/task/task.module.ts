import { HttpModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokenEntity } from '../tokens/token.entity';
import { TokenService } from '../tokens/token.service';
import { TransactionEntity } from '../transaction/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';
import { TasksService } from './task.service';
import { ContractEntity } from '../contract/contract.entity';
import { ContractService } from '../contract/contract.service';
@Module({
  providers: [TasksService, TokenService, TransactionService, ContractService],
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([TokenEntity, TransactionEntity, ContractEntity]),
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 10,
    }),
  ],
})
export class TaskModule {}

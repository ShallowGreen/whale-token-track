/*
 * @Author: 招摇
 * @Date: 2020-10-10 17:00:23
 * @LastEditors: 招摇
 * @LastEditTime: 2020-12-03 14:14:42
 * @Description:
 * @CodeLogic:
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractModule } from './contract/contract.module';
import { TaskModule } from './task/task.module';
// import { UserModule } from './user/user.module';
import { TokenModule } from './tokens/token.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TaskModule,
    TokenModule,
    TransactionModule,
    ContractModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

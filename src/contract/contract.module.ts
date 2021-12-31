import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { TransactionController } from './transaction.controller';
import { ContractEntity } from './contract.entity';
import { ContractService } from './contract.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [ContractService],
  // controllers: [ContractController],
  exports: [ContractService],
})
export class ContractModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(AuthMiddleware)
    //   .forRoutes({ path: 'user/userInfo', method: RequestMethod.GET });
  }
}

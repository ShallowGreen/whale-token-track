import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { TransactionController } from './transaction.controller';
import { HoldEntity } from './hold.entity';
import { HoldService } from './hold.service';

@Module({
  imports: [TypeOrmModule.forFeature([HoldEntity])],
  providers: [HoldService],
  // controllers: [HoldController],
  exports: [HoldService],
})
export class HoldModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(AuthMiddleware)
    //   .forRoutes({ path: 'user/userInfo', method: RequestMethod.GET });
  }
}

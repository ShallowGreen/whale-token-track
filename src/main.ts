/*
 * @Author: 招摇
 * @Date: 2020-10-10 17:00:23
 * @LastEditors: 招摇
 * @LastEditTime: 2020-12-04 16:28:27
 * @Description:
 * @CodeLogic:
 */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import * as requestIp from 'request-ip';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Request Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 处理跨域
  app.enableCors();

  // helmet 有XSS跨站脚本， 脚本注入 clickjacking 以及各种非安全的请求等
  app.use(helmet());

  // 同一个ip 15分钟中内只能请求500次
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 500, // limit each IP to 500 requests per windowMs
      message: 'Too many requests from this IP, please try again later',
      keyGenerator: req => requestIp.getClientIp(req),
    }),
  );

  // 同一个ip 1小时只能注册10个账户
  // const signupLimiter = rateLimit({
  //   windowMs: 60 * 60 * 1000, // 1 hour window
  //   max: 10, // start blocking after 10 requests
  //   message:
  //     'Too many accounts created from this IP, please try again after an hour',
  //   keyGenerator: req => requestIp.getClientIp(req),
  // });

  // 如果有注册的话
  // app.use('/user/signUp', signupLimiter);

  // 压缩
  app.use(compression());

  // throw new Error
  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app);

  await app.listen(process.env.PORT || 7788);
}

bootstrap();

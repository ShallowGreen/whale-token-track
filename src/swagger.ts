/*
 * @Author: 招摇
 * @Date: 2020-10-30 09:57:45
 * @LastEditors: 招摇
 * @LastEditTime: 2020-12-04 16:13:48
 * @Description:
 * @CodeLogic:
 */
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('api文档')
    .setDescription('API文档')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('api', app, document);
}

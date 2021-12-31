/*
 * @Author: 招摇
 * @Date: 2020-11-05 09:34:00
 * @LastEditors: 招摇
 * @LastEditTime: 2020-11-05 09:34:27
 * @Description: 未使用，采用的别的方式进行数据返回
 * @CodeLogic: https://www.shangmayuan.com/a/a29e9e14c181487da16cd101.html
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  data: T;
}
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        return {
          data,
          code: 0,
          message: '请求成功',
        };
      }),
    );
  }
}

/*
 * @Author: 招摇
 * @Date: 2020-11-04 18:13:27
 * @LastEditors: 招摇
 * @LastEditTime: 2020-11-05 13:48:58
 * @Description:
 * @CodeLogic:
 */
// import { StatusCode } from './code.enum';

export class ResultBean<T> {
  // code: number;

  message: string;

  data: T;

  success: boolean;
}

export class ResultGenerator {
  static success<T>(data: any = null, message = 'success'): ResultBean<T> {
    const result: ResultBean<T> = {
      // code: StatusCode.SUCCESS,
      message,
      data,
      success: true,
    };
    return result;
  }

  static fail<T>(code: number, message: string): ResultBean<T> {
    const result: ResultBean<T> = {
      // code,
      message,
      data: null,
      success: false,
    };
    return result;
  }
}

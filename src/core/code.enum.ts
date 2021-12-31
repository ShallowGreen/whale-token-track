/*
 * @Author: 招摇
 * @Date: 2020-11-04 18:14:49
 * @LastEditors: 招摇
 * @LastEditTime: 2020-11-04 18:15:02
 * @Description:
 * @CodeLogic:
 */
export enum StatusCode {
  TIMEOUT = -1, // 系统繁忙
  SUCCESS = 200, // 成功
  BUSINESS_FAIL = 400, // 业务类错误
  USER_ID_INVALID = 10001, // 用户id无效
}

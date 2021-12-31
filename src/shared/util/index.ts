/*
 * @Author: 招摇
 * @Date: 2020-11-05 15:46:12
 * @LastEditors: 招摇
 * @LastEditTime: 2020-11-06 13:45:02
 * @Description:
 * @CodeLogic:
 */

import _ from 'lodash';
import { Moment } from 'moment';

export const generateTimeXAxis = (
  timeType: string,
  startTime: Moment,
  endTime: Moment,
): any[] => {
  const timeArray: string[] = [];
  let stopTime = _.cloneDeep(startTime);
  while (stopTime.isSameOrBefore(endTime)) {
    if (timeType === 'hour') {
      timeArray.push(stopTime.format('YYYY-MM-DD HH:mm:00'));
      stopTime = stopTime.add(1, 'minute');
    } else if (timeType === 'day') {
      timeArray.push(stopTime.format('YYYY-MM-DD HH:00:00'));
      stopTime = stopTime.add(1, 'hour');
    } else if (timeType === 'month') {
      timeArray.push(stopTime.format('YYYY-MM-DD 00:00:00'));
      stopTime = stopTime.add(1, 'day');
    }
  }
  return timeArray;
};

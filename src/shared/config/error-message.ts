/*
 * @Author: 招摇
 * @Date: 2020-10-16 11:13:57
 * @LastEditors: 招摇
 * @LastEditTime: 2020-11-02 11:54:00
 * @Description:
 * @CodeLogic:
 */
import { HttpStatus } from '@nestjs/common';

import { IErrorMessages } from './interfaces/error-message.interface';

export const errorMessagesConfig: { [messageCode: string]: IErrorMessages } = {
  'monitor:create:missingInformation': {
    type: 'BadRequest',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorMessage: 'Unable to create a new record with missing information.',
    userMessage:
      'Impossible de créer un utilisateur avec des données manquantes.',
  },
  'request:unauthorized': {
    type: 'unauthorized',
    httpStatus: HttpStatus.UNAUTHORIZED,
    errorMessage: 'Access unauthorized.',
    userMessage: 'Access unauthorized.',
  },
  'request:requestInfoLose': {
    type: 'unauthorized',
    httpStatus: HttpStatus.UNAUTHORIZED,
    errorMessage: 'Request Info Lose.',
    userMessage: 'Request Info Lose.',
  },
  'request:requestMoreThanTwice': {
    type: 'unauthorized',
    httpStatus: HttpStatus.UNAUTHORIZED,
    errorMessage: 'Request More Than Twice.',
    userMessage: 'Request More Than Twice.',
  },
  'request:requestTimeExpires': {
    type: 'unauthorized',
    httpStatus: HttpStatus.UNAUTHORIZED,
    errorMessage: 'Request Time Expires.',
    userMessage: 'Request Time Expires.',
  },
};

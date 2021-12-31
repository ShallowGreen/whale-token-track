import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ResultBean, ResultGenerator } from '../core/resultBean';
import { TokenEntity } from './token.entity';
import { TokenService } from './token.service';

@ApiBearerAuth()
@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(private readonly userService: TokenService) {}
}

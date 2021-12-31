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
import { LoginUserDto, UserInfoDto } from './dto';
import { User, UserInfoType } from './user.decorator';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @ApiOkResponse({
    description: '返回结果',
    type: UserInfoDto,
  })
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<ResultBean<UserInfoDto>> {
    const _user: UserEntity | null = await this.userService.ldapLogin(
      loginUserDto,
    );
    if (!_user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    const token = await this.userService.generateJWT(_user);
    const user = { username: _user.username, role: _user.role, token };
    return ResultGenerator.success(user);
  }

  @Get('userInfo')
  @ApiOkResponse({
    description: '返回结果',
    type: UserInfoDto,
  })
  async getUserInfo(
    @User() user: UserInfoType,
  ): Promise<ResultBean<UserInfoDto>> {
    const _user: UserEntity | null = await this.userService.findUser(user);

    if (!_user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    const token = await this.userService.generateJWT(_user);
    const userInfo = { username: _user.username, role: _user.role, token };
    return ResultGenerator.success(userInfo);
  }
}

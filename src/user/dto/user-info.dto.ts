import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({
    description: '用户名',
  })
  readonly username: string;
  @ApiProperty({
    description: '权限，0是最基本权限，后续使用移位算法进行增加权限',
  })
  readonly role: string;
  @ApiProperty({
    description: 'token',
  })
  readonly token: string;
}

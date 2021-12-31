import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: '页码',
    name: 'pageNum',
  })
  pageNum: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: '页面条数',
    name: 'pageSize',
  })
  pageSize: number;
}

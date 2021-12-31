import { ApiProperty } from '@nestjs/swagger';

export class ListDto {
  @ApiProperty({
    description: 'count',
  })
  count: number;

  @ApiProperty({
    description: 'pageNum',
  })
  pageNum: number;

  @ApiProperty({
    description: 'pageSize',
  })
  pageSize: number;
}

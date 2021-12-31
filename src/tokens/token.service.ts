import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { TokenEntity } from './token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  async findAll(page: number) {
    const queryOptions: FindManyOptions = {
      order: { created: 'ASC' },
      where: {
        enable: 1,
      },
      skip: page,
      take: 10,
    };
    const tokens: [
      TokenEntity[],
      number,
    ] = await this.tokenRepository.findAndCount(queryOptions);
    return tokens;
  }
}

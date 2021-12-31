import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HoldEntity } from './hold.entity';

@Injectable()
export class HoldService {
  constructor(
    @InjectRepository(HoldEntity)
    private readonly holdRepository: Repository<HoldEntity>,
  ) {}
}

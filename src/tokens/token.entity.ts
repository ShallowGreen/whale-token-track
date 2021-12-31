import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { HoldEntity } from '../hold/hold.entity';
import { TransactionEntity } from '../transaction/transaction.entity';

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  token: string;

  @Column({ type: 'tinyint', comment: '启用1 停用0' })
  enable: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @OneToMany(
    () => TransactionEntity,
    transaction => transaction.token,
  )
  transactions: TransactionEntity[];

  @OneToMany(
    () => HoldEntity,
    hold => hold.token,
  )
  holds: HoldEntity[];
}

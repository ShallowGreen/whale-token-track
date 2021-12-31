import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { HoldEntity } from '../hold/hold.entity';
import { TransactionEntity } from '../transaction/transaction.entity';

@Entity('contract')
export class ContractEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ comment: '合约地址' })
  address: string;

  @Column({ comment: '合约名称' })
  name: string;

  @Column({ type: 'float', comment: '合约价格' })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @OneToMany(
    () => TransactionEntity,
    transaction => transaction.contract,
  )
  transactions: TransactionEntity[];

  @OneToMany(
    () => HoldEntity,
    hold => hold.contract,
  )
  holds: HoldEntity[];
}

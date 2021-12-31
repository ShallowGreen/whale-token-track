import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ContractEntity } from '../contract/contract.entity';
import { TokenEntity } from '../tokens/token.entity';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'transactionHash', default: ' ', length: 1024 })
  transactionHash: string;

  @ManyToOne(
    () => TokenEntity,
    token => token.transactions,
  )
  token: TokenEntity;

  @ManyToOne(
    () => ContractEntity,
    contract => contract.transactions,
  )
  contract: ContractEntity;

  @Column({ type: 'tinyint', comment: '交易方向 买进0 卖出1', default: 0 })
  direction: number;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '交易时间',
  })
  transactionTime: Date;

  @Column({ comment: '交易数量', default: '0' })
  value: string;

  @Column({ nullable: true, type: 'float', comment: '交易价格 u', default: 0 })
  price: number;

  @Column({ nullable: true, type: 'float', comment: '总金额 u', default: 0 })
  totalPay: number;

  @Column({ comment: 'to', default: '' })
  to: string;

  @Column({ comment: 'from', default: '' })
  from: string;

  @Column({ comment: '原始交易数据', default: '' })
  input: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;
}

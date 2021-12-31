import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ContractEntity } from '../contract/contract.entity';
import { TokenEntity } from '../tokens/token.entity';

@Entity('hold')
export class HoldEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(
    () => TokenEntity,
    token => token.holds,
  )
  token: TokenEntity;

  @ManyToOne(
    () => ContractEntity,
    contract => contract.holds,
  )
  contract: ContractEntity;

  @Column({ type: 'float', comment: '持仓数量' })
  value: number;

  @Column({ type: 'float', comment: '总金额 u' })
  totalHold: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;
}

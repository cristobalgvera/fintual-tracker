import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Goal } from './goal.entity';

@Entity('historical_goals')
export class HistoricalGoal {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column({ update: false })
  totalAmount: number;

  @Column({ update: false })
  deposited: number;

  @Column({ update: false })
  profit: number;

  @CreateDateColumn({ update: false })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Goal, ({ historicalGoals }) => historicalGoals, {
    nullable: false,
    orphanedRowAction: 'soft-delete',
  })
  goal: Promise<Goal>;
}

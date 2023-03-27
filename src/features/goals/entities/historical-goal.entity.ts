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

  @Column({ type: 'decimal', precision: 18, scale: 4, update: false })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 18, scale: 4, update: false })
  deposited: number;

  @Column({ type: 'decimal', precision: 18, scale: 4, update: false })
  profit: number;

  @CreateDateColumn({ update: false })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Goal, ({ historicalGoals }) => historicalGoals, {
    nullable: false,
  })
  goal: Promise<Goal>;
}

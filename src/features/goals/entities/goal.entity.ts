import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HistoricalGoal } from './historical-goal.entity';

@Entity('goals')
export class Goal {
  @PrimaryColumn({ update: false })
  id: string;

  @Column()
  @Index({ unique: true })
  name: string;

  @CreateDateColumn({ update: false })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => HistoricalGoal, ({ goal }) => goal, {
    cascade: true,
  })
  historicalGoals: HistoricalGoal[];
}

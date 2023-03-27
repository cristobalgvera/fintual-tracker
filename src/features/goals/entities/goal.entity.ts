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
import { GoalType } from '../enum';
import { HistoricalGoal } from './historical-goal.entity';

@Entity('goals')
export class Goal {
  @PrimaryColumn({ update: false })
  @Index()
  id: string;

  @Column()
  @Index({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: GoalType,
  })
  goalType: GoalType;

  @CreateDateColumn({ update: false })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => HistoricalGoal, ({ goal }) => goal, {
    cascade: true,
  })
  historicalGoals: Promise<HistoricalGoal[]>;
}

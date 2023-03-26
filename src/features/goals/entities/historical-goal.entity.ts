import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('historical_goals')
export class HistoricalGoal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ update: false })
  totalAmount: number;

  @Column({ update: false })
  deposited: number;

  @Column({ update: false })
  profit: number;
}

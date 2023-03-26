import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  name: string;
}

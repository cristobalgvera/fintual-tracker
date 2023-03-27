import { Goal, HistoricalGoal } from '@features/goals';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';
import { GoalTrackingDto } from './dto';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(HistoricalGoal)
    private readonly historicalGoalRepository: Repository<HistoricalGoal>,
  ) {}

  trackGoal(goalTrackingDto: GoalTrackingDto): Observable<HistoricalGoal> {
    return from(this.findGoalOrNull(goalTrackingDto.trackingId)).pipe(
      switchMap((goal) => {
        if (goal) return of(goal);

        const createdGoal = this.createGoal(goalTrackingDto);
        return from(this.goalRepository.save(createdGoal));
      }),
      map((goal) => this.createHistoricalGoal(goal, goalTrackingDto)),
      switchMap((historicalGoal) =>
        from(this.historicalGoalRepository.save(historicalGoal)),
      ),
    );
  }

  private findGoalOrNull(trackingId: string) {
    return this.goalRepository.findOne({
      where: {
        id: trackingId,
      },
      relations: {
        historicalGoals: true,
      },
    });
  }

  private createGoal({ trackingId, name, goal_type }: GoalTrackingDto): Goal {
    return this.goalRepository.create({
      id: trackingId,
      goalType: goal_type,
      name,
    });
  }

  private createHistoricalGoal(
    goal: Goal,
    { nav, deposited, profit }: GoalTrackingDto,
  ): HistoricalGoal {
    const historicalGoal = this.historicalGoalRepository.create({
      totalAmount: nav,
      deposited,
      profit,
    });

    historicalGoal.goal = Promise.resolve(goal);

    return historicalGoal;
  }
}

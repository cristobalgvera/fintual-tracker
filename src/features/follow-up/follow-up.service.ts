import { GoalsService } from '@features/goals';
import { TrackingService } from '@features/tracking';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FollowUpService {
  constructor(
    private readonly goalsService: GoalsService,
    private readonly trackingService: TrackingService,
    private readonly logger: Logger,
  ) {}

  async followUpGoals(): Promise<void> {
    const goals = await firstValueFrom(this.goalsService.getGoals());

    for (const goal of goals) {
      this.logger.log(`Tracking goal: ${goal.name}, ID: ${goal.trackingId}`);
      await firstValueFrom(this.trackingService.trackGoal(goal));
    }
  }
}

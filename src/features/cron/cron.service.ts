import { GoalsService } from '@features/goals';
import { TrackingService } from '@features/tracking';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CronService {
  constructor(
    private readonly goalsService: GoalsService,
    private readonly trackingService: TrackingService,
    private readonly logger: Logger,
  ) {}

  // TODO: Allow dynamic cron jobs time expressions and time zones
  @Cron(CronExpression.EVERY_DAY_AT_3AM, { timeZone: 'America/Santiago' })
  async followUpGoals(): Promise<void> {
    const goals = await firstValueFrom(this.goalsService.getGoals());

    for (const goal of goals) {
      this.logger.log(`Tracking goal: ${goal.name}, ID: ${goal.trackingId}`);
      await firstValueFrom(this.trackingService.trackGoal(goal));
    }
  }
}

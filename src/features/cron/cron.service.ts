import { EnvironmentService } from '@core/environment';
import { FollowUpService } from '@features/follow-up';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService implements OnModuleInit {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly environmentService: EnvironmentService,
    private readonly logger: Logger,
    private readonly followUpService: FollowUpService,
  ) {}

  onModuleInit() {
    this.environmentService
      .getEnvironmentValue('USER_SCHEDULES')
      .forEach((scheduleTime) => this.scheduleJob(scheduleTime));
  }

  private scheduleJob(scheduleTime: string): void {
    this.logger.log(`Scheduling job at ${scheduleTime}`);

    const cronJob = new CronJob({
      cronTime: scheduleTime,
      onTick: this.followUpService.followUpGoals.bind(this.followUpService),
      timeZone: this.environmentService.getEnvironmentValue('USER_TIME_ZONE'),
    });

    this.schedulerRegistry.addCronJob(scheduleTime, cronJob);

    cronJob.start();
  }
}

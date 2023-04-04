import { EnvironmentModule } from '@core/environment';
import { FollowUpModule } from '@features/follow-up';
import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';

@Module({
  imports: [ScheduleModule.forRoot(), EnvironmentModule, FollowUpModule],
  providers: [
    CronService,
    {
      provide: Logger,
      useValue: new Logger(CronService.name),
    },
  ],
})
export class CronModule {}

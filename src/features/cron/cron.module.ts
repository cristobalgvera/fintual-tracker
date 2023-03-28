import { GoalsModule } from '@features/goals';
import { TrackingModule } from '@features/tracking';
import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';

@Module({
  imports: [ScheduleModule.forRoot(), GoalsModule, TrackingModule],
  providers: [
    CronService,
    {
      provide: Logger,
      useValue: new Logger(CronService.name),
    },
  ],
})
export class CronModule {}

import { GoalsModule } from '@features/goals';
import { TrackingModule } from '@features/tracking';
import { Logger, Module } from '@nestjs/common';
import { FollowUpService } from './follow-up.service';

@Module({
  imports: [GoalsModule, TrackingModule],
  providers: [
    FollowUpService,
    {
      provide: Logger,
      useValue: new Logger(FollowUpService.name),
    },
  ],
  exports: [FollowUpService],
})
export class FollowUpModule {}

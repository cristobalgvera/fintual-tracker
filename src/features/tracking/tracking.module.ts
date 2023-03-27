import { GoalsModule } from '@features/goals';
import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Module({
  imports: [GoalsModule],
  providers: [TrackingService],
})
export class TrackingModule {}

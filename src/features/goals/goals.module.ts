import { SharedModule } from '@core/shared';
import { AccessTokenModule } from '@features/access-token';
import { TrackingSharedModule } from '@features/shared';
import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';

@Module({
  imports: [SharedModule, TrackingSharedModule, AccessTokenModule],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}

import { SharedModule } from '@core/shared';
import { TrackingSharedModule } from '@features/shared';
import { Module } from '@nestjs/common';
import { AccessTokenService } from './access-token.service';

@Module({
  imports: [SharedModule, TrackingSharedModule],
  providers: [AccessTokenService],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}

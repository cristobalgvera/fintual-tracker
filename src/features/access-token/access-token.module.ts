import { SharedModule } from '@core/shared';
import { TrackingSharedModule } from '@features/shared';
import { Module } from '@nestjs/common';
import { AccessTokenService } from './access-token.service';
import { RedisAccessTokenModule } from './redis-access-token';

@Module({
  imports: [SharedModule, TrackingSharedModule, RedisAccessTokenModule],
  providers: [AccessTokenService],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}

import { RedisModule } from '@core/redis';
import { Logger, Module } from '@nestjs/common';
import { RedisAccessTokenService } from './redis-access-token.service';

@Module({
  imports: [RedisModule],
  providers: [
    RedisAccessTokenService,
    {
      provide: Logger,
      useValue: new Logger(RedisAccessTokenService.name),
    },
  ],
  exports: [RedisAccessTokenService],
})
export class RedisAccessTokenModule {}

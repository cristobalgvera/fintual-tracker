import { RedisService } from '@core/redis';
import { Injectable, Logger } from '@nestjs/common';
import { addMinutes, isAfter } from 'date-fns';
import { catchError, from, map, of, tap } from 'rxjs';
import {
  ACCESS_TOKEN_EXPIRATION_TIME_IN_MINUTES,
  ACCESS_TOKEN_REDIS_KEY,
} from './constants';
import { RedisAccessTokenDto } from './model';

@Injectable()
export class RedisAccessTokenService {
  constructor(
    private readonly redisService: RedisService,
    private readonly logger: Logger,
  ) {}

  getExistingAccessToken() {
    return from(
      this.redisService.get<RedisAccessTokenDto>(ACCESS_TOKEN_REDIS_KEY),
    ).pipe(
      tap(({ expiresAt }) => {
        if (isAfter(Date.now(), expiresAt))
          throw new Error('The access token has expired');
      }),
      map(({ accessToken }) => accessToken),
      catchError((error) => {
        this.logger.warn(
          `Can not get the access token from Redis: ${error.message}`,
        );

        return of(null);
      }),
    );
  }

  storeAccessToken(accessToken: string) {
    return from(
      this.redisService.set<RedisAccessTokenDto>(ACCESS_TOKEN_REDIS_KEY, {
        accessToken,
        expiresAt: addMinutes(
          Date.now(),
          ACCESS_TOKEN_EXPIRATION_TIME_IN_MINUTES,
        ).getTime(),
      }),
    );
  }
}

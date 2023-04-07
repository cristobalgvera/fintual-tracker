import { EnvironmentService } from '@core/environment';
import { HttpErrorService } from '@core/error';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { ACCESS_TOKENS_PATH } from './constants';
import { AccessTokenRequest, AccessTokenResponse } from './model';
import { RedisAccessTokenService } from './redis-access-token';

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly httpService: HttpService,
    private readonly environmentService: EnvironmentService,
    private readonly httpErrorService: HttpErrorService,
    private readonly redisAccessTokenService: RedisAccessTokenService,
  ) {}

  getAccessToken(): Observable<string> {
    return this.redisAccessTokenService.getExistingAccessToken().pipe(
      switchMap((accessToken) => {
        if (accessToken) return of(accessToken);

        return this.requestAccessToken().pipe(
          switchMap((accessToken) =>
            this.redisAccessTokenService
              .storeAccessToken(accessToken)
              .pipe(map(() => accessToken)),
          ),
        );
      }),
    );
  }

  private requestAccessToken(): Observable<string> {
    return this.httpService
      .post<AccessTokenResponse>(ACCESS_TOKENS_PATH, this.createCredentials())
      .pipe(
        catchError((error) =>
          this.httpErrorService.handleError({
            error,
            caller: AccessTokenService,
            methodName: this.getAccessToken.name,
          }),
        ),
        map((response) => response.data.data.attributes.token),
      );
  }

  private createCredentials(): AccessTokenRequest {
    return {
      user: {
        email: this.environmentService.getEnvironmentValue(
          'TRACKING_USER_EMAIL',
        ),
        password: this.environmentService.getEnvironmentValue(
          'TRACKING_USER_PASSWORD',
        ),
      },
    };
  }
}

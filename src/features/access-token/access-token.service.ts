import { EnvironmentService } from '@core/environment';
import { HttpErrorService } from '@core/error';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { ACCESS_TOKENS_PATH } from './constants';
import { AccessTokenRequest, AccessTokenResponse } from './model';

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly httpService: HttpService,
    private readonly environmentService: EnvironmentService,
    private readonly httpErrorService: HttpErrorService,
  ) {}

  getAccessToken(): Observable<string> {
    const credentials: AccessTokenRequest = {
      user: {
        email: this.environmentService.getEnvironmentValue(
          'TRACKING_USER_EMAIL',
        ),
        password: this.environmentService.getEnvironmentValue(
          'TRACKING_USER_PASSWORD',
        ),
      },
    };

    return this.httpService
      .post<AccessTokenResponse>(ACCESS_TOKENS_PATH, credentials)
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
}

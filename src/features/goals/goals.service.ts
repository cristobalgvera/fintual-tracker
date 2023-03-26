import { EnvironmentService } from '@core/environment';
import { HttpErrorService } from '@core/error';
import { AccessTokenService } from '@features/access-token';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, map, Observable, switchMap } from 'rxjs';
import { GOALS_PATH } from './constants';
import {
  GoalAttributesWithIdDto,
  GoalsRequestDto,
  GoalsResponseDto,
} from './dto';

@Injectable()
export class GoalsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly environmentService: EnvironmentService,
    private readonly httpErrorService: HttpErrorService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  getGoals(): Observable<GoalAttributesWithIdDto[]> {
    return this.accessTokenService.getAccessToken().pipe(
      map((accessToken) => this.createRequest(accessToken)),
      switchMap((request) => this.getGoalsRequest(request)),
    );
  }

  private createRequest(accessToken: string): GoalsRequestDto {
    return {
      user_email: this.environmentService.getEnvironmentValue(
        'TRACKING_USER_EMAIL',
      ),
      user_token: accessToken,
    };
  }

  private getGoalsRequest(
    request: GoalsRequestDto,
  ): Observable<GoalAttributesWithIdDto[]> {
    return this.httpService
      .get<GoalsResponseDto>(GOALS_PATH, {
        params: request,
      })
      .pipe(
        catchError((error) =>
          this.httpErrorService.handleError({
            error,
            caller: GoalsService,
            methodName: this.getGoals.name,
          }),
        ),
        map((response) => response.data.data),
        map((data) =>
          data.map(({ id, attributes }) => ({
            trackingId: id,
            ...attributes,
          })),
        ),
      );
  }
}

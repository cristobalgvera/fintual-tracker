import { TestBed } from '@automock/jest';
import { Environment, EnvironmentService } from '@core/environment';
import { HttpErrorService } from '@core/error';
import { AccessTokenService } from '@features/access-token';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, of, throwError } from 'rxjs';
import { GOALS_PATH } from './constants';
import { GoalsService } from './goals.service';

describe('GoalsService', () => {
  let underTest: GoalsService;
  let httpService: HttpService;
  let environmentService: EnvironmentService;
  let httpErrorService: HttpErrorService;
  let accessTokenService: AccessTokenService;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(GoalsService).compile();

    underTest = unit;
    httpService = unitRef.get(HttpService);
    environmentService = unitRef.get(EnvironmentService);
    httpErrorService = unitRef.get(HttpErrorService);
    accessTokenService = unitRef.get(AccessTokenService);
  });

  describe('getGoals', () => {
    const environment = {
      TRACKING_USER_EMAIL: 'email',
    } as Environment;

    beforeEach(() => {
      jest
        .spyOn(environmentService, 'getEnvironmentValue')
        .mockImplementation((key) => environment[key]);
    });

    describe('when the request succeeds', () => {
      const ACCESS_TOKEN = 'token';

      beforeEach(() => {
        jest
          .spyOn(accessTokenService, 'getAccessToken')
          .mockReturnValueOnce(of(ACCESS_TOKEN));
      });

      it('should return the goals', async () => {
        const goals = [{ attributes: 'goal_1' }, { attributes: 'goal_2' }];

        jest
          .spyOn(httpService, 'get')
          .mockReturnValueOnce(of({ data: { data: goals } } as any));

        const actual = await firstValueFrom(underTest.getGoals());

        expect(actual).toMatchInlineSnapshot(`
          [
            "goal_1",
            "goal_2",
          ]
        `);
      });

      it('should call HttpService with correct parameters', async () => {
        const httpServiceSpy = jest
          .spyOn(httpService, 'get')
          .mockReturnValueOnce(of({ data: { data: [] } } as any));

        await firstValueFrom(underTest.getGoals());

        expect(httpServiceSpy).toHaveBeenCalledWith<
          Parameters<HttpService['get']>
        >(GOALS_PATH, {
          params: {
            user_email: environment.TRACKING_USER_EMAIL,
            user_token: ACCESS_TOKEN,
          },
        });
      });
    });

    describe('when the request fails', () => {
      describe('when calling the AccessTokenService', () => {
        beforeEach(() => {
          jest
            .spyOn(accessTokenService, 'getAccessToken')
            .mockReturnValueOnce(throwError(() => new Error('message')));
        });

        it('should throw the error thrown by the service', async () => {
          await expect(() =>
            firstValueFrom(underTest.getGoals()),
          ).rejects.toThrowErrorMatchingInlineSnapshot(`"message"`);
        });
      });

      describe('when calling the HttpService', () => {
        const httpError = new Error('HTTP Error');

        beforeEach(() => {
          jest
            .spyOn(accessTokenService, 'getAccessToken')
            .mockReturnValueOnce(of('token'));

          jest
            .spyOn(httpService, 'get')
            .mockReturnValueOnce(throwError(() => httpError));
        });

        it('should call HttpErrorService with the actual error', async () => {
          const httpErrorServiceSpy = jest
            .spyOn(httpErrorService, 'handleError')
            .mockReturnValueOnce(throwError(() => new Error()));

          try {
            await firstValueFrom(underTest.getGoals());
          } catch (error) {
            // Ignore error
          } finally {
            expect(httpErrorServiceSpy).toHaveBeenCalledWith(
              expect.objectContaining({
                error: httpError,
              }),
            );
          }
        });

        it('should throw an error', async () => {
          jest
            .spyOn(httpErrorService, 'handleError')
            .mockReturnValueOnce(throwError(() => new Error('error')));

          await expect(() =>
            firstValueFrom(underTest.getGoals()),
          ).rejects.toThrowErrorMatchingInlineSnapshot(`"error"`);
        });
      });
    });
  });
});

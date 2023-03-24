import { TestBed } from '@automock/jest';
import { Environment, EnvironmentService } from '@core/environment';
import { HttpErrorService } from '@core/error';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, of, throwError } from 'rxjs';
import { AccessTokenService } from './access-token.service';
import { ACCESS_TOKENS_PATH } from './constants';
import { AccessTokenRequest } from './model';

describe('AccessTokenService', () => {
  let underTest: AccessTokenService;
  let httpService: HttpService;
  let environmentService: EnvironmentService;
  let httpErrorService: HttpErrorService;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(AccessTokenService).compile();

    underTest = unit;
    httpService = unitRef.get(HttpService);
    environmentService = unitRef.get(EnvironmentService);
    httpErrorService = unitRef.get(HttpErrorService);
  });

  describe('getAccessToken', () => {
    describe('when the request is successful', () => {
      const environment = {
        TRACKING_USER_EMAIL: 'email',
        TRACKING_USER_PASSWORD: 'password',
      } as Readonly<Environment>;

      beforeEach(() => {
        jest
          .spyOn(environmentService, 'getEnvironmentValue')
          .mockImplementation((key) => environment[key]);
      });

      it('should return the token', async () => {
        const expected = 'token';

        jest.spyOn(httpService, 'post').mockReturnValueOnce(
          of({
            data: {
              data: {
                attributes: {
                  token: expected,
                },
              },
            },
          } as any),
        );

        const actual = await firstValueFrom(underTest.getAccessToken());

        expect(actual).toEqual(expected);
      });

      describe('when calling the HTTP service', () => {
        let httpServiceSpy: jest.SpyInstance;

        beforeEach(async () => {
          httpServiceSpy = jest
            .spyOn(httpService, 'post')
            .mockReturnValueOnce(
              of({ data: { data: { attributes: {} } } } as any),
            );

          await firstValueFrom(underTest.getAccessToken());
        });

        it('should pass the correct path', async () => {
          const expected = ACCESS_TOKENS_PATH;

          expect(httpServiceSpy).toHaveBeenCalledWith(
            expected,
            expect.anything(),
          );
        });

        it('should pass the correct credentials', async () => {
          const expected: AccessTokenRequest = {
            user: {
              email: environment.TRACKING_USER_EMAIL,
              password: environment.TRACKING_USER_PASSWORD,
            },
          };

          expect(httpServiceSpy).toHaveBeenCalledWith(
            expect.anything(),
            expected,
          );
        });
      });
    });

    describe('when the request fails', () => {
      it('should throw the error defined by the HttpErrorService', async () => {
        expect.hasAssertions();

        const expected = new Error('message');

        jest
          .spyOn(httpService, 'post')
          .mockReturnValueOnce(throwError(() => new Error()));

        jest
          .spyOn(httpErrorService, 'handleError')
          .mockReturnValueOnce(throwError(() => expected));

        await expect(() =>
          firstValueFrom(underTest.getAccessToken()),
        ).rejects.toEqual(expected);
      });

      describe('when calling the HttpErrorService', () => {
        it('should pass the error thrown by the HTTP call', async () => {
          expect.hasAssertions();

          const expected = new Error('message');

          jest
            .spyOn(httpService, 'post')
            .mockReturnValueOnce(throwError(() => expected));

          const handleError = jest
            .spyOn(httpErrorService, 'handleError')
            .mockReturnValueOnce(throwError(() => new Error()));

          try {
            await firstValueFrom(underTest.getAccessToken());
          } catch (error) {
            // Ignore error
          } finally {
            expect(handleError).toHaveBeenCalledWith(
              expect.objectContaining({ error: expected as any }),
            );
          }
        });
      });
    });
  });
});

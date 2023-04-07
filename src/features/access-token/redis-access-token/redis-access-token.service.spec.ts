import { TestBed } from '@automock/jest';
import { RedisService } from '@core/redis';
import { addMinutes } from 'date-fns';
import { firstValueFrom } from 'rxjs';
import {
  ACCESS_TOKEN_EXPIRATION_TIME_IN_MINUTES,
  ACCESS_TOKEN_REDIS_KEY,
} from './constants';
import { RedisAccessTokenDto } from './model';
import { RedisAccessTokenService } from './redis-access-token.service';

describe('RedisAccessTokenService', () => {
  let underTest: RedisAccessTokenService;
  let redisService: RedisService;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(RedisAccessTokenService).compile();

    underTest = unit;
    redisService = unitRef.get(RedisService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getExistingAccessToken', () => {
    describe('when the access token is found', () => {
      let fakeDate: Date;

      beforeEach(() => {
        fakeDate = new Date('01/01/2021');
        jest
          .useFakeTimers({
            doNotFake: ['performance'],
          })
          .setSystemTime(fakeDate);
      });

      describe('when the access token has not expired', () => {
        it('should return the access token', async () => {
          const expected = {
            accessToken: 'access_token',
            expiresAt: addMinutes(fakeDate, 1).getTime(),
          } as RedisAccessTokenDto;

          jest.spyOn(redisService, 'get').mockResolvedValueOnce(expected);

          const actual = await firstValueFrom(
            underTest.getExistingAccessToken(),
          );

          expect(actual).toEqual(expected.accessToken);
        });
      });

      describe('when the access token has expired', () => {
        it('should return null', async () => {
          const redisAccessTokenDto = {
            accessToken: 'non-null',
            expiresAt: addMinutes(fakeDate, -1).getTime(),
          } as RedisAccessTokenDto;

          jest
            .spyOn(redisService, 'get')
            .mockResolvedValueOnce(redisAccessTokenDto);

          const actual = await firstValueFrom(
            underTest.getExistingAccessToken(),
          );

          expect(actual).toBeNull();
        });
      });
    });

    describe('when the access token is not found', () => {
      beforeEach(() => {
        jest
          .spyOn(redisService, 'get')
          .mockRejectedValueOnce(new Error('Not found'));
      });

      it('should return null', async () => {
        const actual = await firstValueFrom(underTest.getExistingAccessToken());

        expect(actual).toBeNull();
      });
    });
  });

  describe('storeAccessToken', () => {
    let fakeDate: Date;

    beforeEach(() => {
      fakeDate = new Date('01/01/2021');
      jest
        .useFakeTimers({
          doNotFake: ['performance'],
        })
        .setSystemTime(fakeDate);
    });

    it('should store the access token', async () => {
      const expectedAccessToken = 'access_token';
      const expectedExpiresAt = addMinutes(
        fakeDate,
        ACCESS_TOKEN_EXPIRATION_TIME_IN_MINUTES,
      ).getTime();

      const redisServiceSpy = jest
        .spyOn(redisService, 'set')
        .mockResolvedValueOnce('SUCCESS' as any);

      await firstValueFrom(underTest.storeAccessToken(expectedAccessToken));

      expect(redisServiceSpy).toHaveBeenCalledWith<
        Parameters<RedisService['set']>
      >(
        ACCESS_TOKEN_REDIS_KEY,
        expect.objectContaining<RedisAccessTokenDto>({
          accessToken: expectedAccessToken,
          expiresAt: expectedExpiresAt,
        }),
      );
    });
  });
});

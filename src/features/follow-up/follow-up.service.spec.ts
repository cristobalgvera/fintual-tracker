import { TestBed } from '@automock/jest';
import { GoalAttributesWithIdDto, GoalsService } from '@features/goals';
import { TrackingService } from '@features/tracking';
import { Logger } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { FollowUpService } from './follow-up.service';

describe('FollowUpService', () => {
  let underTest: FollowUpService;
  let logger: Logger;
  let goalsService: GoalsService;
  let trackingService: TrackingService;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(FollowUpService).compile();

    underTest = unit;
    logger = unitRef.get(Logger);
    goalsService = unitRef.get(GoalsService);
    trackingService = unitRef.get(TrackingService);
  });

  describe('followUpGoals', () => {
    describe('when operation succeeds', () => {
      let goalsServiceSpy: jest.SpyInstance;
      let trackingServiceSpy: jest.SpyInstance;

      beforeEach(() => {
        goalsServiceSpy = jest
          .spyOn(goalsService, 'getGoals')
          .mockReturnValueOnce(of([{}] as any));

        trackingServiceSpy = jest
          .spyOn(trackingService, 'trackGoal')
          .mockReturnValue(of({} as any));
      });

      describe('when calling the GoalsService', () => {
        it('should call it once', async () => {
          await underTest.followUpGoals();

          expect(goalsServiceSpy).toHaveBeenCalledTimes(1);
        });

        describe('when there are no goals', () => {
          beforeEach(() => {
            goalsServiceSpy.mockReset().mockReturnValueOnce(of([] as any));
          });

          it('should not call the TrackingService', async () => {
            await underTest.followUpGoals();

            expect(trackingServiceSpy).not.toHaveBeenCalled();
          });
        });
      });

      describe('when calling the TrackingService', () => {
        it('should call it once', async () => {
          await underTest.followUpGoals();

          expect(trackingServiceSpy).toHaveBeenCalledTimes(1);
        });

        it('should call it with the goals provided by the GoalsService', async () => {
          const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];

          goalsServiceSpy.mockReset().mockReturnValueOnce(of(expected));

          await underTest.followUpGoals();

          expected.forEach((goal, index) => {
            expect(trackingServiceSpy).toHaveBeenNthCalledWith(index + 1, goal);
          });
        });
      });

      describe('when logging', () => {
        let loggerSpy: jest.SpyInstance;

        beforeEach(() => {
          loggerSpy = jest.spyOn(logger, 'log');
        });

        it('should log the goals provided by the GoalsService', async () => {
          const expected = [
            { trackingId: 'tracking-id-1' },
            { trackingId: 'tracking-id-2' },
            { trackingId: 'tracking-id-3' },
          ] as GoalAttributesWithIdDto[];

          goalsServiceSpy.mockReset().mockReturnValueOnce(of(expected));

          await underTest.followUpGoals();

          expected.forEach((goal, index) => {
            expect(loggerSpy).toHaveBeenNthCalledWith(
              index + 1,
              expect.stringContaining(goal.trackingId),
            );
          });
        });
      });
    });

    describe('when operation fails', () => {
      describe('when GoalsService fails', () => {
        beforeEach(() => {
          jest
            .spyOn(goalsService, 'getGoals')
            .mockReturnValueOnce(
              throwError(() => new Error('GoalsService error')),
            );
        });

        it('should throw the error', async () => {
          expect.hasAssertions();

          await expect(() =>
            underTest.followUpGoals(),
          ).rejects.toThrowErrorMatchingInlineSnapshot(`"GoalsService error"`);
        });
      });

      describe('when TrackingService fails', () => {
        beforeEach(() => {
          jest
            .spyOn(goalsService, 'getGoals')
            .mockReturnValueOnce(of([{}] as any));

          jest
            .spyOn(trackingService, 'trackGoal')
            .mockReturnValueOnce(
              throwError(() => new Error('TrackingService error')),
            );
        });

        it('should throw the error', async () => {
          expect.hasAssertions();

          await expect(() =>
            underTest.followUpGoals(),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"TrackingService error"`,
          );
        });
      });
    });
  });
});

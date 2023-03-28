import { Goal, HistoricalGoal } from '@features/goals';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { TrackingService } from './tracking.service';

describe('TrackingService', () => {
  let underTest: TrackingService;
  let goalRepository: Repository<Goal>;
  let historicalGoalRepository: Repository<HistoricalGoal>;

  beforeEach(async () => {
    const GoalRepository = getRepositoryToken(Goal);
    const HistoricalGoalRepository = getRepositoryToken(HistoricalGoal);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingService,
        {
          provide: GoalRepository,
          useValue: createMock<Repository<Goal>>(),
        },
        {
          provide: HistoricalGoalRepository,
          useValue: createMock<Repository<HistoricalGoal>>(),
        },
      ],
    }).compile();

    underTest = module.get(TrackingService);
    goalRepository = module.get(GoalRepository);
    historicalGoalRepository = module.get(HistoricalGoalRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('trackGoal', () => {
    let historicalGoalRepositoryCreateSpy: jest.SpyInstance;
    let historicalGoalRepositorySaveSpy: jest.SpyInstance;

    beforeEach(() => {
      historicalGoalRepositoryCreateSpy = jest
        .spyOn(historicalGoalRepository, 'create')
        .mockReturnValueOnce({} as any);

      historicalGoalRepositorySaveSpy = jest
        .spyOn(historicalGoalRepository, 'save')
        .mockResolvedValueOnce({} as any);
    });

    it('should call GoalRepository with correct parameters', async () => {
      const expectedTrackingId = 'tracking-id';

      const goalRepositoryFindOneSpy = jest
        .spyOn(goalRepository, 'findOne')
        .mockResolvedValueOnce({} as any);

      await firstValueFrom(
        underTest.trackGoal({ trackingId: expectedTrackingId } as any),
      );

      expect(goalRepositoryFindOneSpy).toHaveBeenCalledWith<
        Parameters<Repository<Goal>['findOne']>
      >({
        where: {
          id: expectedTrackingId,
        },
        relations: {
          historicalGoals: true,
        },
      });
    });

    describe('when the goal exists', () => {
      let foundGoal: Goal;

      beforeEach(() => {
        foundGoal = { id: 'found-goal' } as any;

        jest.spyOn(goalRepository, 'findOne').mockResolvedValueOnce(foundGoal);
      });

      it('should return the historical goal', async () => {
        const expected = { id: 'id' };

        historicalGoalRepositorySaveSpy
          .mockReset()
          .mockResolvedValueOnce(expected);

        const actual = await firstValueFrom(
          underTest.trackGoal({ trackingId: 'tracking-id' } as any),
        );

        expect(actual).toEqual(expected);
      });

      describe('when creating the historical goal', () => {
        it('should call HistoricalGoalRepository with correct parameters', async () => {
          const expectedNav = 100;
          const expectedDeposited = 200;
          const expectedProfit = 300;

          await firstValueFrom(
            underTest.trackGoal({
              trackingId: 'tracking-id',
              nav: expectedNav,
              deposited: expectedDeposited,
              profit: expectedProfit,
            } as any),
          );

          expect(historicalGoalRepositoryCreateSpy).toHaveBeenCalledWith<
            Parameters<Repository<HistoricalGoal>['create']>
          >({
            totalAmount: expectedNav,
            deposited: expectedDeposited,
            profit: expectedProfit,
          });
        });
      });

      describe('when saving the historical goal', () => {
        it('should call HistoricalGoalRepository with correct parameters', async () => {
          const expectedHistoricalGoal = { id: 'historical-goal' };

          historicalGoalRepositoryCreateSpy
            .mockReset()
            .mockReturnValueOnce(expectedHistoricalGoal);

          await firstValueFrom(
            underTest.trackGoal({ trackingId: 'tracking-id' } as any),
          );

          expect(historicalGoalRepositorySaveSpy).toHaveBeenCalledWith({
            ...expectedHistoricalGoal,
            // TODO: Fix this to properly test that this goal is actually assigned
            goal: Promise.resolve(foundGoal),
          });
        });
      });
    });

    describe('when the goal does not exist', () => {
      let createdGoal: Goal;

      let goalRepositoryCreateSpy: jest.SpyInstance;
      let goalRepositorySaveSpy: jest.SpyInstance;

      beforeEach(() => {
        createdGoal = { id: 'created-goal' } as any;

        jest.spyOn(goalRepository, 'findOne').mockResolvedValueOnce(null);

        goalRepositoryCreateSpy = jest
          .spyOn(goalRepository, 'create')
          .mockReturnValueOnce(createdGoal);

        goalRepositorySaveSpy = jest
          .spyOn(goalRepository, 'save')
          .mockResolvedValueOnce({} as any);
      });

      describe('when creating the goal', () => {
        it('should call GoalRepository with correct parameters', async () => {
          const expectedTrackingId = 'tracking-id';
          const expectedGoalType = 'goal-type';
          const expectedName = 'goal-name';

          await firstValueFrom(
            underTest.trackGoal({
              name: expectedName,
              trackingId: expectedTrackingId,
              goal_type: expectedGoalType,
            } as any),
          );

          expect(goalRepositoryCreateSpy).toHaveBeenCalledWith<
            Parameters<Repository<Goal>['create']>
          >({
            id: expectedTrackingId,
            goalType: expectedGoalType as any,
            name: expectedName,
          });
        });
      });

      describe('when saving the goal', () => {
        it('should call GoalRepository with correct parameters', async () => {
          const expectedGoal = { id: 'goal' };

          goalRepositoryCreateSpy.mockReset().mockReturnValueOnce(expectedGoal);

          await firstValueFrom(
            underTest.trackGoal({ trackingId: 'tracking-id' } as any),
          );

          expect(goalRepositorySaveSpy).toHaveBeenCalledWith(expectedGoal);
        });
      });

      describe('when creating the historical goal', () => {
        it('should call HistoricalGoalRepository with correct parameters', async () => {
          const expectedNav = 100;
          const expectedDeposited = 200;
          const expectedProfit = 300;

          await firstValueFrom(
            underTest.trackGoal({
              trackingId: 'tracking-id',
              nav: expectedNav,
              deposited: expectedDeposited,
              profit: expectedProfit,
            } as any),
          );

          expect(historicalGoalRepositoryCreateSpy).toHaveBeenCalledWith<
            Parameters<Repository<HistoricalGoal>['create']>
          >({
            totalAmount: expectedNav,
            deposited: expectedDeposited,
            profit: expectedProfit,
          });
        });
      });

      describe('when saving the historical goal', () => {
        it('should call HistoricalGoalRepository with correct parameters', async () => {
          const expectedHistoricalGoal = { id: 'historical-goal' };

          historicalGoalRepositoryCreateSpy
            .mockReset()
            .mockReturnValueOnce(expectedHistoricalGoal);

          await firstValueFrom(
            underTest.trackGoal({ trackingId: 'tracking-id' } as any),
          );

          expect(historicalGoalRepositorySaveSpy).toHaveBeenCalledWith({
            ...expectedHistoricalGoal,
            // TODO: Fix this to properly test that this goal is actually assigned
            goal: Promise.resolve(createdGoal),
          });
        });
      });
    });
  });
});

import { TestBed } from '@automock/jest';
import { Environment, EnvironmentService } from '@core/environment';
import { createMock } from '@golevelup/ts-jest';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronJobParameters } from 'cron';
import { CronService } from './cron.service';

jest.mock('cron', () => ({
  CronJob: jest.fn(),
}));

const cronJobMock = jest.mocked(CronJob);

describe('CronService', () => {
  let underTest: CronService;
  let environmentService: EnvironmentService;
  let schedulerRegistry: SchedulerRegistry;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(CronService).compile();

    underTest = unit;
    environmentService = unitRef.get(EnvironmentService);
    schedulerRegistry = unitRef.get(SchedulerRegistry);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    describe('when there are schedules', () => {
      let cronJob: CronJob;

      const environment = {
        USER_SCHEDULES: ['schedule-1', 'schedule-2'],
        USER_TIME_ZONE: 'time-zone',
      } as Readonly<Environment>;

      beforeEach(() => {
        cronJob = createMock<CronJob>();
        cronJobMock.mockReturnValue(cronJob);
      });

      beforeEach(() => {
        jest
          .spyOn(environmentService, 'getEnvironmentValue')
          .mockImplementation((key) => environment[key]);
      });

      it('should schedule all jobs', () => {
        const cronJobs = environment.USER_SCHEDULES.map((schedule) => {
          const job = { id: schedule, start: jest.fn() };
          cronJobMock.mockReturnValueOnce(job as any);
          return job;
        });

        const schedulerRegistrySpy = jest.spyOn(
          schedulerRegistry,
          'addCronJob',
        );

        underTest.onModuleInit();

        cronJobs.forEach((job, index) => {
          expect(schedulerRegistrySpy).toHaveBeenNthCalledWith(
            index + 1,
            environment.USER_SCHEDULES[index],
            job,
          );
        });
      });

      it('should create the jobs with the correct schedule parameters', () => {
        underTest.onModuleInit();

        environment.USER_SCHEDULES.forEach((scheduleTime, index) => {
          expect(cronJobMock).toHaveBeenNthCalledWith(
            index + 1,
            expect.objectContaining<CronJobParameters>({
              cronTime: scheduleTime,
              onTick: expect.any(Function),
              timeZone: environment.USER_TIME_ZONE,
            }),
          );
        });
      });

      it('should start all jobs', () => {
        underTest.onModuleInit();

        expect(cronJob.start).toHaveBeenCalledTimes(
          environment.USER_SCHEDULES.length,
        );
      });
    });

    describe('when there are no schedules', () => {
      const environment = {
        USER_SCHEDULES: [] as any,
      } as Readonly<Environment>;

      beforeEach(() => {
        jest
          .spyOn(environmentService, 'getEnvironmentValue')
          .mockImplementation((key) => environment[key]);
      });

      it('should not schedule any jobs', () => {
        const schedulerRegistrySpy = jest.spyOn(
          schedulerRegistry,
          'addCronJob',
        );

        underTest.onModuleInit();

        expect(schedulerRegistrySpy).not.toHaveBeenCalled();
      });
    });
  });
});

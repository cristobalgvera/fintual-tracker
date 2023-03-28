import { TestBed } from '@automock/jest';
import { Environment, EnvironmentService } from '@core/environment';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let underTest: DatabaseService;
  let environmentService: EnvironmentService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(DatabaseService).compile();

    underTest = unit;
    environmentService = unitRef.get(EnvironmentService);
  });

  describe('createTypeOrmOptions', () => {
    let environment: Environment;

    beforeEach(() => {
      environment = {
        DB_HOST: 'DB_HOST',
        DB_NAME: 'DB_NAME',
        DB_PASSWORD: 'DB_PASSWORD',
        DB_PORT: 1234,
        DB_USERNAME: 'DB_USERNAME',
      } as Environment;

      jest
        .spyOn(environmentService, 'getEnvironmentValue')
        .mockImplementation((key) => environment[key]);
    });

    describe('when assigning common attributes', () => {
      it('should contain the credential properties', () => {
        const expected: TypeOrmModuleOptions = {
          host: environment.DB_HOST,
          port: environment.DB_PORT,
          username: environment.DB_USERNAME,
          password: environment.DB_PASSWORD,
          database: environment.DB_NAME,
        };

        const actual = underTest.createTypeOrmOptions();

        expect(actual).toMatchObject(expected);
      });

      it('should contain some extra helper properties', () => {
        const expectedDefinedProperties: Array<keyof TypeOrmModuleOptions> = [
          'type',
          'migrationsTableName',
        ];

        const expected: TypeOrmModuleOptions = {
          autoLoadEntities: true,
          migrations: ['dist/**/migrations/*.js'],
          migrationsRun: true,
        };

        const actual = underTest.createTypeOrmOptions();

        expect(actual).toMatchObject(expected);
        expectedDefinedProperties.forEach(expect(actual).toHaveProperty);
      });

      it('should not contain some helper properties', () => {
        const nonExpectedProperties: Array<keyof TypeOrmModuleOptions> = [
          'synchronize',
        ];

        const actual = underTest.createTypeOrmOptions();

        nonExpectedProperties.forEach(expect(actual).not.toHaveProperty);
      });
    });

    describe('when the environment is production', () => {
      beforeEach(() => {
        environment.DB_SSL_CA = 'DB_SSL_CA';

        jest.spyOn(environmentService, 'isProd').mockReturnValueOnce(true);
      });

      it('should contain the custom credential properties', () => {
        const expected: TypeOrmModuleOptions = {
          ssl: {
            ca: environment.DB_SSL_CA,
          },
        };

        const actual = underTest.createTypeOrmOptions();

        expect(actual).toMatchObject(expected);
      });

      it('should not contain some helper properties', () => {
        const nonExpectedProperties: Array<keyof TypeOrmModuleOptions> = [
          'logging',
        ];

        const actual = underTest.createTypeOrmOptions();

        nonExpectedProperties.forEach(expect(actual).not.toHaveProperty);
      });
    });

    describe('when the environment is not production', () => {
      beforeEach(() => {
        jest.spyOn(environmentService, 'isProd').mockReturnValueOnce(false);
      });

      it('should not contain some properties', () => {
        const nonExpectedProperties: Array<
          keyof (TypeOrmModuleOptions & PostgresConnectionCredentialsOptions)
        > = ['ssl'];

        const actual = underTest.createTypeOrmOptions();

        nonExpectedProperties.forEach(expect(actual).not.toHaveProperty);
      });

      it('should contain some extra helper properties', () => {
        const expectedDefinedProperties: Array<keyof TypeOrmModuleOptions> = [
          'logging',
        ];

        const actual = underTest.createTypeOrmOptions();

        expectedDefinedProperties.forEach(expect(actual).toHaveProperty);
      });
    });
  });
});

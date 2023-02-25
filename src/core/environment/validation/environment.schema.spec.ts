import { Environment } from '../environment.type';
import { environmentSchema } from './environment.schema';

describe('EnvironmentSchema', () => {
  const commonEnvironment: Environment = {
    NODE_ENV: 'development',
    PORT: 3000,
    ENABLE_SWAGGER: true,
    DB_NAME: 'db-name',
    DB_PASSWORD: 'db-password',
    DB_USERNAME: 'db-username',
    DB_PORT: 1234,
    DB_HOST: 'db-host',
  };

  describe.each<Environment['NODE_ENV']>(['development', 'test', 'production'])(
    'when validating %s environment',
    (NODE_ENV) => {
      let validEnvironment: Readonly<Environment>;

      beforeEach(() => {
        validEnvironment = {
          ...commonEnvironment,
          NODE_ENV,
        };
      });

      describe('when environment is valid', () => {
        it.each<Partial<Environment>>([
          { PORT: undefined },
          { ENABLE_SWAGGER: undefined },
        ])(
          'should properly validate if environment has %s',
          (partialEnvironment) => {
            const environment = {
              ...validEnvironment,
              ...partialEnvironment,
            } as Environment;

            const validation = environmentSchema.validate(environment);

            expect(validation.error).toBeUndefined();
          },
        );
      });

      describe('when environment is invalid', () => {
        it.each<Partial<Record<keyof Environment, unknown>>>([
          { NODE_ENV: 'invalid' },
          { PORT: 'invalid' },
          { DB_PORT: undefined },
          { DB_PORT: 'invalid' },
          { DB_USERNAME: undefined },
          { DB_USERNAME: 1234 },
          { DB_USERNAME: '' },
          { DB_PASSWORD: undefined },
          { DB_PASSWORD: 1234 },
          { DB_PASSWORD: '' },
          { DB_NAME: undefined },
          { DB_NAME: 1234 },
          { DB_NAME: '' },
          { DB_HOST: undefined },
          { DB_HOST: 1234 },
          { DB_HOST: '' },
        ])('should invalidate if environment has %s', (partialEnvironment) => {
          const environment = {
            ...validEnvironment,
            ...partialEnvironment,
          } as Environment;

          const validation = environmentSchema.validate(environment);

          expect(validation.error).toBeDefined();
        });
      });
    },
  );
});

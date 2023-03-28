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
    TRACKING_BASE_URL: 'http://localhost:3000',
    TRACKING_USER_EMAIL: 'user@email.com',
    TRACKING_USER_PASSWORD: 'password',
  };

  describe.each<Environment['NODE_ENV']>(['development', 'test', 'production'])(
    'when validating %s environment with common variables',
    (NODE_ENV) => {
      let validEnvironment: Readonly<Environment>;

      beforeEach(() => {
        validEnvironment = {
          ...commonEnvironment,
          NODE_ENV,
        };

        if (NODE_ENV === 'production') {
          validEnvironment = {
            ...validEnvironment,
            DB_SSL_CA: 'db-ssl-ca',
          };
        }
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
          { TRACKING_BASE_URL: undefined },
          { TRACKING_BASE_URL: 'not-url' },
          { TRACKING_USER_EMAIL: undefined },
          { TRACKING_USER_EMAIL: 'not-email' },
          { TRACKING_USER_PASSWORD: undefined },
          { TRACKING_USER_PASSWORD: 1234 },
          { TRACKING_USER_PASSWORD: '' },
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

  describe('when validating production environment', () => {
    let validEnvironment: Readonly<Environment>;

    beforeEach(() => {
      validEnvironment = {
        ...commonEnvironment,
        NODE_ENV: 'production',
        DB_SSL_CA: 'db-ssl-ca',
      };
    });

    describe('when environment is valid', () => {
      it.each<Partial<Environment>>([{ ...validEnvironment }])(
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
        { DB_SSL_CA: undefined },
        { DB_SSL_CA: 1234 },
        { DB_SSL_CA: '' },
      ])('should invalidate if environment has %s', (partialEnvironment) => {
        const environment = {
          ...validEnvironment,
          ...partialEnvironment,
        } as Environment;

        const validation = environmentSchema.validate(environment);

        expect(validation.error).toBeDefined();
      });
    });
  });

  describe.each<Environment['NODE_ENV']>(['development', 'test'])(
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
        it.each<Partial<Environment>>([{ DB_SSL_CA: undefined }])(
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
          { DB_SSL_CA: 'some-string' },
          { DB_SSL_CA: '' },
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

import cron from 'cron-validate';
import * as Joi from 'joi';
import { Environment } from '../environment.type';

const productionEnvironmentSchema: Joi.StrictSchemaMap<Environment> = {
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(8080),
  ENABLE_SWAGGER: Joi.boolean().default(true),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SSL_CA: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().port().required(),
  REDIS_AUTH: Joi.string().required(),
  TRACKING_BASE_URL: Joi.string().uri().required(),
  TRACKING_USER_EMAIL: Joi.string().email().required(),
  TRACKING_USER_PASSWORD: Joi.string().required(),
  USER_TIME_ZONE: Joi.string().optional(),
  USER_SCHEDULES: Joi.array()
    .items(
      Joi.string().custom((value) => {
        const cronResult = cron(value);

        if (!cronResult.isValid())
          throw new Error(`Invalid cron: ${cronResult.getError().join(',')}`);

        return value;
      }),
      'Validate if cron expression is valid',
    )
    .required(),
};

export const environmentSchema = Joi.object<Environment, true>({
  ...productionEnvironmentSchema,
}).when(Joi.object({ NODE_ENV: Joi.invalid('production') }).unknown(), {
  then: Joi.object<Environment, true>({
    ...productionEnvironmentSchema,
    DB_SSL_CA: Joi.string().forbidden(),
  }),
});

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
};

export const environmentSchema = Joi.object<Environment, true>(
  productionEnvironmentSchema,
);

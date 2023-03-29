import { Transform } from 'class-transformer';

export class Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  ENABLE_SWAGGER: boolean;
  DB_HOST?: string;
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_USERNAME: string;
  TRACKING_BASE_URL: string;
  TRACKING_USER_EMAIL: string;
  TRACKING_USER_PASSWORD: string;
  USER_TIME_ZONE?: string;

  @Transform(({ value }) => Buffer.from(value, 'base64').toString('ascii'))
  DB_SSL_CA?: string;
}

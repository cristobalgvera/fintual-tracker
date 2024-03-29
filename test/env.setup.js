/*
 * This file should contain any environment variables
 * that are explicitly required in the ConfigModule
 *
 * Example:
 * process.env.SOME_REQUIRED_ENV_VAR = 'some custom value'
 *
 * By doing this, we can produce an error when launching the service
 * if the variable is not set, and avoid that error when testing it.
 */

process.env.DB_HOST = 'localhost';
process.env.DB_PORT = 1234;
process.env.DB_USERNAME = 'username';
process.env.DB_PASSWORD = 'password';
process.env.DB_NAME = 'database';
process.env.TRACKING_BASE_URL = 'http://localhost:3000';
process.env.TRACKING_USER_EMAIL = 'email@example.com';
process.env.TRACKING_USER_PASSWORD = 'password';
process.env.USER_SCHEDULES = JSON.stringify([]);

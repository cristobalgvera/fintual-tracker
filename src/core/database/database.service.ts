import { EnvironmentService } from '@core/environment';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly environmentService: EnvironmentService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const options: TypeOrmModuleOptions = {
      type: 'postgres',
      host: this.environmentService.getEnvironmentValue('DB_HOST'),
      port: this.environmentService.getEnvironmentValue('DB_PORT'),
      username: this.environmentService.getEnvironmentValue('DB_USERNAME'),
      password: this.environmentService.getEnvironmentValue('DB_PASSWORD'),
      database: this.environmentService.getEnvironmentValue('DB_NAME'),
      autoLoadEntities: true,
      migrations: ['dist/**/migrations/*.js'],
      migrationsTableName: 'migrations_typeorm',
      migrationsRun: true,
    };

    if (this.environmentService.isProd())
      return {
        ...options,
        ssl: {
          ca: this.environmentService.getEnvironmentValue('DB_SSL_CA'),
        },
      };

    return {
      ...options,
      logging: true,
    };
  }
}

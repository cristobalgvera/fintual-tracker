import { DatabaseModule } from '@core/database';
import { EnvironmentModule } from '@core/environment';
import { CronModule } from '@features/cron';
import { Logger, Module } from '@nestjs/common';

@Module({
  imports: [EnvironmentModule, DatabaseModule, CronModule],
  providers: [Logger],
})
export class AppModule {}

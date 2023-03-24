import { EnvironmentModule, EnvironmentService } from '@core/environment';

import { ErrorModule } from '@core/error';
import { AccessTokenModule } from '@features/access-token';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => ({
        baseURL: environmentService.getEnvironmentValue('TRACKING_BASE_URL'),
      }),
    }),
    EnvironmentModule,
    ErrorModule,
    AccessTokenModule,
  ],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}

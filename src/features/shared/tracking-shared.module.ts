import { EnvironmentModule, EnvironmentService } from '@core/environment';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    EnvironmentModule,
    HttpModule.registerAsync({
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => ({
        baseURL: environmentService.getEnvironmentValue('TRACKING_BASE_URL'),
      }),
    }),
  ],
  exports: [HttpModule],
})
export class TrackingSharedModule {}

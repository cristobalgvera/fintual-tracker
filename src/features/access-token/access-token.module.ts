import { EnvironmentModule, EnvironmentService } from '@core/environment';
import { ErrorModule } from '@core/error';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AccessTokenService } from './access-token.service';

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
  ],
  providers: [AccessTokenService],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}

import { EnvironmentModule } from '@core/environment';
import { ErrorModule } from '@core/error';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnvironmentModule, ErrorModule],
  exports: [EnvironmentModule, ErrorModule],
})
export class SharedModule {}

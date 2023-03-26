import { SharedModule } from '@core/shared';
import { AccessTokenModule } from '@features/access-token';
import { TrackingSharedModule } from '@features/shared';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities';
import { GoalsService } from './goals.service';

@Module({
  imports: [
    SharedModule,
    TrackingSharedModule,
    AccessTokenModule,
    TypeOrmModule.forFeature([Goal]),
  ],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}

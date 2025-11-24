import { Module } from '@nestjs/common';
import { VetStationService } from './vet-station.service';
import { VetStationController } from './vet-station.controller';

@Module({
  controllers: [VetStationController],
  providers: [VetStationService],
  exports: [VetStationService],
})
export class VetStationModule {}

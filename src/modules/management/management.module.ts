import { Module } from '@nestjs/common';
import { RegionModule } from './region/region.module';
import { DistrictModule } from './district/district.module';
import { VetStationModule } from './vet-station/vet-station.module';

@Module({
  imports: [RegionModule, DistrictModule, VetStationModule],
})
export class ManagementModule {}

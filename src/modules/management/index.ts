import { Module } from '@nestjs/common';
export * from './region/region.module';
export * from './district/district.module';
export * from './vet-station/vet-station.module';

@Module({})
export class ManagementModule {}

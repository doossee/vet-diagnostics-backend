import { Module } from '@nestjs/common';
import { AnomalyDetectionService } from './anomaly-detection.service';
import { ReferenceRangeService } from './reference-range.service';
import {
  AnomalyDetectionController,
  ReferenceRangeController,
} from './anomaly-detection.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [AnomalyDetectionController, ReferenceRangeController],
  providers: [AnomalyDetectionService, ReferenceRangeService, PrismaService],
  exports: [AnomalyDetectionService, ReferenceRangeService],
})
export class AnomalyDetectionModule {}

import { Module } from '@nestjs/common';
import { LymphMobilityService } from './lymph-mobility.service';
import { LymphMobilityController } from './lymph-mobility.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [LymphMobilityController],
  providers: [LymphMobilityService, PrismaService],
})
export class LymphMobilityModule {}

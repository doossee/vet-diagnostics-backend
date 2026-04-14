import { Module } from '@nestjs/common';
import { SkinHumidityService } from './skin-humidity.service';
import { SkinHumidityController } from './skin-humidity.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [SkinHumidityController],
  providers: [SkinHumidityService, PrismaService],
})
export class SkinHumidityModule {}

import { Module } from '@nestjs/common';
import { TemperamentService } from './temperament.service';
import { TemperamentController } from './temperament.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [TemperamentController],
  providers: [TemperamentService, PrismaService],
})
export class TemperamentModule {}

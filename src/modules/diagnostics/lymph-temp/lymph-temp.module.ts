import { Module } from '@nestjs/common';
import { LymphTempService } from './lymph-temp.service';
import { LymphTempController } from './lymph-temp.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [LymphTempController],
  providers: [LymphTempService, PrismaService],
})
export class LymphTempModule {}

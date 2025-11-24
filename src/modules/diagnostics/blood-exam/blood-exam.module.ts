import { Module } from '@nestjs/common';
import { BloodExamService } from './blood-exam.service';
import { BloodExamController } from './blood-exam.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [BloodExamController],
  providers: [BloodExamService, PrismaService],
})
export class BloodExamModule {}

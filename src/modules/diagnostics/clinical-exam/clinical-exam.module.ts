import { Module } from '@nestjs/common';
import { ClinicalExamService } from './clinical-exam.service';
import { ClinicalExamController } from './clinical-exam.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [ClinicalExamController],
  providers: [ClinicalExamService, PrismaService],
})
export class ClinicalExamModule {}

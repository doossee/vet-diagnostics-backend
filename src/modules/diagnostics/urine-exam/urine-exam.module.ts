import { Module } from '@nestjs/common';
import { UrineExamService } from './urine-exam.service';
import { UrineExamController } from './urine-exam.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [UrineExamController],
  providers: [UrineExamService, PrismaService],
})
export class UrineExamModule {}

import { Module } from '@nestjs/common';
import { FecesExamService } from './feces-exam.service';
import { FecesExamController } from './feces-exam.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [FecesExamController],
  providers: [FecesExamService, PrismaService],
})
export class FecesExamModule {}

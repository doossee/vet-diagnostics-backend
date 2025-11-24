import { Module } from '@nestjs/common';
import { MucosaExamService } from './mucosa-exam.service';
import { MucosaExamController } from './mucosa-exam.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [MucosaExamController],
  providers: [MucosaExamService, PrismaService],
})
export class MucosaExamModule {}

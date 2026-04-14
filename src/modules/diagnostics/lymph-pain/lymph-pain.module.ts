import { Module } from '@nestjs/common';
import { LymphPainService } from './lymph-pain.service';
import { LymphPainController } from './lymph-pain.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [LymphPainController],
  providers: [LymphPainService, PrismaService],
})
export class LymphPainModule {}

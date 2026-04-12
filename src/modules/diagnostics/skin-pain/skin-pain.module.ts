import { Module } from '@nestjs/common';
import { SkinPainService } from './skin-pain.service';
import { SkinPainController } from './skin-pain.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [SkinPainController],
  providers: [SkinPainService, PrismaService],
})
export class SkinPainModule {}

import { Module } from '@nestjs/common';
import { SkinSensitivityService } from './skin-sensitivity.service';
import { SkinSensitivityController } from './skin-sensitivity.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [SkinSensitivityController],
  providers: [SkinSensitivityService, PrismaService],
})
export class SkinSensitivityModule {}

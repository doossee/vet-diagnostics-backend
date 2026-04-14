import { Module } from '@nestjs/common';
import { LymphSurfaceService } from './lymph-surface.service';
import { LymphSurfaceController } from './lymph-surface.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [LymphSurfaceController],
  providers: [LymphSurfaceService, PrismaService],
})
export class LymphSurfaceModule {}

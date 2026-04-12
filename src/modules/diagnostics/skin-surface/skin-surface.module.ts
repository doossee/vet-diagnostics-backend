import { Module } from '@nestjs/common';
import { SkinSurfaceService } from './skin-surface.service';
import { SkinSurfaceController } from './skin-surface.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [SkinSurfaceController],
  providers: [SkinSurfaceService, PrismaService],
})
export class SkinSurfaceModule {}

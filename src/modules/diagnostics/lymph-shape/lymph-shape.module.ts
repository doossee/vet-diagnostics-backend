import { Module } from '@nestjs/common';
import { LymphShapeService } from './lymph-shape.service';
import { LymphShapeController } from './lymph-shape.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [LymphShapeController],
  providers: [LymphShapeService, PrismaService],
})
export class LymphShapeModule {}

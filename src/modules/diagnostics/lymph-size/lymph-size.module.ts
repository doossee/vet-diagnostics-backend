import { Module } from '@nestjs/common';
import { LymphSizeService } from './lymph-size.service';
import { LymphSizeController } from './lymph-size.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [LymphSizeController],
  providers: [LymphSizeService, PrismaService],
})
export class LymphSizeModule {}

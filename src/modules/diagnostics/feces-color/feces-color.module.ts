import { Module } from '@nestjs/common';
import { FecesColorService } from './feces-color.service';
import { FecesColorController } from './feces-color.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [FecesColorController],
  providers: [FecesColorService, PrismaService],
})
export class FecesColorModule {}

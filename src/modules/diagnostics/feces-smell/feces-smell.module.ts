import { Module } from '@nestjs/common';
import { FecesSmellService } from './feces-smell.service';
import { FecesSmellController } from './feces-smell.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [FecesSmellController],
  providers: [FecesSmellService, PrismaService],
})
export class FecesSmellModule {}

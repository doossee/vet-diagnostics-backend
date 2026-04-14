import { Module } from '@nestjs/common';
import { LymphConsistencyService } from './lymph-consistency.service';
import { LymphConsistencyController } from './lymph-consistency.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [LymphConsistencyController],
  providers: [LymphConsistencyService, PrismaService],
})
export class LymphConsistencyModule {}

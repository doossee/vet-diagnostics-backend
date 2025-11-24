import { Module } from '@nestjs/common';
import { FecesConsistencyService } from './feces-consistency.service';
import { FecesConsistencyController } from './feces-consistency.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [FecesConsistencyController],
  providers: [FecesConsistencyService, PrismaService],
})
export class FecesConsistencyModule {}

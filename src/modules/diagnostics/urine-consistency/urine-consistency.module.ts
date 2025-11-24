import { Module } from '@nestjs/common';
import { UrineConsistencyService } from './urine-consistency.service';
import { UrineConsistencyController } from './urine-consistency.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [UrineConsistencyController],
  providers: [UrineConsistencyService, PrismaService],
})
export class UrineConsistencyModule {}

import { Module } from '@nestjs/common';
import { RumenFluidStateService } from './rumen-fluid-state.service';
import { RumenFluidStateController } from './rumen-fluid-state.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [RumenFluidStateController],
  providers: [RumenFluidStateService, PrismaService],
})
export class RumenFluidStateModule {}

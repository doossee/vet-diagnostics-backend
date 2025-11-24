import { Module } from '@nestjs/common';
import { UrineClarityService } from './urine-clarity.service';
import { UrineClarityController } from './urine-clarity.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [UrineClarityController],
  providers: [UrineClarityService, PrismaService],
})
export class UrineClarityModule {}

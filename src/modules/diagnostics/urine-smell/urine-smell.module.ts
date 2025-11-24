import { Module } from '@nestjs/common';
import { UrineSmellService } from './urine-smell.service';
import { UrineSmellController } from './urine-smell.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [UrineSmellController],
  providers: [UrineSmellService, PrismaService],
})
export class UrineSmellModule {}

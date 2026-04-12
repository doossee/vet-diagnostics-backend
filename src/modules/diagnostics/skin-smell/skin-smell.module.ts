import { Module } from '@nestjs/common';
import { SkinSmellService } from './skin-smell.service';
import { SkinSmellController } from './skin-smell.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [SkinSmellController],
  providers: [SkinSmellService, PrismaService],
})
export class SkinSmellModule {}

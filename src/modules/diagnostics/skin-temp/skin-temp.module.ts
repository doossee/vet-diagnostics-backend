import { Module } from '@nestjs/common';
import { SkinTempService } from './skin-temp.service';
import { SkinTempController } from './skin-temp.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [SkinTempController],
  providers: [SkinTempService, PrismaService],
})
export class SkinTempModule {}

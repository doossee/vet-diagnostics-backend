import { Module } from '@nestjs/common';
import { DownTypeService } from './down-type.service';
import { DownTypeController } from './down-type.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [DownTypeController],
  providers: [DownTypeService, PrismaService],
})
export class DownTypeModule {}

import { Module } from '@nestjs/common';
import { HairTypeService } from './hair-type.service';
import { HairTypeController } from './hair-type.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [HairTypeController],
  providers: [HairTypeService, PrismaService],
})
export class HairTypeModule {}

import { Module } from '@nestjs/common';
import { WoolTypeService } from './wool-type.service';
import { WoolTypeController } from './wool-type.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [WoolTypeController],
  providers: [WoolTypeService, PrismaService],
})
export class WoolTypeModule {}

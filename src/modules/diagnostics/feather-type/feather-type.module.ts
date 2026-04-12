import { Module } from '@nestjs/common';
import { FeatherTypeService } from './feather-type.service';
import { FeatherTypeController } from './feather-type.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [FeatherTypeController],
  providers: [FeatherTypeService, PrismaService],
})
export class FeatherTypeModule {}

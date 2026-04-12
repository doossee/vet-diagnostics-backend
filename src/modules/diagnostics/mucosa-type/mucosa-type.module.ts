import { Module } from '@nestjs/common';
import { MucosaTypeService } from './mucosa-type.service';
import { MucosaTypeController } from './mucosa-type.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [MucosaTypeController],
  providers: [MucosaTypeService, PrismaService],
})
export class MucosaTypeModule {}

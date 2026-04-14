import { Module } from '@nestjs/common';
import { ObesityTypeService } from './obesity-type.service';
import { ObesityTypeController } from './obesity-type.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [ObesityTypeController],
  providers: [ObesityTypeService, PrismaService],
})
export class ObesityTypeModule {}

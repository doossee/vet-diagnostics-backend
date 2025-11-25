import { Module } from '@nestjs/common';
import { UrineColorService } from './urine-color.service';
import { UrineColorController } from './urine-color.controller';

import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [UrineColorController],
  providers: [UrineColorService, PrismaService],
  exports: [UrineColorService],
})
export class UrineColorModule {}

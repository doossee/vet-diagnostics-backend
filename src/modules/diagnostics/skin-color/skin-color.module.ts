import { Module } from '@nestjs/common';
import { SkinColorService } from './skin-color.service';
import { SkinColorController } from './skin-color.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [SkinColorController],
  providers: [SkinColorService, PrismaService],
})
export class SkinColorModule {}

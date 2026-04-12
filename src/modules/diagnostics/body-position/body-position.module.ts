import { Module } from '@nestjs/common';
import { BodyPositionService } from './body-position.service';
import { BodyPositionController } from './body-position.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [BodyPositionController],
  providers: [BodyPositionService, PrismaService],
})
export class BodyPositionModule {}

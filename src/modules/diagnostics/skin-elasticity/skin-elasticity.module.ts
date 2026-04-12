import { Module } from '@nestjs/common';
import { SkinElasticityService } from './skin-elasticity.service';
import { SkinElasticityController } from './skin-elasticity.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [SkinElasticityController],
  providers: [SkinElasticityService, PrismaService],
})
export class SkinElasticityModule {}

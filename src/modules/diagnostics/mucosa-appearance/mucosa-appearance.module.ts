import { Module } from '@nestjs/common';
import { MucosaAppearanceService } from './mucosa-appearance.service';
import { MucosaAppearanceController } from './mucosa-appearance.controller';

import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [MucosaAppearanceController],
  providers: [MucosaAppearanceService, PrismaService],
  exports: [MucosaAppearanceService],
})
export class MucosaAppearanceModule {}

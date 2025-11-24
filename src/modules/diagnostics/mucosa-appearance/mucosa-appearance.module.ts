import { Module } from '@nestjs/common';
import { MucosaAppearanceService } from './mucosa-appearance.service';
import { MucosaAppearanceController } from './mucosa-appearance.controller';

@Module({
  controllers: [MucosaAppearanceController],
  providers: [MucosaAppearanceService],
  exports: [MucosaAppearanceService],
})
export class MucosaAppearanceModule {}

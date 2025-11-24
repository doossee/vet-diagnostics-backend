import { Module } from '@nestjs/common';
import { DiseaseCategoryService } from './disease-category.service';
import { DiseaseCategoryController } from './disease-category.controller';

@Module({
  controllers: [DiseaseCategoryController],
  providers: [DiseaseCategoryService],
  exports: [DiseaseCategoryService],
})
export class DiseaseCategoryModule {}

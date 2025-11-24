import { PartialType } from '@nestjs/swagger';
import { CreateDiseaseCategoryDto } from './create-disease-category.dto';

export class UpdateDiseaseCategoryDto extends PartialType(
  CreateDiseaseCategoryDto,
) {}

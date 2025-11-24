import { PartialType } from '@nestjs/swagger';
import { CreateMucosaAppearanceDto } from './create-mucosa-appearance.dto';

export class UpdateMucosaAppearanceDto extends PartialType(
  CreateMucosaAppearanceDto,
) {}

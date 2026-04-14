import { PartialType } from '@nestjs/swagger';
import { CreateSkinSensitivityDto } from './create-skin-sensitivity.dto';

export class UpdateSkinSensitivityDto extends PartialType(
  CreateSkinSensitivityDto,
) {}

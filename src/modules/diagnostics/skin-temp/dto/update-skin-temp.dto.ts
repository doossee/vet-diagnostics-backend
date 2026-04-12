import { PartialType } from '@nestjs/swagger';
import { CreateSkinTempDto } from './create-skin-temp.dto';

export class UpdateSkinTempDto extends PartialType(CreateSkinTempDto) {}

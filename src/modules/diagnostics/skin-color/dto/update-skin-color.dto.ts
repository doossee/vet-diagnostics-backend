import { PartialType } from '@nestjs/swagger';
import { CreateSkinColorDto } from './create-skin-color.dto';

export class UpdateSkinColorDto extends PartialType(CreateSkinColorDto) {}

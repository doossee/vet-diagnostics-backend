import { PartialType } from '@nestjs/swagger';
import { CreateSkinPainDto } from './create-skin-pain.dto';

export class UpdateSkinPainDto extends PartialType(CreateSkinPainDto) {}

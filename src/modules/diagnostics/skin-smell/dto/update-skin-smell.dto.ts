import { PartialType } from '@nestjs/swagger';
import { CreateSkinSmellDto } from './create-skin-smell.dto';

export class UpdateSkinSmellDto extends PartialType(CreateSkinSmellDto) {}

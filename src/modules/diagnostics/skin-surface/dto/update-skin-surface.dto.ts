import { PartialType } from '@nestjs/swagger';
import { CreateSkinSurfaceDto } from './create-skin-surface.dto';

export class UpdateSkinSurfaceDto extends PartialType(CreateSkinSurfaceDto) {}

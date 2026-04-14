import { PartialType } from '@nestjs/swagger';
import { CreateLymphSurfaceDto } from './create-lymph-surface.dto';

export class UpdateLymphSurfaceDto extends PartialType(CreateLymphSurfaceDto) {}

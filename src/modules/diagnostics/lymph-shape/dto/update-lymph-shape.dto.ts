import { PartialType } from '@nestjs/swagger';
import { CreateLymphShapeDto } from './create-lymph-shape.dto';

export class UpdateLymphShapeDto extends PartialType(CreateLymphShapeDto) {}

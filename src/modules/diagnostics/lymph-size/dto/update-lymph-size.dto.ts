import { PartialType } from '@nestjs/swagger';
import { CreateLymphSizeDto } from './create-lymph-size.dto';

export class UpdateLymphSizeDto extends PartialType(CreateLymphSizeDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateLymphPainDto } from './create-lymph-pain.dto';

export class UpdateLymphPainDto extends PartialType(CreateLymphPainDto) {}

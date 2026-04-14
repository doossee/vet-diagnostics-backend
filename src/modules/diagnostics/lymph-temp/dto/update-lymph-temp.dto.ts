import { PartialType } from '@nestjs/swagger';
import { CreateLymphTempDto } from './create-lymph-temp.dto';

export class UpdateLymphTempDto extends PartialType(CreateLymphTempDto) {}

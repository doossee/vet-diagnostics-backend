import { PartialType } from '@nestjs/swagger';
import { CreateLymphConsistencyDto } from './create-lymph-consistency.dto';

export class UpdateLymphConsistencyDto extends PartialType(
  CreateLymphConsistencyDto,
) {}

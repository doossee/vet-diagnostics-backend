import { PartialType } from '@nestjs/swagger';
import { CreateFecesConsistencyDto } from './create-feces-consistency.dto';

export class UpdateFecesConsistencyDto extends PartialType(
  CreateFecesConsistencyDto,
) {}

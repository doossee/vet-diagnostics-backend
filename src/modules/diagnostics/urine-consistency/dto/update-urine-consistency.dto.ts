import { PartialType } from '@nestjs/swagger';
import { CreateUrineConsistencyDto } from './create-urine-consistency.dto';

export class UpdateUrineConsistencyDto extends PartialType(
  CreateUrineConsistencyDto,
) {}

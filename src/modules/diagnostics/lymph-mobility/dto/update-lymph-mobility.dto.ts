import { PartialType } from '@nestjs/swagger';
import { CreateLymphMobilityDto } from './create-lymph-mobility.dto';

export class UpdateLymphMobilityDto extends PartialType(
  CreateLymphMobilityDto,
) {}

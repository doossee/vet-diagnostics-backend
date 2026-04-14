import { PartialType } from '@nestjs/swagger';
import { CreateTemperamentDto } from './create-temperament.dto';

export class UpdateTemperamentDto extends PartialType(CreateTemperamentDto) {}

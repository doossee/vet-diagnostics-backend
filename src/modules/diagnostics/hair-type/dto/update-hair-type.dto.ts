import { PartialType } from '@nestjs/swagger';
import { CreateHairTypeDto } from './create-hair-type.dto';

export class UpdateHairTypeDto extends PartialType(CreateHairTypeDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateFeatherTypeDto } from './create-feather-type.dto';

export class UpdateFeatherTypeDto extends PartialType(CreateFeatherTypeDto) {}

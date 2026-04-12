import { PartialType } from '@nestjs/swagger';
import { CreateMucosaTypeDto } from './create-mucosa-type.dto';

export class UpdateMucosaTypeDto extends PartialType(CreateMucosaTypeDto) {}

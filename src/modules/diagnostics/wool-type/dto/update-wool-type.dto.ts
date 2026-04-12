import { PartialType } from '@nestjs/swagger';
import { CreateWoolTypeDto } from './create-wool-type.dto';

export class UpdateWoolTypeDto extends PartialType(CreateWoolTypeDto) {}

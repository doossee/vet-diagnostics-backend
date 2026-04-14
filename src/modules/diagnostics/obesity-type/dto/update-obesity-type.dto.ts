import { PartialType } from '@nestjs/swagger';
import { CreateObesityTypeDto } from './create-obesity-type.dto';

export class UpdateObesityTypeDto extends PartialType(CreateObesityTypeDto) {}

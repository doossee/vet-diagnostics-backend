import { PartialType } from '@nestjs/swagger';
import { CreateDownTypeDto } from './create-down-type.dto';

export class UpdateDownTypeDto extends PartialType(CreateDownTypeDto) {}

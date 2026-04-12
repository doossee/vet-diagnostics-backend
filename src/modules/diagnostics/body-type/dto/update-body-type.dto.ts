import { PartialType } from '@nestjs/swagger';
import { CreateBodyTypeDto } from './create-body-type.dto';

export class UpdateBodyTypeDto extends PartialType(CreateBodyTypeDto) {}

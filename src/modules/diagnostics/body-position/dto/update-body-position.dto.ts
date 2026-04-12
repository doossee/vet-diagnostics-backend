import { PartialType } from '@nestjs/swagger';
import { CreateBodyPositionDto } from './create-body-position.dto';

export class UpdateBodyPositionDto extends PartialType(CreateBodyPositionDto) {}

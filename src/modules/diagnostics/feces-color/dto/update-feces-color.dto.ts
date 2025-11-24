import { PartialType } from '@nestjs/swagger';
import { CreateFecesColorDto } from './create-feces-color.dto';

export class UpdateFecesColorDto extends PartialType(CreateFecesColorDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateUrineColorDto } from './create-urine-color.dto';

export class UpdateUrineColorDto extends PartialType(CreateUrineColorDto) {}

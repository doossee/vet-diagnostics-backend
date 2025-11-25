import { PartialType } from '@nestjs/swagger';
import { CreateAnimalColorDto } from './create-animal-color.dto';

export class UpdateAnimalColorDto extends PartialType(CreateAnimalColorDto) {}

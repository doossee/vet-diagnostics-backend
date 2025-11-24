import { PartialType } from '@nestjs/swagger';
import { CreateAnimalAnimalColorDto } from './create-animal-color.dto';

export class UpdateAnimalAnimalColorDto extends PartialType(
  CreateAnimalAnimalColorDto,
) {}

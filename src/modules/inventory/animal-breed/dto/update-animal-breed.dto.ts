import { PartialType } from '@nestjs/swagger';
import { CreateAnimalAnimalBreedDto } from './create-animal-breed.dto';

export class UpdateAnimalAnimalBreedDto extends PartialType(
  CreateAnimalAnimalBreedDto,
) {}

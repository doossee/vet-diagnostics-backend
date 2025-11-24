import { Module } from '@nestjs/common';
import { AnimalAnimalBreedService } from './animal-breed.service';
import { AnimalAnimalBreedController } from './animal-breed.controller';

@Module({
  controllers: [AnimalAnimalBreedController],
  providers: [AnimalAnimalBreedService],
  exports: [AnimalAnimalBreedService],
})
export class AnimalAnimalBreedModule {}

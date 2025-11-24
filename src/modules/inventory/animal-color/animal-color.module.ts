import { Module } from '@nestjs/common';
import { AnimalAnimalColorService } from './animal-color.service';
import { AnimalAnimalColorController } from './animal-color.controller';

@Module({
  controllers: [AnimalAnimalColorController],
  providers: [AnimalAnimalColorService],
  exports: [AnimalAnimalColorService],
})
export class AnimalAnimalColorModule {}

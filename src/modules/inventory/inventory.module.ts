import { Module } from '@nestjs/common';
import { AnimalModule } from './animal/animal.module';
import { AnimalTypeModule } from './animal-type/animal-type.module';
import { AnimalBreedModule } from './animal-breed/animal-breed.module';
import { AnimalColorModule } from './animal-color/animal-color.module';

@Module({
  imports: [
    AnimalModule,
    AnimalTypeModule,
    AnimalBreedModule,
    AnimalColorModule,
  ],
})
export class InventoryModule {}

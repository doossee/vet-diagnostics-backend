import { Module } from '@nestjs/common';
import { AnimalModule } from './animal/animal.module';
import { AnimalTypeModule } from './animal-type/animal-type.module';
import { AnimalBreedModule } from './animal-breed/animal-breed.module';
import { AnimalColorModule } from './animal-color/animal-color.module';
import { AnimalSexModule } from './animal-sex/animal-sex.module';

@Module({
  imports: [
    AnimalModule,
    AnimalTypeModule,
    AnimalBreedModule,
    AnimalColorModule,
    AnimalSexModule,
  ],
})
export class InventoryModule {}

import { Module } from '@nestjs/common';
import { AnimalTypeService } from './animal-type.service';
import { AnimalTypeController } from './animal-type.controller';

@Module({
  controllers: [AnimalTypeController],
  providers: [AnimalTypeService],
  exports: [AnimalTypeService],
})
export class AnimalTypeModule {}

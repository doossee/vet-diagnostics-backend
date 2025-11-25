import { Module } from '@nestjs/common';
import { AnimalColorService } from './animal-color.service';
import { AnimalColorController } from './animal-color.controller';

@Module({
  controllers: [AnimalColorController],
  providers: [AnimalColorService],
  exports: [AnimalColorService],
})
export class AnimalColorModule {}

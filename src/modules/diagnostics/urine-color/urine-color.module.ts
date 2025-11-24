import { Module } from '@nestjs/common';
import { UrineColorService } from './urine-color.service';
import { UrineColorController } from './urine-color.controller';

@Module({
  controllers: [UrineColorController],
  providers: [UrineColorService],
  exports: [UrineColorService],
})
export class UrineColorModule {}

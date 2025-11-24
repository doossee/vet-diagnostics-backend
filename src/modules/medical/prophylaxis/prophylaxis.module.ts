import { Module } from '@nestjs/common';
import { ProphylaxisService } from './prophylaxis.service';
import { ProphylaxisController } from './prophylaxis.controller';

@Module({
  controllers: [ProphylaxisController],
  providers: [ProphylaxisService],
  exports: [ProphylaxisService],
})
export class ProphylaxisModule {}

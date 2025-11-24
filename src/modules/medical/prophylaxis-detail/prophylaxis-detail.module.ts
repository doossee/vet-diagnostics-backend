import { Module } from '@nestjs/common';
import { ProphylaxisDetailService } from './prophylaxis-detail.service';
import { ProphylaxisDetailController } from './prophylaxis-detail.controller';

@Module({
  controllers: [ProphylaxisDetailController],
  providers: [ProphylaxisDetailService],
  exports: [ProphylaxisDetailService],
})
export class ProphylaxisDetailModule {}

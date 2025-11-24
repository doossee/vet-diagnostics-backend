import { Module } from '@nestjs/common';
import { ProphylaxisItemService } from './prophylaxis-item.service';
import { ProphylaxisItemController } from './prophylaxis-item.controller';

@Module({
  controllers: [ProphylaxisItemController],
  providers: [ProphylaxisItemService],
  exports: [ProphylaxisItemService],
})
export class ProphylaxisItemModule {}

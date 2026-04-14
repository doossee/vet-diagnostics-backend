import { Global, Module } from '@nestjs/common';
import { PaginationService, ExcelService } from './services';

@Global()
@Module({
  providers: [PaginationService, ExcelService],
  exports: [PaginationService, ExcelService],
})
export class SharedModule {}

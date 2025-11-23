import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PaginationService } from 'src/shared/services';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PaginationService],
  exports: [UsersService],
})
export class UsersModule {}

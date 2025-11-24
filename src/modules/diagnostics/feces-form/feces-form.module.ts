import { Module } from '@nestjs/common';
import { FecesFormService } from './feces-form.service';
import { FecesFormController } from './feces-form.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [FecesFormController],
  providers: [FecesFormService, PrismaService],
})
export class FecesFormModule {}

import { Module } from '@nestjs/common';
import { AnimalSexService } from './animal-sex.service';
import { AnimalSexController } from './animal-sex.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [AnimalSexController],
  providers: [AnimalSexService, PrismaService],
})
export class AnimalSexModule {}

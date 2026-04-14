import { Module } from '@nestjs/common';
import { ConstitutionService } from './constitution.service';
import { ConstitutionController } from './constitution.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [ConstitutionController],
  providers: [ConstitutionService, PrismaService],
})
export class ConstitutionModule {}

import { Module } from '@nestjs/common';
import { MedicalSessionService } from './medical-session.service';
import { MedicalSessionController } from './medical-session.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [MedicalSessionController],
  providers: [MedicalSessionService, PrismaService],
})
export class MedicalSessionModule {}

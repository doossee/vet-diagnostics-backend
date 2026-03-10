import { PartialType } from '@nestjs/swagger';
import { CreateMedicalSessionDto } from './create-medical-session.dto';
import { IsEnum, IsOptional } from 'class-validator';

enum SessionStatusDto {
  DRAFT = 'DRAFT',
  READY = 'READY',
}

export class UpdateMedicalSessionDto extends PartialType(
  CreateMedicalSessionDto,
) {
  @IsEnum(SessionStatusDto)
  @IsOptional()
  status?: SessionStatusDto;
}

import { PartialType } from '@nestjs/swagger';
import { CreateClinicalExamDto } from './create-clinical-exam.dto';

export class UpdateClinicalExamDto extends PartialType(CreateClinicalExamDto) {}

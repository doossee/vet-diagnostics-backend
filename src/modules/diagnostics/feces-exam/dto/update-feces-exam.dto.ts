import { PartialType } from '@nestjs/swagger';
import { CreateFecesExamDto } from './create-feces-exam.dto';

export class UpdateFecesExamDto extends PartialType(CreateFecesExamDto) {}

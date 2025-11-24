import { PartialType } from '@nestjs/swagger';
import { CreateUrineExamDto } from './create-urine-exam.dto';

export class UpdateUrineExamDto extends PartialType(CreateUrineExamDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateBloodExamDto } from './create-blood-exam.dto';

export class UpdateBloodExamDto extends PartialType(CreateBloodExamDto) {}

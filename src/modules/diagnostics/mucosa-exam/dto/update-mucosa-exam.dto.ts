import { PartialType } from '@nestjs/swagger';
import { CreateMucosaExamDto } from './create-mucosa-exam.dto';

export class UpdateMucosaExamDto extends PartialType(CreateMucosaExamDto) {}

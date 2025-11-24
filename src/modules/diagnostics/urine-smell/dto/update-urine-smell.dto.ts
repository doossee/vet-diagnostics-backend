import { PartialType } from '@nestjs/swagger';
import { CreateUrineSmellDto } from './create-urine-smell.dto';

export class UpdateUrineSmellDto extends PartialType(CreateUrineSmellDto) {}

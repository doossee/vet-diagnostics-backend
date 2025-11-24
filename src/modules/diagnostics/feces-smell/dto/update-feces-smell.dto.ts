import { PartialType } from '@nestjs/swagger';
import { CreateFecesSmellDto } from './create-feces-smell.dto';

export class UpdateFecesSmellDto extends PartialType(CreateFecesSmellDto) {}

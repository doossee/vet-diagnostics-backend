import { PartialType } from '@nestjs/swagger';
import { CreateConstitutionDto } from './create-constitution.dto';

export class UpdateConstitutionDto extends PartialType(CreateConstitutionDto) {}

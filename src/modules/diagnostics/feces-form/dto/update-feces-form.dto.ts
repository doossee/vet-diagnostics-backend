import { PartialType } from '@nestjs/swagger';
import { CreateFecesFormDto } from './create-feces-form.dto';

export class UpdateFecesFormDto extends PartialType(CreateFecesFormDto) {}

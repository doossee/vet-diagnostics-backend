import { PartialType } from '@nestjs/swagger';
import { CreateProphylaxisDto } from './create-prophylaxis.dto';

export class UpdateProphylaxisDto extends PartialType(CreateProphylaxisDto) {}

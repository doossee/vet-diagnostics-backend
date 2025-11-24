import { PartialType } from '@nestjs/swagger';
import { CreateUrineClarityDto } from './create-urine-clarity.dto';

export class UpdateUrineClarityDto extends PartialType(CreateUrineClarityDto) {}

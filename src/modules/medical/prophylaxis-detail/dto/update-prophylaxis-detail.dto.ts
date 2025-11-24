import { PartialType } from '@nestjs/swagger';
import { CreateProphylaxisDetailDto } from './create-prophylaxis-detail.dto';

export class UpdateProphylaxisDetailDto extends PartialType(
  CreateProphylaxisDetailDto,
) {}

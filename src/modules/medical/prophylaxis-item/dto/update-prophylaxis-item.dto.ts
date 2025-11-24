import { PartialType } from '@nestjs/swagger';
import { CreateProphylaxisItemDto } from './create-prophylaxis-item.dto';

export class UpdateProphylaxisItemDto extends PartialType(
  CreateProphylaxisItemDto,
) {}

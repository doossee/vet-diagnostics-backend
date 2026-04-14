import { PartialType } from '@nestjs/swagger';
import { CreateRumenFluidStateDto } from './create-rumen-fluid-state.dto';

export class UpdateRumenFluidStateDto extends PartialType(
  CreateRumenFluidStateDto,
) {}

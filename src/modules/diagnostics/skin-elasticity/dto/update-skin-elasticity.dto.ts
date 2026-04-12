import { PartialType } from '@nestjs/swagger';
import { CreateSkinElasticityDto } from './create-skin-elasticity.dto';

export class UpdateSkinElasticityDto extends PartialType(CreateSkinElasticityDto) {}

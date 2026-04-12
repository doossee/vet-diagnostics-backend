import { PartialType } from '@nestjs/swagger';
import { CreateSkinHumidityDto } from './create-skin-humidity.dto';

export class UpdateSkinHumidityDto extends PartialType(CreateSkinHumidityDto) {}

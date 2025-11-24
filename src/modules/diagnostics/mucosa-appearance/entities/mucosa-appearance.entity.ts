import { ApiProperty } from '@nestjs/swagger';
import { MucosaAppearance, MucosaType } from '@prisma/client';
import { Expose } from 'class-transformer';

export class MucosaAppearanceEntity implements MucosaAppearance {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Name in Russian', example: 'Бледный' })
  @Expose()
  name_ru: string;

  @ApiProperty({ description: 'Name in Uzbek', example: 'Oqargan' })
  @Expose()
  name_uz: string;

  @ApiProperty({ enum: MucosaType, example: MucosaType.ORAL })
  @Expose()
  mucosaType: MucosaType;

  @ApiProperty({ format: 'uuid' })
  @Expose()
  animalTypeId: string;
}

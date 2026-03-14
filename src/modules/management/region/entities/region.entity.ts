import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Region } from 'src/generated/prisma/client';
import { Expose } from 'class-transformer';
import { DistrictEntity } from '../../district/entities';

export class RegionEntity implements Region {
  @ApiProperty({
    description: 'Unique identifier for the region',
    example: 1,
    type: Number,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Name of the region in Russian',
    example: 'Ташкент',
  })
  @Expose()
  nameRu: string;

  @ApiProperty({
    description: 'Name of the region in Uzbek',
    example: 'Toshkent',
  })
  @Expose()
  nameUz: string;

  @ApiPropertyOptional({
    description: 'List of districts in this region',
    type: () => [DistrictEntity],
  })
  @Expose()
  districts?: DistrictEntity[];
}

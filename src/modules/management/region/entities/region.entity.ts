import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DistrictEntity } from '../../district/entities';

export class RegionEntity {
  @ApiProperty({
    description: 'Unique identifier for the region',
    example: 1,
    type: Number,
  })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Localized name', example: { ru: 'Название', uz: 'Nomi' } })
  @Expose()
  name: { ru: string; uz: string };

  @ApiPropertyOptional({
    description: 'List of districts in this region',
    type: () => [DistrictEntity],
  })
  @Expose()
  districts?: DistrictEntity[];
}

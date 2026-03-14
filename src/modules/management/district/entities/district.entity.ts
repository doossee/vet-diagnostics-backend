import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { District } from 'src/generated/prisma/client';
import { Expose } from 'class-transformer';
import { RegionEntity } from '../../region/entities';

export class DistrictEntity implements District {
  @ApiProperty({
    description: 'Unique identifier for the district',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of the district in Russian',
    example: 'Юнусабад',
  })
  @Expose()
  nameRu: string;

  @ApiProperty({
    description: 'Name of the district in Uzbek',
    example: 'Yunusabad',
  })
  @Expose()
  nameUz: string;

  @ApiProperty({
    description: 'ID of the parent region',
    example: 1,
  })
  @Expose()
  regionId: number;

  @ApiPropertyOptional({
    description: 'Parent region details',
    type: () => RegionEntity,
  })
  @Expose()
  region?: RegionEntity;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DistrictEntity } from '../../district/entities';

export class VetStationEntity {
  @ApiProperty({
    description: 'Unique identifier for the vet station',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Localized name', example: { ru: 'Название', uz: 'Nomi' } })
  @Expose()
  name: { ru: string; uz: string };

  @ApiProperty({
    description: 'Address of the vet station',
    example: 'Улица Навои, 15',
  })
  @Expose()
  address: string;

  @ApiProperty({
    description: 'ID of the district',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  @Expose()
  districtId: string;

  @ApiProperty({
    description: 'Created timestamp',
    example: '2023-08-15T12:34:56.789Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Updated timestamp',
    example: '2023-08-15T12:34:56.789Z',
  })
  @Expose()
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'District details',
    type: () => DistrictEntity,
  })
  @Expose()
  district?: DistrictEntity;
}

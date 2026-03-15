import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DiseaseCategoryEntity } from '../../disease-category/entities';

export class DiseaseEntity {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Localized name', example: { ru: 'Название', uz: 'Nomi' } })
  @Expose()
  name: { ru: string; uz: string };

  @ApiProperty()
  @Expose()
  diseaseCategoryId: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty({ type: () => DiseaseCategoryEntity, required: false })
  @Expose()
  diseaseCategory?: DiseaseCategoryEntity;
}

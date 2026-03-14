import { ApiProperty } from '@nestjs/swagger';
import { Disease } from 'src/generated/prisma/client';
import { Expose } from 'class-transformer';
import { DiseaseCategoryEntity } from '../../disease-category/entities';

export class DiseaseEntity implements Disease {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  nameRu: string;

  @ApiProperty()
  @Expose()
  nameUz: string;

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

import { ApiProperty } from '@nestjs/swagger';
import { DiseaseCategory } from '@prisma/client';
import { Expose } from 'class-transformer';

export class DiseaseCategoryEntity implements DiseaseCategory {
  @ApiProperty({
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Болезни пищеварительной системы' })
  @Expose()
  name_ru: string;

  @ApiProperty({ example: 'Hazm qilish tizimi kasalliklari' })
  @Expose()
  name_uz: string;

  @ApiProperty({
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    required: false,
  })
  @Expose()
  parentId: string | null;

  @ApiProperty({ type: () => DiseaseCategoryEntity, required: false })
  @Expose()
  parent?: DiseaseCategoryEntity;

  @ApiProperty({ type: () => [DiseaseCategoryEntity], required: false })
  @Expose()
  children?: DiseaseCategoryEntity[];
}

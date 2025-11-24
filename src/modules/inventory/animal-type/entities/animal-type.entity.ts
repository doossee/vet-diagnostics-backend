import { ApiProperty } from '@nestjs/swagger';
import { AnimalType } from '@prisma/client';
import { Expose } from 'class-transformer';

export class AnimalTypeEntity implements AnimalType {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name_ru: string;

  @ApiProperty()
  @Expose()
  name_uz: string;

  @ApiProperty({ required: false })
  @Expose()
  parentId: string | null;

  @ApiProperty({ type: () => AnimalTypeEntity, required: false })
  @Expose()
  parent?: AnimalTypeEntity;

  @ApiProperty({ type: () => [AnimalTypeEntity], required: false })
  @Expose()
  children?: AnimalTypeEntity[];
}

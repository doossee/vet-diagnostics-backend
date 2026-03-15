import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class AnimalTypeEntity {
  @ApiProperty({
    description: 'Unique identifier for the animal type',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Localized name',
    example: { ru: 'Название', uz: 'Nomi' },
  })
  @Expose()
  name: { ru: string; uz: string };

  @ApiPropertyOptional({
    description: 'AI model key for prediction routing (leaf types only)',
    example: 'buqa',
  })
  @Expose()
  modelKey: string | null;

  @ApiPropertyOptional({
    description: 'Sex constraint ID — only animals of this sex belong to this type',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  @Expose()
  sexId: string | null;

  @ApiPropertyOptional({
    description: 'Minimum animal age in total months (inclusive)',
    example: 36,
  })
  @Expose()
  minAgeMonths: number | null;

  @ApiPropertyOptional({
    description: 'Maximum animal age in total months (inclusive, null = no upper bound)',
    example: 35,
  })
  @Expose()
  maxAgeMonths: number | null;

  @ApiPropertyOptional({
    description: 'Parent animal type ID',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  @Expose()
  parentId: string | null;

  @ApiPropertyOptional({
    description: 'Parent animal type details',
    type: () => AnimalTypeEntity,
  })
  @Expose()
  @Type(() => AnimalTypeEntity)
  parent?: AnimalTypeEntity;

  @ApiPropertyOptional({
    description: 'Child animal types',
    type: () => [AnimalTypeEntity],
  })
  @Expose()
  @Type(() => AnimalTypeEntity)
  children?: AnimalTypeEntity[];
}

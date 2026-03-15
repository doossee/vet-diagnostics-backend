import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class ResolveAnimalTypeDto {
  @IsUUID()
  @ApiProperty({
    description: 'UUID of the parent AnimalType (e.g. Qoramol)',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  readonly parentId: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'UUID of the sex lookup entry',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
  })
  readonly sexId?: string;

  @IsInt()
  @Min(1900)
  @ApiProperty({ description: 'Birth year', example: 2022 })
  readonly birthYear: number;

  @IsInt()
  @Min(1)
  @Max(12)
  @ApiProperty({ description: 'Birth month (1–12)', example: 6 })
  readonly birthMonth: number;
}

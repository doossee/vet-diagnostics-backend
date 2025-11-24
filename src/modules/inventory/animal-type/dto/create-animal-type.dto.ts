import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateAnimalTypeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Крупный рогатый скот' })
  readonly name_ru: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Qoramol' })
  readonly name_uz: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9' })
  readonly parentId?: string;
}

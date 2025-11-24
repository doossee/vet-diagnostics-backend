import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateUrineSmellDto {
  @ApiProperty({ example: 'Аммиачный' })
  @IsString()
  name_ru: string;

  @ApiProperty({ example: 'Ammiakli' })
  @IsString()
  name_uz: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  animalTypeId: string;
}

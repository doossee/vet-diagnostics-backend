import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NameDto } from 'src/shared/dto';

export class CreateUrineClarityDto {
  @ValidateNested()
  @Type(() => NameDto)
  @ApiProperty({ type: NameDto, description: 'Localized name' })
  name: NameDto;

  @ApiProperty({ example: 1, description: 'Numeric value for ML mapping' })
  @IsInt()
  numericValue: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  animalTypeId: string;
}

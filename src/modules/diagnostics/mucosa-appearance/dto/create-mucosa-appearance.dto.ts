import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NameDto } from 'src/shared/dto';

export class CreateMucosaAppearanceDto {
  @ValidateNested()
  @Type(() => NameDto)
  @ApiProperty({ type: NameDto, description: 'Localized name' })
  readonly name: NameDto;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Numeric value for ML mapping',
    example: 1,
    type: Number,
  })
  readonly numericValue: number;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Mucosa type ID',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  readonly mucosaTypeId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Animal type ID',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    format: 'uuid',
  })
  readonly animalTypeId: string;
}

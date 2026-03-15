import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NameDto } from 'src/shared/dto';

export class CreateDiseaseDto {
  @ValidateNested()
  @Type(() => NameDto)
  @ApiProperty({ type: NameDto, description: 'Localized name' })
  readonly name: NameDto;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9' })
  readonly diseaseCategoryId: string;
}

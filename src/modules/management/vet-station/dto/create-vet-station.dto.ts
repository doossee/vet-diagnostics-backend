import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateVetStationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the vet station in Russian',
    example: 'Ветеринарная станция №1',
    type: String,
  })
  readonly name_ru: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the vet station in Uzbek',
    example: 'Veterinariya stantsiyasi №1',
    type: String,
  })
  readonly name_uz: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Address of the vet station',
    example: 'Улица Навои, 15',
    type: String,
  })
  readonly address: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the district',
    example: 'e3a49f9c-70be-45d3-8d4c-1c6f8a29fcd9',
    type: String,
    format: 'uuid',
  })
  readonly districtId: string;
}

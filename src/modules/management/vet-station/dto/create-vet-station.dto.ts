import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NameDto } from 'src/shared/dto';

export class CreateVetStationDto {
  @ValidateNested()
  @Type(() => NameDto)
  @ApiProperty({ type: NameDto, description: 'Localized name' })
  readonly name: NameDto;

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

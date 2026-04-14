import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NameDto } from 'src/shared/dto';

export class CreateDistrictDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NameDto)
  @ApiProperty({ type: NameDto, description: 'Localized name' })
  readonly name: NameDto;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the parent region',
    example: 1,
    type: Number,
  })
  readonly regionId: number;
}

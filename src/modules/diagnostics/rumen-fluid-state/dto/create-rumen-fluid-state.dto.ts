import { ApiProperty } from '@nestjs/swagger';
import { IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NameDto } from 'src/shared/dto';

export class CreateRumenFluidStateDto {
  @ValidateNested()
  @Type(() => NameDto)
  @ApiProperty({ type: NameDto, description: 'Localized name' })
  name: NameDto;

  @ApiProperty({ example: 1, description: 'Numeric value for ML mapping' })
  @IsInt()
  numericValue: number;
}

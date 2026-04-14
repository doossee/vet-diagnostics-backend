import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NameDto } from 'src/shared/dto';
import { ProphylaxisType } from 'src/shared/enums';

export class CreateProphylaxisItemDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NameDto)
  @ApiProperty({ type: NameDto, description: 'Localized name' })
  readonly name: NameDto;

  @IsEnum(ProphylaxisType)
  @ApiProperty({ enum: ProphylaxisType, example: 'VACCINE' })
  readonly type: ProphylaxisType;
}

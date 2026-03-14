import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ProphylaxisType } from 'src/shared/enums';

export class CreateProphylaxisItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Вакцина против бруцеллёза' })
  readonly nameRu: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Brucella vaksina' })
  readonly nameUz: string;

  @IsEnum(ProphylaxisType)
  @ApiProperty({ enum: ProphylaxisType, example: 'VACCINE' })
  readonly type: ProphylaxisType;
}

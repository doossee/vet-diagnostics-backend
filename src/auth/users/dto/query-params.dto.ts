import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/shared/enums';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsDate } from 'class-validator';
import { BaseQueryParamsDto, SortOrder } from 'src/shared/dto';

export class UserQueryParamsDto extends BaseQueryParamsDto {
  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty({
    description: 'Filter by user role (e.g., ADMIN, USER)',
    enum: UserRole,
    required: false,
  })
  readonly role?: UserRole;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({
    description: 'Filter by user creation date in ISO format',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  readonly createdDate?: Date;

  @IsEnum(SortOrder)
  @IsOptional()
  @ApiProperty({
    description: 'Sort by role (ASC or DESC)',
    enum: SortOrder,
    required: false,
  })
  readonly byRole?: SortOrder;

  @IsEnum(SortOrder)
  @IsOptional()
  @ApiProperty({
    description: 'Sort by creation date (ASC or DESC)',
    enum: SortOrder,
    required: false,
  })
  readonly byCreatedDate?: SortOrder;
}

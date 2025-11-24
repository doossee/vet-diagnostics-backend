import { ApiProperty } from '@nestjs/swagger';
import { Animal, AnimalSex } from '@prisma/client';
import { Expose } from 'class-transformer';

export class AnimalEntity implements Animal {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  arrivalDate: Date;

  @ApiProperty()
  @Expose()
  age: number;

  @ApiProperty({ enum: AnimalSex })
  @Expose()
  sex: AnimalSex;

  @ApiProperty()
  @Expose()
  farmerId: string;

  @ApiProperty()
  @Expose()
  animalTypeId: string;

  @ApiProperty()
  @Expose()
  animalBreedId: string;

  @ApiProperty()
  @Expose()
  animalColorId: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}

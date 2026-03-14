import { ApiProperty } from '@nestjs/swagger';
import { MedicalSession, SessionStatus } from 'src/generated/prisma/client';
import { Expose } from 'class-transformer';

export class MedicalSessionEntity implements MedicalSession {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Animal ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  animalId: string;

  @ApiProperty({ description: 'Veterinarian ID', required: false })
  @Expose()
  veterinarianId: string | null;

  @ApiProperty({ description: 'Date of examination' })
  @Expose()
  date: Date;

  @ApiProperty({
    description: 'Session status',
    enum: ['DRAFT', 'READY', 'SUBMITTED'],
  })
  @Expose()
  status: SessionStatus;

  @ApiProperty({ description: 'Notes', required: false })
  @Expose()
  notes: string | null;

  @ApiProperty({ description: 'Creation date' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @Expose()
  updatedAt: Date;
}

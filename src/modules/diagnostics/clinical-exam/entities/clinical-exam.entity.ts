import { ApiProperty } from '@nestjs/swagger';
import { ClinicalExam } from 'src/generated/prisma/client';
import { Expose } from 'class-transformer';

export class ClinicalExamEntity implements ClinicalExam {
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

  @ApiProperty({
    description: 'Session ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Expose()
  sessionId: string | null;

  @ApiProperty({ description: 'Pulse', example: 80, required: false })
  @Expose()
  pulse: number | null;

  @ApiProperty({ description: 'Rumination', example: 5, required: false })
  @Expose()
  rumination: number | null;

  @ApiProperty({ description: 'Temperature', example: 38.5, required: false })
  @Expose()
  temperature: number | null;

  @ApiProperty({
    description: 'Respiratory Rate',
    example: 20,
    required: false,
  })
  @Expose()
  respiratoryRate: number | null;

  @Expose() bodyTypeId: string | null;
  @Expose() obesityId: string | null;
  @Expose() bodyPositionId: string | null;
  @Expose() constitutionId: string | null;
  @Expose() temperamentId: string | null;

  @Expose() woolId: string | null;
  @Expose() downId: string | null;
  @Expose() hairId: string | null;
  @Expose() feathersId: string | null;

  @Expose() skinColorId: string | null;
  @Expose() skinHumidityId: string | null;
  @Expose() skinSmellId: string | null;
  @Expose() skinTempId: string | null;
  @Expose() skinSurfaceId: string | null;
  @Expose() skinElasticityId: string | null;
  @Expose() skinSensitivityId: string | null;
  @Expose() skinPainId: string | null;

  @Expose() lymphSizeId: string | null;
  @Expose() lymphShapeId: string | null;
  @Expose() lymphSurfaceId: string | null;
  @Expose() lymphConsistencyId: string | null;
  @Expose() lymphTempId: string | null;
  @Expose() lymphPainId: string | null;
  @Expose() lymphMobilityId: string | null;

  @Expose() rumenInfusoriaCount: number | null;
  @Expose() rumenFluidStateId: string | null;

  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateClinicalExamDto,
  UpdateClinicalExamDto,
  ClinicalExamQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';

const clinicalExamInclude: Prisma.ClinicalExamInclude = {
  session: true,
  animal: true,
  bodyType: true,
  obesity: true,
  bodyPosition: true,
  constitution: true,
  temperament: true,
  wool: true,
  down: true,
  hair: true,
  feathers: true,
  skinColor: true,
  skinHumidity: true,
  skinSmell: true,
  skinTemp: true,
  skinSurface: true,
  skinElasticity: true,
  skinSensitivity: true,
  skinPain: true,
  rumenFluidState: true,
  lymphSize: true,
  lymphShape: true,
  lymphSurface: true,
  lymphConsistency: true,
  lymphTemp: true,
  lymphPain: true,
  lymphMobility: true,
};

@Injectable()
export class ClinicalExamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateClinicalExamDto) {
    return await this.prisma.clinicalExam.create({
      data,
      include: clinicalExamInclude,
    });
  }

  async findAll(query: ClinicalExamQueryParamsDto) {
    const { page, perPage, byId, animalId } = query;

    const where: Prisma.ClinicalExamWhereInput = {
      ...(animalId && { animalId }),
    };

    const orderBy: Prisma.ClinicalExamOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { createdAt: 'desc' }),
    };

    return await this.paginationService.paginate(
      this.prisma.clinicalExam,
      { where, orderBy, include: clinicalExamInclude },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.clinicalExam.findUniqueOrThrow({
      where: { id },
      include: clinicalExamInclude,
    });
  }

  async update(id: string, data: UpdateClinicalExamDto) {
    return await this.prisma.clinicalExam.update({
      where: { id },
      data,
      include: clinicalExamInclude,
    });
  }

  async findLastByAnimalId(animalId: string) {
    return await this.prisma.clinicalExam.findFirst({
      where: { animalId },
      orderBy: { createdAt: 'desc' },
      include: clinicalExamInclude,
    });
  }

  async delete(id: string) {
    return await this.prisma.clinicalExam.delete({
      where: { id },
    });
  }

  async importFromExcel(
    rows: Record<string, any>[],
  ): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;
    for (const row of rows) {
      try {
        const toNum = (v) => (v !== '' && v != null ? Number(v) : undefined);
        const toId = (v) => (v && String(v).length > 10 ? String(v) : undefined);
        await this.prisma.clinicalExam.create({
          data: {
            animalId: String(row['animalId']),
            sessionId: toId(row['sessionId']),
            pulse: toNum(row['pulse']),
            temperature: toNum(row['temperature']),
            respiratoryRate: toNum(row['respiratoryRate']),
            rumination: toNum(row['rumination']),
            rumenInfusoriaCount: toNum(row['rumenInfusoriaCount']),
            bodyTypeId: toId(row['bodyTypeId']),
            obesityId: toId(row['obesityId']),
            bodyPositionId: toId(row['bodyPositionId']),
            constitutionId: toId(row['constitutionId']),
            temperamentId: toId(row['temperamentId']),
            woolId: toId(row['woolId']),
            downId: toId(row['downId']),
            hairId: toId(row['hairId']),
            feathersId: toId(row['feathersId']),
            skinColorId: toId(row['skinColorId']),
            skinHumidityId: toId(row['skinHumidityId']),
            skinSmellId: toId(row['skinSmellId']),
            skinTempId: toId(row['skinTempId']),
            skinSurfaceId: toId(row['skinSurfaceId']),
            skinElasticityId: toId(row['skinElasticityId']),
            skinSensitivityId: toId(row['skinSensitivityId']),
            skinPainId: toId(row['skinPainId']),
            lymphSizeId: toId(row['lymphSizeId']),
            lymphShapeId: toId(row['lymphShapeId']),
            lymphSurfaceId: toId(row['lymphSurfaceId']),
            lymphConsistencyId: toId(row['lymphConsistencyId']),
            lymphTempId: toId(row['lymphTempId']),
            lymphPainId: toId(row['lymphPainId']),
            lymphMobilityId: toId(row['lymphMobilityId']),
            rumenFluidStateId: toId(row['rumenFluidStateId']),
          },
        });
        imported++;
      } catch (e) {
        errors.push(String(e.message));
      }
    }
    return { imported, errors };
  }

}

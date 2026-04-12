import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateBloodExamDto,
  UpdateBloodExamDto,
  BloodExamQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class BloodExamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new blood exam
   * @param data - Blood exam creation data
   * @returns Created blood exam
   */
  async create(data: CreateBloodExamDto) {
    return await this.prisma.bloodExam.create({
      data,
      include: { animal: true },
    });
  }

  /**
   * Get paginated list of blood exams
   * @param query - Query parameters including filters and pagination
   * @returns Paginated blood exams
   */
  async findAll(query: BloodExamQueryParamsDto) {
    const { page, perPage, search, byId, animalId } = query;

    const where: Prisma.BloodExamWhereInput = {
      ...(animalId && { animalId }),
      ...(search &&
        {
          // Add search logic if needed, e.g., by animal name
        }),
    };

    const orderBy: Prisma.BloodExamOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { createdAt: 'desc' }),
    };

    const include: Prisma.BloodExamInclude = {
      animal: true,
    };

    return await this.paginationService.paginate(
      this.prisma.bloodExam,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single blood exam by ID
   * @param id - Blood exam UUID
   * @returns Blood exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async findOne(id: string) {
    return await this.prisma.bloodExam.findUniqueOrThrow({
      where: { id },
      include: { animal: true },
    });
  }

  /**
   * Update blood exam
   * @param id - Blood exam UUID
   * @param data - Updated blood exam data
   * @returns Updated blood exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async update(id: string, data: UpdateBloodExamDto) {
    return await this.prisma.bloodExam.update({
      where: { id },
      data,
      include: { animal: true },
    });
  }

  /**
   * Get the last blood exam for a specific animal
   * @param animalId - Animal UUID
   * @returns Last blood exam for the animal or null if not found
   */
  async findLastByAnimalId(animalId: string) {
    return await this.prisma.bloodExam.findFirst({
      where: { animalId },
      orderBy: { createdAt: 'desc' },
      include: { animal: true },
    });
  }

  /**
   * Delete blood exam
   * @param id - Blood exam UUID
   * @returns Deleted blood exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async delete(id: string) {
    return await this.prisma.bloodExam.delete({
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
        const toNum = (v: any) => (v !== '' && v != null ? Number(v) : undefined);
        await this.prisma.bloodExam.create({
          data: {
            animalId: row['animalId'] || undefined,
            sessionId: row['sessionId'] || undefined,
            coe: toNum(row['coe']),
            erythrocyteCount: toNum(row['erythrocyteCount']),
            leukocyteCount: toNum(row['leukocyteCount']),
            thrombocyteCount: toNum(row['thrombocyteCount']),
            hemoglobin: toNum(row['hemoglobin']),
            glutathione: toNum(row['glutathione']),
            waterPercentage: toNum(row['waterPercentage']),
            dryResidue: toNum(row['dryResidue']),
            totalProtein: toNum(row['totalProtein']),
            totalCalcium: toNum(row['totalCalcium']),
            organicPhosphorus: toNum(row['organicPhosphorus']),
            albumin: toNum(row['albumin']),
            alphaGlobulin: toNum(row['alphaGlobulin']),
            betaGlobulin: toNum(row['betaGlobulin']),
            gammaGlobulin: toNum(row['gammaGlobulin']),
            residualNitrogen: toNum(row['residualNitrogen']),
            urea: toNum(row['urea']),
            uricAcid: toNum(row['uricAcid']),
            creatine: toNum(row['creatine']),
            creatinine: toNum(row['creatinine']),
            alkalineReserve: toNum(row['alkalineReserve']),
            glucose: toNum(row['glucose']),
            ketoneBodies: toNum(row['ketoneBodies']),
            totalBilirubin: toNum(row['totalBilirubin']),
            directBilirubin: toNum(row['directBilirubin']),
            totalCholesterol: toNum(row['totalCholesterol']),
            totalLipids: toNum(row['totalLipids']),
            phospholipids: toNum(row['phospholipids']),
            lacticAcid: toNum(row['lacticAcid']),
            pyruvicAcid: toNum(row['pyruvicAcid']),
            citricAcid: toNum(row['citricAcid']),
            carotene: toNum(row['carotene']),
            vitaminA: toNum(row['vitaminA']),
            vitaminB: toNum(row['vitaminB']),
            vitaminC: toNum(row['vitaminC']),
            copper: toNum(row['copper']),
            cobalt: toNum(row['cobalt']),
            manganese: toNum(row['manganese']),
            zinc: toNum(row['zinc']),
            conclusion: row['conclusion'] || undefined,
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

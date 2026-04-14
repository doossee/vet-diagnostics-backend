import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateUrineExamDto,
  UpdateUrineExamDto,
  UrineExamQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class UrineExamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new urine exam
   * @param data - Urine exam creation data
   * @returns Created urine exam
   */
  async create(data: CreateUrineExamDto) {
    return await this.prisma.urineExam.create({
      data,
      include: {
        session: true,
        animal: true,
        urineColor: true,
        urineSmell: true,
        urineClarity: true,
        urineConsistency: true,
      },
    });
  }

  /**
   * Get paginated list of urine exams
   * @param query - Query parameters including filters and pagination
   * @returns Paginated urine exams
   */
  async findAll(query: UrineExamQueryParamsDto) {
    const { page, perPage, search, byId, animalId } = query;

    const where: Prisma.UrineExamWhereInput = {
      ...(animalId && { animalId }),
      ...(search &&
        {
          // Add search logic if needed
        }),
    };

    const orderBy: Prisma.UrineExamOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { createdAt: 'desc' }),
    };

    const include: Prisma.UrineExamInclude = {
      session: true,
      animal: true,
      urineColor: true,
      urineSmell: true,
      urineClarity: true,
      urineConsistency: true,
    };

    return await this.paginationService.paginate(
      this.prisma.urineExam,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single urine exam by ID
   * @param id - Urine exam UUID
   * @returns Urine exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async findOne(id: string) {
    return await this.prisma.urineExam.findUniqueOrThrow({
      where: { id },
      include: {
        session: true,
        animal: true,
        urineColor: true,
        urineSmell: true,
        urineClarity: true,
        urineConsistency: true,
      },
    });
  }

  /**
   * Update urine exam
   * @param id - Urine exam UUID
   * @param data - Updated urine exam data
   * @returns Updated urine exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async update(id: string, data: UpdateUrineExamDto) {
    return await this.prisma.urineExam.update({
      where: { id },
      data,
      include: {
        session: true,
        animal: true,
        urineColor: true,
        urineSmell: true,
        urineClarity: true,
        urineConsistency: true,
      },
    });
  }

  /**
   * Get the last urine exam for a specific animal
   * @param animalId - Animal UUID
   * @returns Last urine exam for the animal or null if not found
   */
  async findLastByAnimalId(animalId: string) {
    return await this.prisma.urineExam.findFirst({
      where: { animalId },
      orderBy: { createdAt: 'desc' },
      include: {
        session: true,
        animal: true,
        urineColor: true,
        urineSmell: true,
        urineClarity: true,
        urineConsistency: true,
      },
    });
  }

  /**
   * Delete urine exam
   * @param id - Urine exam UUID
   * @returns Deleted urine exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async delete(id: string) {
    return await this.prisma.urineExam.delete({
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
        await this.prisma.urineExam.create({
          data: {
            animalId: row['animalId'] || undefined,
            sessionId: row['sessionId'] || undefined,
            urineColorId: row['urineColorId'] || undefined,
            urineSmellId: row['urineSmellId'] || undefined,
            urineClarityId: row['urineClarityId'] || undefined,
            urineConsistencyId: row['urineConsistencyId'] || undefined,
            amount: toNum(row['amount']),
            ph: toNum(row['ph']),
            acetone: toNum(row['acetone']),
            protein: toNum(row['protein']),
            bilirubin: toNum(row['bilirubin']),
            urobilinogen: toNum(row['urobilinogen']),
            sugar: toNum(row['sugar']),
            leukocytes: toNum(row['leukocytes']),
            epithelium: toNum(row['epithelium']),
            microbialBodies: toNum(row['microbialBodies']),
            erythrocytes: toNum(row['erythrocytes']),
            saltCrystals: toNum(row['saltCrystals']),
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

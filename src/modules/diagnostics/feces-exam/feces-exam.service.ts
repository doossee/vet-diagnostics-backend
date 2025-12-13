import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateFecesExamDto,
  UpdateFecesExamDto,
  FecesExamQueryParamsDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FecesExamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new feces exam
   * @param data - Feces exam creation data
   * @returns Created feces exam
   */
  async create(data: CreateFecesExamDto) {
    return await this.prisma.fecesExam.create({
      data,
      include: {
        animal: true,
        fecesColor: true,
        fecesSmell: true,
        fecesConsistency: true,
        fecesForm: true,
      },
    });
  }

  /**
   * Get paginated list of feces exams
   * @param query - Query parameters including filters and pagination
   * @returns Paginated feces exams
   */
  async findAll(query: FecesExamQueryParamsDto) {
    const { page, perPage, search, byId, animalId } = query;

    const where: Prisma.FecesExamWhereInput = {
      ...(animalId && { animalId }),
      ...(search &&
        {
          // Add search logic if needed
        }),
    };

    const orderBy: Prisma.FecesExamOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { createdAt: 'desc' }),
    };

    const include: Prisma.FecesExamInclude = {
      animal: true,
      fecesColor: true,
      fecesSmell: true,
      fecesConsistency: true,
      fecesForm: true,
    };

    return await this.paginationService.paginate(
      this.prisma.fecesExam,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single feces exam by ID
   * @param id - Feces exam UUID
   * @returns Feces exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async findOne(id: string) {
    return await this.prisma.fecesExam.findUniqueOrThrow({
      where: { id },
      include: {
        animal: true,
        fecesColor: true,
        fecesSmell: true,
        fecesConsistency: true,
        fecesForm: true,
      },
    });
  }

  /**
   * Update feces exam
   * @param id - Feces exam UUID
   * @param data - Updated feces exam data
   * @returns Updated feces exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async update(id: string, data: UpdateFecesExamDto) {
    return await this.prisma.fecesExam.update({
      where: { id },
      data,
      include: {
        animal: true,
        fecesColor: true,
        fecesSmell: true,
        fecesConsistency: true,
        fecesForm: true,
      },
    });
  }

  /**
   * Get the last feces exam for a specific animal
   * @param animalId - Animal UUID
   * @returns Last feces exam for the animal or null if not found
   */
  async findLastByAnimalId(animalId: string) {
    return await this.prisma.fecesExam.findFirst({
      where: { animalId },
      orderBy: { createdAt: 'desc' },
      include: {
        animal: true,
        fecesColor: true,
        fecesSmell: true,
        fecesConsistency: true,
        fecesForm: true,
      },
    });
  }

  /**
   * Delete feces exam
   * @param id - Feces exam UUID
   * @returns Deleted feces exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async delete(id: string) {
    return await this.prisma.fecesExam.delete({
      where: { id },
    });
  }
}

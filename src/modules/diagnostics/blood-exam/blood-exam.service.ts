import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateBloodExamDto,
  UpdateBloodExamDto,
  BloodExamQueryParamsDto,
} from './dto';
import { Prisma } from '@prisma/client';

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
}

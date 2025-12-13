import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateMucosaExamDto,
  UpdateMucosaExamDto,
  MucosaExamQueryParamsDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MucosaExamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new mucosa exam
   * @param data - Mucosa exam creation data
   * @returns Created mucosa exam
   */
  async create(data: CreateMucosaExamDto) {
    return await this.prisma.mucosaExam.create({
      data,
      include: {
        animal: true,
        mucosaAppearance: true,
      },
    });
  }

  /**
   * Get paginated list of mucosa exams
   * @param query - Query parameters including filters and pagination
   * @returns Paginated mucosa exams
   */
  async findAll(query: MucosaExamQueryParamsDto) {
    const { page, perPage, search, byId } = query;

    const where: Prisma.MucosaExamWhereInput = {
      ...(search &&
        {
          // Add search logic if needed
        }),
    };

    const orderBy: Prisma.MucosaExamOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { createdAt: 'desc' }),
    };

    const include: Prisma.MucosaExamInclude = {
      animal: true,
      mucosaAppearance: true,
    };

    return await this.paginationService.paginate(
      this.prisma.mucosaExam,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single mucosa exam by ID
   * @param id - Mucosa exam UUID
   * @returns Mucosa exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async findOne(id: string) {
    return await this.prisma.mucosaExam.findUniqueOrThrow({
      where: { id },
      include: {
        animal: true,
        mucosaAppearance: true,
      },
    });
  }

  /**
   * Update mucosa exam
   * @param id - Mucosa exam UUID
   * @param data - Updated mucosa exam data
   * @returns Updated mucosa exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async update(id: string, data: UpdateMucosaExamDto) {
    return await this.prisma.mucosaExam.update({
      where: { id },
      data,
      include: {
        animal: true,
        mucosaAppearance: true,
      },
    });
  }

  /**
   * Get the last mucosa exam for a specific animal
   * @param animalId - Animal UUID
   * @returns Last mucosa exam for the animal or null if not found
   */
  async findLastByAnimalId(animalId: string) {
    return await this.prisma.mucosaExam.findFirst({
      where: { animalId },
      orderBy: { createdAt: 'desc' },
      include: {
        animal: true,
        mucosaAppearance: true,
      },
    });
  }

  /**
   * Delete mucosa exam
   * @param id - Mucosa exam UUID
   * @returns Deleted mucosa exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async delete(id: string) {
    return await this.prisma.mucosaExam.delete({
      where: { id },
    });
  }
}

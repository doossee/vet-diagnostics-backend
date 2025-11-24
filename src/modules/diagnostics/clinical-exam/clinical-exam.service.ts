import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateClinicalExamDto,
  UpdateClinicalExamDto,
  ClinicalExamQueryParamsDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClinicalExamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new clinical exam
   * @param data - Clinical exam creation data
   * @returns Created clinical exam
   */
  async create(data: CreateClinicalExamDto) {
    return await this.prisma.clinicalExam.create({
      data,
      include: { animal: true },
    });
  }

  /**
   * Get paginated list of clinical exams
   * @param query - Query parameters including filters and pagination
   * @returns Paginated clinical exams
   */
  async findAll(query: ClinicalExamQueryParamsDto) {
    const { page, perPage, search, byId } = query;

    const where: Prisma.ClinicalExamWhereInput = {
      ...(search &&
        {
          // Add search logic if needed
        }),
    };

    const orderBy: Prisma.ClinicalExamOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { createdAt: 'desc' }),
    };

    const include: Prisma.ClinicalExamInclude = {
      animal: true,
    };

    return await this.paginationService.paginate(
      this.prisma.clinicalExam,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single clinical exam by ID
   * @param id - Clinical exam UUID
   * @returns Clinical exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async findOne(id: string) {
    return await this.prisma.clinicalExam.findUniqueOrThrow({
      where: { id },
      include: { animal: true },
    });
  }

  /**
   * Update clinical exam
   * @param id - Clinical exam UUID
   * @param data - Updated clinical exam data
   * @returns Updated clinical exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async update(id: string, data: UpdateClinicalExamDto) {
    return await this.prisma.clinicalExam.update({
      where: { id },
      data,
      include: { animal: true },
    });
  }

  /**
   * Delete clinical exam
   * @param id - Clinical exam UUID
   * @returns Deleted clinical exam
   * @throws PrismaClientKnownRequestError if not found
   */
  async delete(id: string) {
    return await this.prisma.clinicalExam.delete({
      where: { id },
    });
  }
}

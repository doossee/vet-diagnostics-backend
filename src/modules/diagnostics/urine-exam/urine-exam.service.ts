import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateUrineExamDto,
  UpdateUrineExamDto,
  UrineExamQueryParamsDto,
} from './dto';
import { Prisma } from '@prisma/client';

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
    const { page, perPage, search, byId } = query;

    const where: Prisma.UrineExamWhereInput = {
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
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateUrineConsistencyDto,
  UpdateUrineConsistencyDto,
  UrineConsistencyQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class UrineConsistencyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new urine consistency
   * @param data - Urine consistency creation data
   * @returns Created urine consistency
   */
  async create(data: CreateUrineConsistencyDto) {
    return await this.prisma.urineConsistency.create({
      data: data as any,
      include: { animalType: true },
    });
  }

  /**
   * Get paginated list of urine consistencies
   * @param query - Query parameters including filters and pagination
   * @returns Paginated urine consistencies
   */
  async findAll(query: UrineConsistencyQueryParamsDto) {
    const { page, perPage, search, byId, animalTypeId } = query;

    const where: Prisma.UrineConsistencyWhereInput = {
      ...(animalTypeId && { animalTypeId }),
      ...(search && {
        OR: [
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
    };

    const orderBy: Prisma.UrineConsistencyOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
    };

    const include: Prisma.UrineConsistencyInclude = {
      animalType: true,
    };

    return await this.paginationService.paginate(
      this.prisma.urineConsistency,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single urine consistency by ID
   * @param id - Urine consistency UUID
   * @returns Urine consistency
   * @throws PrismaClientKnownRequestError if not found
   */
  async findOne(id: string) {
    return await this.prisma.urineConsistency.findUniqueOrThrow({
      where: { id },
      include: { animalType: true },
    });
  }

  /**
   * Update urine consistency
   * @param id - Urine consistency UUID
   * @param data - Updated urine consistency data
   * @returns Updated urine consistency
   * @throws PrismaClientKnownRequestError if not found
   */
  async update(id: string, data: UpdateUrineConsistencyDto) {
    return await this.prisma.urineConsistency.update({
      where: { id },
      data: data as any,
      include: { animalType: true },
    });
  }

  /**
   * Delete urine consistency
   * @param id - Urine consistency UUID
   * @returns Deleted urine consistency
   * @throws PrismaClientKnownRequestError if not found
   */
  async delete(id: string) {
    return await this.prisma.urineConsistency.delete({
      where: { id },
    });
  }
}

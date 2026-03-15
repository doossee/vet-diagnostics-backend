import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateFecesConsistencyDto,
  UpdateFecesConsistencyDto,
  FecesConsistencyQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class FecesConsistencyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new feces consistency
   * @param data - Feces consistency creation data
   * @returns Created feces consistency
   */
  async create(data: CreateFecesConsistencyDto) {
    return await this.prisma.fecesConsistency.create({
      data,
      include: { animalType: true },
    });
  }

  /**
   * Get paginated list of feces consistencies
   * @param query - Query parameters including filters and pagination
   * @returns Paginated feces consistencies
   */
  async findAll(query: FecesConsistencyQueryParamsDto) {
    const { page, perPage, search, byId, animalTypeId } = query;

    const where: Prisma.FecesConsistencyWhereInput = {
      ...(animalTypeId && { animalTypeId }),
      ...(search && {
        OR: [
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
    };

    const orderBy: Prisma.FecesConsistencyOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
    };

    const include: Prisma.FecesConsistencyInclude = {
      animalType: true,
    };

    return await this.paginationService.paginate(
      this.prisma.fecesConsistency,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single feces consistency by ID
   * @param id - Feces consistency UUID
   * @returns Feces consistency
   * @throws PrismaClientKnownRequestError if not found
   */
  async findOne(id: string) {
    return await this.prisma.fecesConsistency.findUniqueOrThrow({
      where: { id },
      include: { animalType: true },
    });
  }

  /**
   * Update feces consistency
   * @param id - Feces consistency UUID
   * @param data - Updated feces consistency data
   * @returns Updated feces consistency
   * @throws PrismaClientKnownRequestError if not found
   */
  async update(id: string, data: UpdateFecesConsistencyDto) {
    return await this.prisma.fecesConsistency.update({
      where: { id },
      data,
      include: { animalType: true },
    });
  }

  /**
   * Delete feces consistency
   * @param id - Feces consistency UUID
   * @returns Deleted feces consistency
   * @throws PrismaClientKnownRequestError if not found
   */
  async delete(id: string) {
    return await this.prisma.fecesConsistency.delete({
      where: { id },
    });
  }
}

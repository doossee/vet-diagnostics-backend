import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateRegionDto, UpdateRegionDto, RegionQueryParamsDto } from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class RegionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new region
   * @param data - Region creation data
   * @returns Created region
   */
  async create(data: CreateRegionDto) {
    return await this.prisma.region.create({
      data: { ...data, name: data.name as Prisma.InputJsonValue },
    });
  }

  /**
   * Get paginated list of regions with filters
   * @param query - Query parameters including filters and pagination
   * @returns Paginated regions with optional nested districts
   */
  async findAll(query: RegionQueryParamsDto) {
    const { page, perPage, search, byId } = query;

    const where: Prisma.RegionWhereInput = {
      ...(search && {
        OR: [
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
    };

    const orderBy: Prisma.RegionOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
    };

    const include: Prisma.RegionInclude = {
      districts: true,
    };

    return await this.paginationService.paginate(
      this.prisma.region,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single region by ID
   * @param id - Region ID
   * @returns Region with districts
   * @throws PrismaClientKnownRequestError if region not found
   */
  async findOne(id: number) {
    return await this.prisma.region.findUniqueOrThrow({
      where: { id },
      include: { districts: true },
    });
  }

  /**
   * Update region
   * @param id - Region ID
   * @param data - Updated region data
   * @returns Updated region
   * @throws PrismaClientKnownRequestError if region not found
   */
  async update(id: number, data: UpdateRegionDto) {
    return await this.prisma.region.update({
      where: { id },
      data: { ...data, name: data.name as Prisma.InputJsonValue },
    });
  }

  /**
   * Delete region
   * @param id - Region ID
   * @returns Deleted region
   * @throws PrismaClientKnownRequestError if region not found
   */
  async delete(id: number) {
    return await this.prisma.region.delete({
      where: { id },
    });
  }
}

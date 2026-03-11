import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateDistrictDto,
  UpdateDistrictDto,
  DistrictQueryParamsDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from '@prisma/client';

@Injectable()
export class DistrictService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new district
   * @param data - District creation data
   * @returns Created district
   */
  async create(data: CreateDistrictDto) {
    return await this.prisma.district.create({
      data,
      include: { region: true },
    });
  }

  /**
   * Get paginated list of districts with filters
   * @param query - Query parameters including filters and pagination
   * @returns Paginated districts with optional nested region
   */
  async findAll(query: DistrictQueryParamsDto) {
    const { page, perPage, search, regionId, byId } = query;

    const where: Prisma.DistrictWhereInput = {
      ...(search && {
        OR: [
          { nameRu: { contains: search, mode: 'insensitive' } },
          { nameUz: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(regionId && { regionId }),
    };

    const orderBy: Prisma.DistrictOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { nameRu: 'asc' }),
    };

    const include: Prisma.DistrictInclude = {
      region: true,
    };

    return await this.paginationService.paginate(
      this.prisma.district,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single district by ID
   * @param id - District UUID
   * @returns District with region
   * @throws PrismaClientKnownRequestError if district not found
   */
  async findOne(id: string) {
    return await this.prisma.district.findUniqueOrThrow({
      where: { id },
      include: { region: true },
    });
  }

  /**
   * Update district
   * @param id - District UUID
   * @param data - Updated district data
   * @returns Updated district
   * @throws PrismaClientKnownRequestError if district not found
   */
  async update(id: string, data: UpdateDistrictDto) {
    return await this.prisma.district.update({
      where: { id },
      data,
      include: { region: true },
    });
  }

  /**
   * Delete district
   * @param id - District UUID
   * @returns Deleted district
   * @throws PrismaClientKnownRequestError if district not found
   */
  async delete(id: string) {
    return await this.prisma.district.delete({
      where: { id },
    });
  }
}

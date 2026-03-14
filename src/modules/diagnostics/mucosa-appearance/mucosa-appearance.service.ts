import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateMucosaAppearanceDto,
  UpdateMucosaAppearanceDto,
  MucosaAppearanceQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class MucosaAppearanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new mucosa appearance
   * @param data - Mucosa appearance creation data
   * @returns Created mucosa appearance
   */
  async create(data: CreateMucosaAppearanceDto) {
    return await this.prisma.mucosaAppearance.create({
      data,
      include: { animalType: true },
    });
  }

  /**
   * Get paginated list of mucosa appearances
   * @param query - Query parameters including filters and pagination
   * @returns Paginated mucosa appearances
   */
  async findAll(query: MucosaAppearanceQueryParamsDto) {
    const { page, perPage, search, byId, mucosaTypeId } = query;

    const where: Prisma.MucosaAppearanceWhereInput = {
      ...(mucosaTypeId && { mucosaTypeId }),
      ...(search && {
        OR: [
          { nameRu: { contains: search, mode: 'insensitive' } },
          { nameUz: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.MucosaAppearanceOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { nameRu: 'asc' }),
    };

    const include: Prisma.MucosaAppearanceInclude = {
      animalType: true,
    };

    return await this.paginationService.paginate(
      this.prisma.mucosaAppearance,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single mucosa appearance by ID
   * @param id - Mucosa appearance UUID
   * @returns Mucosa appearance
   * @throws PrismaClientKnownRequestError if not found
   */
  async findOne(id: string) {
    return await this.prisma.mucosaAppearance.findUniqueOrThrow({
      where: { id },
      include: { animalType: true },
    });
  }

  /**
   * Update mucosa appearance
   * @param id - Mucosa appearance UUID
   * @param data - Updated mucosa appearance data
   * @returns Updated mucosa appearance
   * @throws PrismaClientKnownRequestError if not found
   */
  async update(id: string, data: UpdateMucosaAppearanceDto) {
    return await this.prisma.mucosaAppearance.update({
      where: { id },
      data,
      include: { animalType: true },
    });
  }

  /**
   * Delete mucosa appearance
   * @param id - Mucosa appearance UUID
   * @returns Deleted mucosa appearance
   * @throws PrismaClientKnownRequestError if not found
   */
  async delete(id: string) {
    return await this.prisma.mucosaAppearance.delete({
      where: { id },
    });
  }
}

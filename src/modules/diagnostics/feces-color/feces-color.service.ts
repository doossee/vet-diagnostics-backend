import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateFecesColorDto,
  UpdateFecesColorDto,
  FecesColorQueryParamsDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FecesColorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new feces color
   * @param data - Feces color creation data
   * @returns Created feces color
   */
  async create(data: CreateFecesColorDto) {
    return await this.prisma.fecesColor.create({
      data,
      include: { animalType: true },
    });
  }

  /**
   * Get paginated list of feces colors
   * @param query - Query parameters including filters and pagination
   * @returns Paginated feces colors
   */
  async findAll(query: FecesColorQueryParamsDto) {
    const { page, perPage, search, byId, animalTypeId } = query;

    const where: Prisma.FecesColorWhereInput = {
      ...(animalTypeId && { animalTypeId }),
      ...(search && {
        OR: [
          { name_ru: { contains: search, mode: 'insensitive' } },
          { name_uz: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.FecesColorOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { name_ru: 'asc' }),
    };

    const include: Prisma.FecesColorInclude = {
      animalType: true,
    };

    return await this.paginationService.paginate(
      this.prisma.fecesColor,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single feces color by ID
   * @param id - Feces color UUID
   * @returns Feces color
   * @throws PrismaClientKnownRequestError if not found
   */
  async findOne(id: string) {
    return await this.prisma.fecesColor.findUniqueOrThrow({
      where: { id },
      include: { animalType: true },
    });
  }

  /**
   * Update feces color
   * @param id - Feces color UUID
   * @param data - Updated feces color data
   * @returns Updated feces color
   * @throws PrismaClientKnownRequestError if not found
   */
  async update(id: string, data: UpdateFecesColorDto) {
    return await this.prisma.fecesColor.update({
      where: { id },
      data,
      include: { animalType: true },
    });
  }

  /**
   * Delete feces color
   * @param id - Feces color UUID
   * @returns Deleted feces color
   * @throws PrismaClientKnownRequestError if not found
   */
  async delete(id: string) {
    return await this.prisma.fecesColor.delete({
      where: { id },
    });
  }
}

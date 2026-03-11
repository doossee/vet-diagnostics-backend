import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateUrineColorDto,
  UpdateUrineColorDto,
  UrineColorQueryParamsDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UrineColorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new urine color
   * @param data - Urine color creation data
   * @returns Created urine color
   */
  async create(data: CreateUrineColorDto) {
    return await this.prisma.urineColor.create({
      data,
      include: { animalType: true },
    });
  }

  /**
   * Get paginated list of urine colors
   * @param query - Query parameters including filters and pagination
   * @returns Paginated urine colors
   */
  async findAll(query: UrineColorQueryParamsDto) {
    const { page, perPage, search, byId, animalTypeId } = query;

    const where: Prisma.UrineColorWhereInput = {
      ...(animalTypeId && { animalTypeId }),
      ...(search && {
        OR: [
          { name_ru: { contains: search, mode: 'insensitive' } },
          { name_uz: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.UrineColorOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { name_ru: 'asc' }),
    };

    const include: Prisma.UrineColorInclude = {
      animalType: true,
    };

    return await this.paginationService.paginate(
      this.prisma.urineColor,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single urine color by ID
   * @param id - Urine color UUID
   * @returns Urine color
   * @throws PrismaClientKnownRequestError if not found
   */
  async findOne(id: string) {
    return await this.prisma.urineColor.findUniqueOrThrow({
      where: { id },
      include: { animalType: true },
    });
  }

  /**
   * Update urine color
   * @param id - Urine color UUID
   * @param data - Updated urine color data
   * @returns Updated urine color
   * @throws PrismaClientKnownRequestError if not found
   */
  async update(id: string, data: UpdateUrineColorDto) {
    return await this.prisma.urineColor.update({
      where: { id },
      data,
      include: { animalType: true },
    });
  }

  /**
   * Delete urine color
   * @param id - Urine color UUID
   * @returns Deleted urine color
   * @throws PrismaClientKnownRequestError if not found
   */
  async delete(id: string) {
    return await this.prisma.urineColor.delete({
      where: { id },
    });
  }
}

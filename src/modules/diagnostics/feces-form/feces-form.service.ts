import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateFecesFormDto,
  UpdateFecesFormDto,
  FecesFormQueryParamsDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FecesFormService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new feces form
   * @param data - Feces form creation data
   * @returns Created feces form
   */
  async create(data: CreateFecesFormDto) {
    return await this.prisma.fecesForm.create({
      data,
      include: { animalType: true },
    });
  }

  /**
   * Get paginated list of feces forms
   * @param query - Query parameters including filters and pagination
   * @returns Paginated feces forms
   */
  async findAll(query: FecesFormQueryParamsDto) {
    const { page, perPage, search, byId } = query;

    const where: Prisma.FecesFormWhereInput = {
      ...(search && {
        OR: [
          { name_ru: { contains: search, mode: 'insensitive' } },
          { name_uz: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.FecesFormOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { name_ru: 'asc' }),
    };

    const include: Prisma.FecesFormInclude = {
      animalType: true,
    };

    return await this.paginationService.paginate(
      this.prisma.fecesForm,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single feces form by ID
   * @param id - Feces form UUID
   * @returns Feces form
   * @throws PrismaClientKnownRequestError if not found
   */
  async findOne(id: string) {
    return await this.prisma.fecesForm.findUniqueOrThrow({
      where: { id },
      include: { animalType: true },
    });
  }

  /**
   * Update feces form
   * @param id - Feces form UUID
   * @param data - Updated feces form data
   * @returns Updated feces form
   * @throws PrismaClientKnownRequestError if not found
   */
  async update(id: string, data: UpdateFecesFormDto) {
    return await this.prisma.fecesForm.update({
      where: { id },
      data,
      include: { animalType: true },
    });
  }

  /**
   * Delete feces form
   * @param id - Feces form UUID
   * @returns Deleted feces form
   * @throws PrismaClientKnownRequestError if not found
   */
  async delete(id: string) {
    return await this.prisma.fecesForm.delete({
      where: { id },
    });
  }
}

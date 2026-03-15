import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateFecesSmellDto,
  UpdateFecesSmellDto,
  FecesSmellQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class FecesSmellService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new feces smell
   * @param data - Feces smell creation data
   * @returns Created feces smell
   */
  async create(data: CreateFecesSmellDto) {
    return await this.prisma.fecesSmell.create({
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
      include: { animalType: true },
    });
  }

  /**
   * Get paginated list of feces smells
   * @param query - Query parameters including filters and pagination
   * @returns Paginated feces smells
   */
  async findAll(query: FecesSmellQueryParamsDto) {
    const { page, perPage, search, byId, animalTypeId } = query;

    const where: Prisma.FecesSmellWhereInput = {
      ...(animalTypeId && { animalTypeId }),
      ...(search && {
        OR: [
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
    };

    const orderBy: Prisma.FecesSmellOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
    };

    const include: Prisma.FecesSmellInclude = {
      animalType: true,
    };

    return await this.paginationService.paginate(
      this.prisma.fecesSmell,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single feces smell by ID
   * @param id - Feces smell UUID
   * @returns Feces smell
   * @throws PrismaClientKnownRequestError if not found
   */
  async findOne(id: string) {
    return await this.prisma.fecesSmell.findUniqueOrThrow({
      where: { id },
      include: { animalType: true },
    });
  }

  /**
   * Update feces smell
   * @param id - Feces smell UUID
   * @param data - Updated feces smell data
   * @returns Updated feces smell
   * @throws PrismaClientKnownRequestError if not found
   */
  async update(id: string, data: UpdateFecesSmellDto) {
    return await this.prisma.fecesSmell.update({
      where: { id },
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
      include: { animalType: true },
    });
  }

  /**
   * Delete feces smell
   * @param id - Feces smell UUID
   * @returns Deleted feces smell
   * @throws PrismaClientKnownRequestError if not found
   */
  async delete(id: string) {
    return await this.prisma.fecesSmell.delete({
      where: { id },
    });
  }
}

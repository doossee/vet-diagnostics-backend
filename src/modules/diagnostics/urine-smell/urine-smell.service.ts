import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateUrineSmellDto,
  UpdateUrineSmellDto,
  UrineSmellQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class UrineSmellService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new urine smell
   * @param data - Urine smell creation data
   * @returns Created urine smell
   */
  async create(data: CreateUrineSmellDto) {
    return await this.prisma.urineSmell.create({
      data,
      include: { animalType: true },
    });
  }

  /**
   * Get paginated list of urine smells
   * @param query - Query parameters including filters and pagination
   * @returns Paginated urine smells
   */
  async findAll(query: UrineSmellQueryParamsDto) {
    const { page, perPage, search, byId, animalTypeId } = query;

    const where: Prisma.UrineSmellWhereInput = {
      ...(animalTypeId && { animalTypeId }),
      ...(search && {
        OR: [
          { nameRu: { contains: search, mode: 'insensitive' } },
          { nameUz: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.UrineSmellOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { nameRu: 'asc' }),
    };

    const include: Prisma.UrineSmellInclude = {
      animalType: true,
    };

    return await this.paginationService.paginate(
      this.prisma.urineSmell,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single urine smell by ID
   * @param id - Urine smell UUID
   * @returns Urine smell
   * @throws PrismaClientKnownRequestError if not found
   */
  async findOne(id: string) {
    return await this.prisma.urineSmell.findUniqueOrThrow({
      where: { id },
      include: { animalType: true },
    });
  }

  /**
   * Update urine smell
   * @param id - Urine smell UUID
   * @param data - Updated urine smell data
   * @returns Updated urine smell
   * @throws PrismaClientKnownRequestError if not found
   */
  async update(id: string, data: UpdateUrineSmellDto) {
    return await this.prisma.urineSmell.update({
      where: { id },
      data,
      include: { animalType: true },
    });
  }

  /**
   * Delete urine smell
   * @param id - Urine smell UUID
   * @returns Deleted urine smell
   * @throws PrismaClientKnownRequestError if not found
   */
  async delete(id: string) {
    return await this.prisma.urineSmell.delete({
      where: { id },
    });
  }
}

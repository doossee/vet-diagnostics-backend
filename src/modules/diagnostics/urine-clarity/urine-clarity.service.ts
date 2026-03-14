import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateUrineClarityDto,
  UpdateUrineClarityDto,
  UrineClarityQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class UrineClarityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Create a new urine clarity
   * @param data - Urine clarity creation data
   * @returns Created urine clarity
   */
  async create(data: CreateUrineClarityDto) {
    return await this.prisma.urineClarity.create({
      data,
      include: { animalType: true },
    });
  }

  /**
   * Get paginated list of urine clarities
   * @param query - Query parameters including filters and pagination
   * @returns Paginated urine clarities
   */
  async findAll(query: UrineClarityQueryParamsDto) {
    const { page, perPage, search, byId, animalTypeId } = query;

    const where: Prisma.UrineClarityWhereInput = {
      ...(animalTypeId && { animalTypeId }),
      ...(search && {
        OR: [
          { nameRu: { contains: search, mode: 'insensitive' } },
          { nameUz: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.UrineClarityOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { nameRu: 'asc' }),
    };

    const include: Prisma.UrineClarityInclude = {
      animalType: true,
    };

    return await this.paginationService.paginate(
      this.prisma.urineClarity,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  /**
   * Get a single urine clarity by ID
   * @param id - Urine clarity UUID
   * @returns Urine clarity
   * @throws PrismaClientKnownRequestError if not found
   */
  async findOne(id: string) {
    return await this.prisma.urineClarity.findUniqueOrThrow({
      where: { id },
      include: { animalType: true },
    });
  }

  /**
   * Update urine clarity
   * @param id - Urine clarity UUID
   * @param data - Updated urine clarity data
   * @returns Updated urine clarity
   * @throws PrismaClientKnownRequestError if not found
   */
  async update(id: string, data: UpdateUrineClarityDto) {
    return await this.prisma.urineClarity.update({
      where: { id },
      data,
      include: { animalType: true },
    });
  }

  /**
   * Delete urine clarity
   * @param id - Urine clarity UUID
   * @returns Deleted urine clarity
   * @throws PrismaClientKnownRequestError if not found
   */
  async delete(id: string) {
    return await this.prisma.urineClarity.delete({
      where: { id },
    });
  }
}

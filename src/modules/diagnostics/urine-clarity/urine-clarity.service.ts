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
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
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
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
    };

    const orderBy: Prisma.UrineClarityOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
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
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
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

  async importFromExcel(
    rows: Record<string, any>[],
  ): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;
    for (const row of rows) {
      try {
        await this.prisma.urineClarity.create({
          data: {
            name: {
              ru: String(row['name_ru'] ?? ''),
              uz: String(row['name_uz'] ?? ''),
            } as unknown as Prisma.InputJsonValue,
            numericValue: Number(row['numericValue']),
            animalTypeId: String(row['animalTypeId']),
          },
        });
        imported++;
      } catch (e) {
        errors.push(String(e.message));
      }
    }
    return { imported, errors };
  }
}

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
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
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
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
    };

    const orderBy: Prisma.UrineSmellOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
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
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
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

  async importFromExcel(
    rows: Record<string, any>[],
  ): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;
    for (const row of rows) {
      try {
        await this.prisma.urineSmell.create({
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

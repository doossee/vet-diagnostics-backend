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
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
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
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
    };

    const orderBy: Prisma.MucosaAppearanceOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
    };

    const include: Prisma.MucosaAppearanceInclude = {
      animalType: true,
      mucosaType: true,
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
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
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

  async importFromExcel(
    rows: Record<string, any>[],
  ): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;
    for (const row of rows) {
      try {
        await this.prisma.mucosaAppearance.create({
          data: {
            name: {
              ru: String(row['name_ru'] ?? ''),
              uz: String(row['name_uz'] ?? ''),
            } as unknown as Prisma.InputJsonValue,
            numericValue: Number(row['numericValue']),
            mucosaTypeId: String(row['mucosaTypeId']),
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

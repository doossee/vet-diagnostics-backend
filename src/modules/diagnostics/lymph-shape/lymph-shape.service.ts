import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateLymphShapeDto,
  UpdateLymphShapeDto,
  LymphShapeQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class LymphShapeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateLymphShapeDto) {
    return await this.prisma.lymphShape.create({
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
    });
  }

  async findAll(query: LymphShapeQueryParamsDto) {
    const { page, perPage, search, byId } = query;

    const where: Prisma.LymphShapeWhereInput = {
      ...(search && {
        OR: [
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
    };

    const orderBy: Prisma.LymphShapeOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
    };

    return await this.paginationService.paginate(
      this.prisma.lymphShape,
      { where, orderBy },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.lymphShape.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: string, data: UpdateLymphShapeDto) {
    return await this.prisma.lymphShape.update({
      where: { id },
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
    });
  }

  async delete(id: string) {
    return await this.prisma.lymphShape.delete({
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
        await this.prisma.lymphShape.create({
          data: {
            name: {
              ru: String(row['name_ru'] ?? ''),
              uz: String(row['name_uz'] ?? ''),
            } as unknown as Prisma.InputJsonValue,
            numericValue: Number(row['numericValue']),
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

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateRumenFluidStateDto,
  UpdateRumenFluidStateDto,
  RumenFluidStateQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class RumenFluidStateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateRumenFluidStateDto) {
    return await this.prisma.rumenFluidState.create({
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
    });
  }

  async findAll(query: RumenFluidStateQueryParamsDto) {
    const { page, perPage, search, byId } = query;

    const where: Prisma.RumenFluidStateWhereInput = {
      ...(search && {
        OR: [
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
    };

    const orderBy: Prisma.RumenFluidStateOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
    };

    return await this.paginationService.paginate(
      this.prisma.rumenFluidState,
      { where, orderBy },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.rumenFluidState.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: string, data: UpdateRumenFluidStateDto) {
    return await this.prisma.rumenFluidState.update({
      where: { id },
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
    });
  }

  async delete(id: string) {
    return await this.prisma.rumenFluidState.delete({
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
        await this.prisma.rumenFluidState.create({
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

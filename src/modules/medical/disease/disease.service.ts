import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateDiseaseDto,
  UpdateDiseaseDto,
  DiseaseQueryParamsDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class DiseaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateDiseaseDto) {
    return await this.prisma.disease.create({
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
      include: { diseaseCategory: true },
    });
  }

  async findAll(query: DiseaseQueryParamsDto) {
    const { page, perPage, search, diseaseCategoryId, byId } = query;
    const where: Prisma.DiseaseWhereInput = {
      ...(search && {
        OR: [
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
      ...(diseaseCategoryId && { diseaseCategoryId }),
    };
    const orderBy: Prisma.DiseaseOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
    };
    const include: Prisma.DiseaseInclude = { diseaseCategory: true };
    return await this.paginationService.paginate(
      this.prisma.disease,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.disease.findUniqueOrThrow({
      where: { id },
      include: { diseaseCategory: true },
    });
  }

  async update(id: string, data: UpdateDiseaseDto) {
    return await this.prisma.disease.update({
      where: { id },
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
      include: { diseaseCategory: true },
    });
  }

  async delete(id: string) {
    return await this.prisma.disease.delete({ where: { id } });
  }

  async importFromExcel(
    rows: Record<string, any>[],
  ): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;
    for (const row of rows) {
      try {
        await this.prisma.disease.create({
          data: {
            name: {
              ru: String(row['name_ru'] ?? ''),
              uz: String(row['name_uz'] ?? ''),
            } as unknown as Prisma.InputJsonValue,
            diseaseCategoryId: String(row['diseaseCategoryId']),
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

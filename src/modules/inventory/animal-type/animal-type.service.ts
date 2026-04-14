import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateAnimalTypeDto,
  UpdateAnimalTypeDto,
  AnimalTypeQueryParamsDto,
  ResolveAnimalTypeDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from 'src/generated/prisma/client';
import { computeAgeInMonths } from 'src/shared/utils';

@Injectable()
export class AnimalTypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateAnimalTypeDto) {
    return await this.prisma.animalType.create({
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
      include: { parent: true, children: true, sex: true },
    });
  }

  async findAll(query: AnimalTypeQueryParamsDto) {
    const { page, perPage, search, parentId, byId } = query;
    const where: Prisma.AnimalTypeWhereInput = {
      ...(search && {
        OR: [
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
      ...(parentId === null && { parentId: null }),
      ...(typeof parentId === 'string' && { parentId }),
    };
    const orderBy: Prisma.AnimalTypeOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
    };
    const include: Prisma.AnimalTypeInclude = {
      parent: true,
      sex: true,
      _count: { select: { children: true } },
    };
    return await this.paginationService.paginate(
      this.prisma.animalType,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.animalType.findUniqueOrThrow({
      where: { id },
      include: { parent: true, children: true, sex: true },
    });
  }

  async update(id: string, data: UpdateAnimalTypeDto) {
    return await this.prisma.animalType.update({
      where: { id },
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
      include: { parent: true, children: true, sex: true },
    });
  }

  async delete(id: string) {
    return await this.prisma.animalType.delete({ where: { id } });
  }

  async resolveAnimalType(query: ResolveAnimalTypeDto) {
    const birthDate = new Date(query.birthYear, query.birthMonth - 1, 1);
    const totalMonths = computeAgeInMonths(birthDate);

    const children = await this.prisma.animalType.findMany({
      where: { parentId: query.parentId },
      include: { sex: true },
    });

    return (
      children.find((child) => {
        const sexMatch = !child.sexId || child.sexId === query.sexId;
        const minOk =
          child.minAgeMonths === null || totalMonths >= child.minAgeMonths;
        const maxOk =
          child.maxAgeMonths === null || totalMonths <= child.maxAgeMonths;
        return sexMatch && minOk && maxOk;
      }) ?? null
    );
  }

  async importFromExcel(
    rows: Record<string, any>[],
  ): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;
    for (const row of rows) {
      try {
        await this.prisma.animalType.create({
          data: {
            name: {
              ru: String(row['name_ru'] ?? ''),
              uz: String(row['name_uz'] ?? ''),
            } as unknown as Prisma.InputJsonValue,
            modelKey: row['modelKey'] ? String(row['modelKey']) : undefined,
            parentId: row['parentId'] ? String(row['parentId']) : undefined,
            minAgeMonths: row['minAgeMonths']
              ? Number(row['minAgeMonths'])
              : undefined,
            maxAgeMonths: row['maxAgeMonths']
              ? Number(row['maxAgeMonths'])
              : undefined,
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

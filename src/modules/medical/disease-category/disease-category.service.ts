import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateDiseaseCategoryDto,
  UpdateDiseaseCategoryDto,
  DiseaseCategoryQueryParamsDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class DiseaseCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateDiseaseCategoryDto) {
    return await this.prisma.diseaseCategory.create({
      data,
      include: { parent: true, children: true },
    });
  }

  async findAll(query: DiseaseCategoryQueryParamsDto) {
    const { page, perPage, search, parentId, byId } = query;
    const where: Prisma.DiseaseCategoryWhereInput = {
      ...(search && {
        OR: [
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
      ...(parentId === null && { parentId: null }),
      ...(typeof parentId === 'string' && { parentId }),
    };
    const orderBy: Prisma.DiseaseCategoryOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
    };
    const include: Prisma.DiseaseCategoryInclude = {
      parent: true,
      children: true,
      _count: {
        select: {
          children: true,
        },
      },
    };
    return await this.paginationService.paginate(
      this.prisma.diseaseCategory,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.diseaseCategory.findUniqueOrThrow({
      where: { id },
      include: { parent: true, children: true, diseases: true },
    });
  }

  async update(id: string, data: UpdateDiseaseCategoryDto) {
    return await this.prisma.diseaseCategory.update({
      where: { id },
      data,
      include: { parent: true, children: true },
    });
  }

  async delete(id: string) {
    return await this.prisma.diseaseCategory.delete({ where: { id } });
  }
}

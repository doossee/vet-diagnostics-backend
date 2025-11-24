import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateMucosaAppearanceDto,
  UpdateMucosaAppearanceDto,
  MucosaAppearanceQueryParamsDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from '@prisma/client';

@Injectable()
export class MucosaAppearanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateMucosaAppearanceDto) {
    return await this.prisma.mucosaAppearance.create({ data });
  }

  async findAll(query: MucosaAppearanceQueryParamsDto) {
    const { page, perPage, search, animalTypeId, mucosaType, byId } = query;
    const where: Prisma.MucosaAppearanceWhereInput = {
      ...(search && {
        OR: [
          { name_ru: { contains: search, mode: 'insensitive' } },
          { name_uz: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(animalTypeId && { animalTypeId }),
      ...(mucosaType && { mucosaType }),
    };
    const orderBy: Prisma.MucosaAppearanceOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { name_ru: 'asc' }),
    };
    return await this.paginationService.paginate(
      this.prisma.mucosaAppearance,
      { where, orderBy },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.mucosaAppearance.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: string, data: UpdateMucosaAppearanceDto) {
    return await this.prisma.mucosaAppearance.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await this.prisma.mucosaAppearance.delete({ where: { id } });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateProphylaxisItemDto,
  UpdateProphylaxisItemDto,
  ProphylaxisItemQueryParamsDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProphylaxisItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateProphylaxisItemDto) {
    return await this.prisma.prophylaxisItem.create({ data });
  }

  async findAll(query: ProphylaxisItemQueryParamsDto) {
    const { page, perPage, search, type, byId } = query;
    const where: Prisma.ProphylaxisItemWhereInput = {
      ...(search && {
        OR: [
          { name_ru: { contains: search, mode: 'insensitive' } },
          { name_uz: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(type && { type }),
    };
    const orderBy: Prisma.ProphylaxisItemOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { name_ru: 'asc' }),
    };
    return await this.paginationService.paginate(
      this.prisma.prophylaxisItem,
      { where, orderBy },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.prophylaxisItem.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: string, data: UpdateProphylaxisItemDto) {
    return await this.prisma.prophylaxisItem.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await this.prisma.prophylaxisItem.delete({ where: { id } });
  }
}

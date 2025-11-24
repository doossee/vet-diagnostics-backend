import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateAnimalAnimalColorDto,
  UpdateAnimalAnimalColorDto,
  AnimalAnimalColorQueryParamsDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnimalAnimalColorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateAnimalAnimalColorDto) {
    return await this.prisma.color.create({
      data,
    });
  }

  async findAll(query: AnimalAnimalColorQueryParamsDto) {
    const { page, perPage, search, byId } = query;

    const where: Prisma.ColorWhereInput = {
      ...(search && {
        OR: [
          { name_ru: { contains: search, mode: 'insensitive' } },
          { name_uz: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.ColorOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { name_ru: 'asc' }),
    };

    return await this.paginationService.paginate(
      this.prisma.color,
      { where, orderBy },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.color.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: string, data: UpdateAnimalAnimalColorDto) {
    return await this.prisma.color.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await this.prisma.color.delete({
      where: { id },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateAnimalColorDto,
  UpdateAnimalColorDto,
  AnimalColorQueryParamsDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class AnimalColorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateAnimalColorDto) {
    return await this.prisma.color.create({
      data: { ...data, name: data.name as Prisma.InputJsonValue },
    });
  }

  async findAll(query: AnimalColorQueryParamsDto) {
    const { page, perPage, search, byId, animalTypeId } = query;

    const where: Prisma.ColorWhereInput = {
      ...(animalTypeId && { animalTypeId }),
      ...(search && {
        OR: [
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
    };

    const orderBy: Prisma.ColorOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
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

  async update(id: string, data: UpdateAnimalColorDto) {
    return await this.prisma.color.update({
      where: { id },
      data: { ...data, name: data.name as Prisma.InputJsonValue },
    });
  }

  async delete(id: string) {
    return await this.prisma.color.delete({
      where: { id },
    });
  }
}

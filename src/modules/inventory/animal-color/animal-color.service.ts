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
      data,
    });
  }

  async findAll(query: AnimalColorQueryParamsDto) {
    const { page, perPage, search, byId, animalTypeId } = query;

    const where: Prisma.ColorWhereInput = {
      ...(animalTypeId && { animalTypeId }),
      ...(search && {
        OR: [
          { nameRu: { contains: search, mode: 'insensitive' } },
          { nameUz: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.ColorOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { nameRu: 'asc' }),
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
      data,
    });
  }

  async delete(id: string) {
    return await this.prisma.color.delete({
      where: { id },
    });
  }
}

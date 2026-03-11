import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateAnimalTypeDto,
  UpdateAnimalTypeDto,
  AnimalTypeQueryParamsDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnimalTypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateAnimalTypeDto) {
    return await this.prisma.animalType.create({
      data,
      include: { parent: true, children: true },
    });
  }

  async findAll(query: AnimalTypeQueryParamsDto) {
    const { page, perPage, search, parentId, byId } = query;
    const where: Prisma.AnimalTypeWhereInput = {
      ...(search && {
        OR: [
          { nameRu: { contains: search, mode: 'insensitive' } },
          { nameUz: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(parentId === null && { parentId: null }),
      ...(typeof parentId === 'string' && { parentId }),
    };
    const orderBy: Prisma.AnimalTypeOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { nameRu: 'asc' }),
    };
    const include: Prisma.AnimalTypeInclude = {
      parent: true,
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
      include: { parent: true, children: true },
    });
  }

  async update(id: string, data: UpdateAnimalTypeDto) {
    return await this.prisma.animalType.update({
      where: { id },
      data,
      include: { parent: true, children: true },
    });
  }

  async delete(id: string) {
    return await this.prisma.animalType.delete({ where: { id } });
  }
}

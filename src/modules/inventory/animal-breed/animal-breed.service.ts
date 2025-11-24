import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateAnimalAnimalBreedDto,
  UpdateAnimalAnimalBreedDto,
  AnimalAnimalBreedQueryParamsDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnimalAnimalBreedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateAnimalAnimalBreedDto) {
    return await this.prisma.breed.create({ data });
  }

  async findAll(query: AnimalAnimalBreedQueryParamsDto) {
    const { page, perPage, search, byId } = query;
    const where: Prisma.BreedWhereInput = {
      ...(search && {
        OR: [
          { name_ru: { contains: search, mode: 'insensitive' } },
          { name_uz: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
    const orderBy: Prisma.BreedOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { name_ru: 'asc' }),
    };
    return await this.paginationService.paginate(
      this.prisma.breed,
      { where, orderBy },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.breed.findUniqueOrThrow({ where: { id } });
  }

  async update(id: string, data: UpdateAnimalAnimalBreedDto) {
    return await this.prisma.breed.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await this.prisma.breed.delete({ where: { id } });
  }
}

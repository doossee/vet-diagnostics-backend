import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateAnimalBreedDto,
  UpdateAnimalBreedDto,
  AnimalBreedQueryParamsDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class AnimalBreedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateAnimalBreedDto) {
    return await this.prisma.breed.create({ data });
  }

  async findAll(query: AnimalBreedQueryParamsDto) {
    const { page, perPage, search, byId } = query;
    const where: Prisma.BreedWhereInput = {
      ...(search && {
        OR: [
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
    };
    const orderBy: Prisma.BreedOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
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

  async update(id: string, data: UpdateAnimalBreedDto) {
    return await this.prisma.breed.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await this.prisma.breed.delete({ where: { id } });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateAnimalDto, UpdateAnimalDto, AnimalQueryParamsDto } from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnimalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateAnimalDto) {
    return await this.prisma.animal.create({
      data: {
        ...data,
        arrivalDate: new Date(data.arrivalDate),
      },
      include: {
        farmer: true,
        animalType: true,
        animalBreed: true,
        animalColor: true,
      },
    });
  }

  async findAll(query: AnimalQueryParamsDto) {
    const { page, perPage, farmerId, animalTypeId, sex, byId } = query;
    const where: Prisma.AnimalWhereInput = {
      ...(farmerId && { farmerId }),
      ...(animalTypeId && { animalTypeId }),
      ...(sex && { sex }),
    };
    const orderBy: Prisma.AnimalOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { createdAt: 'desc' }),
    };
    const include: Prisma.AnimalInclude = {
      farmer: true,
      animalType: true,
      animalBreed: true,
      animalColor: true,
    };
    return await this.paginationService.paginate(
      this.prisma.animal,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.animal.findUniqueOrThrow({
      where: { id },
      include: {
        farmer: true,
        animalType: true,
        animalBreed: true,
        animalColor: true,
      },
    });
  }

  async update(id: string, data: UpdateAnimalDto) {
    return await this.prisma.animal.update({
      where: { id },
      data: {
        ...data,
        ...(data.arrivalDate && { arrivalDate: new Date(data.arrivalDate) }),
      },
      include: {
        farmer: true,
        animalType: true,
        animalBreed: true,
        animalColor: true,
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.animal.delete({ where: { id } });
  }
}

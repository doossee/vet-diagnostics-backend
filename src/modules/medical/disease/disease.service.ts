import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateDiseaseDto,
  UpdateDiseaseDto,
  DiseaseQueryParamsDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from '@prisma/client';

@Injectable()
export class DiseaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateDiseaseDto) {
    return await this.prisma.disease.create({
      data,
      include: { diseaseCategory: true },
    });
  }

  async findAll(query: DiseaseQueryParamsDto) {
    const { page, perPage, search, diseaseCategoryId, byId } = query;
    const where: Prisma.DiseaseWhereInput = {
      ...(search && {
        OR: [
          { name_ru: { contains: search, mode: 'insensitive' } },
          { name_uz: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(diseaseCategoryId && { diseaseCategoryId }),
    };
    const orderBy: Prisma.DiseaseOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { name_ru: 'asc' }),
    };
    const include: Prisma.DiseaseInclude = { diseaseCategory: true };
    return await this.paginationService.paginate(
      this.prisma.disease,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.disease.findUniqueOrThrow({
      where: { id },
      include: { diseaseCategory: true },
    });
  }

  async update(id: string, data: UpdateDiseaseDto) {
    return await this.prisma.disease.update({
      where: { id },
      data,
      include: { diseaseCategory: true },
    });
  }

  async delete(id: string) {
    return await this.prisma.disease.delete({ where: { id } });
  }
}

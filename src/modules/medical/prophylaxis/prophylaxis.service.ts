import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateProphylaxisDto,
  UpdateProphylaxisDto,
  ProphylaxisQueryParamsDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProphylaxisService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateProphylaxisDto) {
    return await this.prisma.prophylaxis.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
      include: { animal: true, item: true, detail: true },
    });
  }

  async findAll(query: ProphylaxisQueryParamsDto) {
    const { page, perPage, animalId, itemId, byId } = query;
    const where: Prisma.ProphylaxisWhereInput = {
      ...(animalId && { animalId }),
      ...(itemId && { itemId }),
    };
    const orderBy: Prisma.ProphylaxisOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { date: 'desc' }),
    };
    const include: Prisma.ProphylaxisInclude = {
      animal: true,
      item: true,
      detail: true,
    };
    return await this.paginationService.paginate(
      this.prisma.prophylaxis,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.prophylaxis.findUniqueOrThrow({
      where: { id },
      include: { animal: true, item: true, detail: true },
    });
  }

  async update(id: string, data: UpdateProphylaxisDto) {
    return await this.prisma.prophylaxis.update({
      where: { id },
      data: {
        ...data,
        ...(data.date && { date: new Date(data.date) }),
      },
      include: { animal: true, item: true, detail: true },
    });
  }

  async delete(id: string) {
    return await this.prisma.prophylaxis.delete({ where: { id } });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateProphylaxisDetailDto,
  UpdateProphylaxisDetailDto,
  ProphylaxisDetailQueryParamsDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class ProphylaxisDetailService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateProphylaxisDetailDto) {
    return await this.prisma.prophylaxisDetail.create({
      data,
      include: { item: true },
    });
  }

  async findAll(query: ProphylaxisDetailQueryParamsDto) {
    const { page, perPage, search, itemId, byId } = query;
    const where: Prisma.ProphylaxisDetailWhereInput = {
      ...(search && {
        OR: [
          { nameRu: { contains: search, mode: 'insensitive' } },
          { nameUz: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(itemId && { itemId }),
    };
    const orderBy: Prisma.ProphylaxisDetailOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { nameRu: 'asc' }),
    };
    const include: Prisma.ProphylaxisDetailInclude = { item: true };
    return await this.paginationService.paginate(
      this.prisma.prophylaxisDetail,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.prophylaxisDetail.findUniqueOrThrow({
      where: { id },
      include: { item: true },
    });
  }

  async update(id: string, data: UpdateProphylaxisDetailDto) {
    return await this.prisma.prophylaxisDetail.update({
      where: { id },
      data,
      include: { item: true },
    });
  }

  async delete(id: string) {
    return await this.prisma.prophylaxisDetail.delete({ where: { id } });
  }
}

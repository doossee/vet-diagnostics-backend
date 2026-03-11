import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateVetStationDto,
  UpdateVetStationDto,
  VetStationQueryParamsDto,
} from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from '@prisma/client';

@Injectable()
export class VetStationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateVetStationDto) {
    return await this.prisma.vetStation.create({
      data,
      include: { district: { include: { region: true } } },
    });
  }

  async findAll(query: VetStationQueryParamsDto) {
    const { page, perPage, search, districtId, byId } = query;

    const where: Prisma.VetStationWhereInput = {
      ...(search && {
        OR: [
          { nameRu: { contains: search, mode: 'insensitive' } },
          { nameUz: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(districtId && { districtId }),
    };

    const orderBy: Prisma.VetStationOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { createdAt: 'desc' }),
    };

    const include: Prisma.VetStationInclude = {
      district: { include: { region: true } },
    };

    return await this.paginationService.paginate(
      this.prisma.vetStation,
      { where, orderBy, include },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.vetStation.findUniqueOrThrow({
      where: { id },
      include: { district: { include: { region: true } } },
    });
  }

  async update(id: string, data: UpdateVetStationDto) {
    return await this.prisma.vetStation.update({
      where: { id },
      data,
      include: { district: { include: { region: true } } },
    });
  }

  async delete(id: string) {
    return await this.prisma.vetStation.delete({
      where: { id },
    });
  }
}

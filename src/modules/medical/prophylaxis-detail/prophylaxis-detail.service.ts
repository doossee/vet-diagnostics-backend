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
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
      include: { item: true },
    });
  }

  async findAll(query: ProphylaxisDetailQueryParamsDto) {
    const { page, perPage, search, itemId, byId } = query;
    const where: Prisma.ProphylaxisDetailWhereInput = {
      ...(search && {
        OR: [
          { name: { path: ['ru'], string_contains: search } },
          { name: { path: ['uz'], string_contains: search } },
        ],
      }),
      ...(itemId && { itemId }),
    };
    const orderBy: Prisma.ProphylaxisDetailOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { id: 'asc' }),
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
      data: { ...data, name: data.name as unknown as Prisma.InputJsonValue },
      include: { item: true },
    });
  }

  async delete(id: string) {
    return await this.prisma.prophylaxisDetail.delete({ where: { id } });
  }

  async importFromExcel(
    rows: Record<string, any>[],
  ): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;
    for (const row of rows) {
      try {
        await this.prisma.prophylaxisDetail.create({
          data: {
            name: { ru: String(row['name_ru'] ?? ''), uz: String(row['name_uz'] ?? '') } as unknown as Prisma.InputJsonValue,
            itemId: String(row['itemId']),
          },
        });
        imported++;
      } catch (e) { errors.push(String(e.message)); }
    }
    return { imported, errors };
  }

}

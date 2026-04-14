import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateMucosaExamDto,
  UpdateMucosaExamDto,
  MucosaExamQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';

const mucosaExamInclude: Prisma.MucosaExamInclude = {
  session: true,
  animal: true,
  mucosaType: true,
  mucosaAppearance: true,
};

@Injectable()
export class MucosaExamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateMucosaExamDto) {
    return await this.prisma.mucosaExam.create({
      data,
      include: mucosaExamInclude,
    });
  }

  async findAll(query: MucosaExamQueryParamsDto) {
    const { page, perPage, byId, animalId, sessionId } = query;

    const where: Prisma.MucosaExamWhereInput = {
      ...(animalId && { animalId }),
      ...(sessionId && { sessionId }),
    };

    const orderBy: Prisma.MucosaExamOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { createdAt: 'desc' }),
    };

    return await this.paginationService.paginate(
      this.prisma.mucosaExam,
      { where, orderBy, include: mucosaExamInclude },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.mucosaExam.findUniqueOrThrow({
      where: { id },
      include: mucosaExamInclude,
    });
  }

  async update(id: string, data: UpdateMucosaExamDto) {
    return await this.prisma.mucosaExam.update({
      where: { id },
      data,
      include: mucosaExamInclude,
    });
  }

  async findLastByAnimalId(animalId: string) {
    return await this.prisma.mucosaExam.findFirst({
      where: { animalId },
      orderBy: { createdAt: 'desc' },
      include: mucosaExamInclude,
    });
  }

  async delete(id: string) {
    return await this.prisma.mucosaExam.delete({
      where: { id },
    });
  }

  async importFromExcel(
    rows: Record<string, any>[],
  ): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;
    for (const row of rows) {
      try {
        await this.prisma.mucosaExam.create({
          data: {
            animalId: row['animalId'] || undefined,
            sessionId: row['sessionId'] || undefined,
            mucosaTypeId: row['mucosaTypeId'] || undefined,
            mucosaAppearanceId: row['mucosaAppearanceId'] || undefined,
          },
        });
        imported++;
      } catch (e) {
        errors.push(String(e.message));
      }
    }
    return { imported, errors };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateClinicalExamDto,
  UpdateClinicalExamDto,
  ClinicalExamQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';

const clinicalExamInclude: Prisma.ClinicalExamInclude = {
  animal: true,
  bodyType: true,
  obesity: true,
  bodyPosition: true,
  constitution: true,
  temperament: true,
  wool: true,
  down: true,
  hair: true,
  feathers: true,
  skinColor: true,
  skinHumidity: true,
  skinTemp: true,
  skinElasticity: true,
  lymphSize: true,
  lymphShape: true,
  lymphSurface: true,
  lymphConsistency: true,
  lymphTemp: true,
  lymphPain: true,
  lymphMobility: true,
};

@Injectable()
export class ClinicalExamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateClinicalExamDto) {
    return await this.prisma.clinicalExam.create({
      data,
      include: clinicalExamInclude,
    });
  }

  async findAll(query: ClinicalExamQueryParamsDto) {
    const { page, perPage, search, byId, animalId } = query;

    const where: Prisma.ClinicalExamWhereInput = {
      ...(animalId && { animalId }),
    };

    const orderBy: Prisma.ClinicalExamOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { createdAt: 'desc' }),
    };

    return await this.paginationService.paginate(
      this.prisma.clinicalExam,
      { where, orderBy, include: clinicalExamInclude },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.clinicalExam.findUniqueOrThrow({
      where: { id },
      include: clinicalExamInclude,
    });
  }

  async update(id: string, data: UpdateClinicalExamDto) {
    return await this.prisma.clinicalExam.update({
      where: { id },
      data,
      include: clinicalExamInclude,
    });
  }

  async findLastByAnimalId(animalId: string) {
    return await this.prisma.clinicalExam.findFirst({
      where: { animalId },
      orderBy: { createdAt: 'desc' },
      include: clinicalExamInclude,
    });
  }

  async delete(id: string) {
    return await this.prisma.clinicalExam.delete({
      where: { id },
    });
  }
}

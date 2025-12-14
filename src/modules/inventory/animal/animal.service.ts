import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateAnimalDto, UpdateAnimalDto, AnimalQueryParamsDto } from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnimalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly config: ConfigService,
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
    const { page, perPage, farmerId, animalTypeId, sex, byId, search } = query;
    const where: Prisma.AnimalWhereInput = {
      ...(farmerId && { farmerId }),
      ...(animalTypeId && { animalTypeId }),
      ...(sex && { sex }),
      ...(search && {
        animalNameCode: { contains: search, mode: 'insensitive' },
      }),
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

  async findPredict(id: string) {
    const uri = this.config.get<string>('PREDICT_API_URI');

    const [bloodExam, clinicalExam] = await Promise.all([
      this.prisma.bloodExam.findFirst({
        where: { animalId: id },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.clinicalExam.findFirst({
        where: { animalId: id },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    if (!bloodExam || !clinicalExam) {
      return null;
    }

    const payload = {
      temperature: clinicalExam.temperature,
      pulse: clinicalExam.pulse,
      respiratoryRate: clinicalExam.respiratoryRate,
      rumination: clinicalExam.rumination,

      erythrocyteCount: bloodExam.erythrocyteCount,
      hemoglobin: bloodExam.hemoglobin,
      totalProtein: bloodExam.totalProtein,
      totalCalcium: bloodExam.totalCalcium,
      organicPhosphorus: bloodExam.organicPhosphorus,
      glucose: bloodExam.glucose,
      alkalineReserve: bloodExam.alkalineReserve,

      copper: bloodExam.copper as number,
      cobalt: bloodExam.cobalt as number,
      manganese: bloodExam.manganese as number,
      zinc: bloodExam.zinc as number,

      rumenInfusoriaCount: clinicalExam?.rumenInfusoriaCount as number,
      rumenFluidState: clinicalExam?.rumenFluidState as string,
    };

    const hasEmpty = Object.values(payload).some(
      (v) => v === null || v === undefined,
    );

    if (hasEmpty) {
      return null;
    }

    const response = await axios.post<Record<number, number>>(
      uri!,

      {
        params: Object.values(payload).map(Number),
      },
    );

    return response.data;
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

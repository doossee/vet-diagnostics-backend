import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateAnimalDto, UpdateAnimalDto, AnimalQueryParamsDto } from './dto';
import { PaginationService } from 'src/shared/services';
import { Prisma } from 'src/generated/prisma/client';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

const animalInclude: Prisma.AnimalInclude = {
  sex: true,
  // farmer: true,
  animalType: true,
  animalBreed: true,
  animalColor: true,
};

@Injectable()
export class AnimalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly config: ConfigService,
  ) {}

  async create(data: CreateAnimalDto) {
    const birthDate = new Date(data.birthYear, data.birthMonth - 1, 1);

    const animalType = await this.prisma.animalType.findUniqueOrThrow({
      where: { id: data.animalTypeId },
      select: { sexId: true },
    });

    const { birthYear, birthMonth, ...rest } = data;
    return await this.prisma.animal.create({
      data: {
        ...rest,
        birthDate,
        arrivalDate: new Date(data.arrivalDate),
        ...(animalType.sexId && { sexId: animalType.sexId }),
      },
      include: animalInclude,
    });
  }

  async findAll(query: AnimalQueryParamsDto) {
    const { page, perPage, farmerId, animalTypeId, sexId, byId, search } =
      query;
    const where: Prisma.AnimalWhereInput = {
      ...(farmerId && { farmerId }),
      ...(animalTypeId && { animalTypeId }),
      ...(sexId && { sexId }),
      ...(search && {
        animalNameCode: { contains: search, mode: 'insensitive' },
      }),
    };
    const orderBy: Prisma.AnimalOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { createdAt: 'desc' }),
    };
    return await this.paginationService.paginate(
      this.prisma.animal,
      { where, orderBy, include: animalInclude },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.animal.findUniqueOrThrow({
      where: { id },
      include: animalInclude,
    });
  }

  async findPredict(id: string) {
    const uri = this.config.get<string>('PREDICT_API_URI');

    const [animal, bloodExam, clinicalExam, urineExam, fecesExam, mucosaExam] =
      await Promise.all([
        this.prisma.animal.findUnique({
          where: { id },
          include: { sex: true },
        }),
        this.prisma.bloodExam.findFirst({
          where: { animalId: id },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.clinicalExam.findFirst({
          where: { animalId: id },
          orderBy: { createdAt: 'desc' },
          include: {
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
          },
        }),
        this.prisma.urineExam.findFirst({
          where: { animalId: id },
          orderBy: { createdAt: 'desc' },
          include: {
            urineColor: true,
            urineSmell: true,
            urineClarity: true,
            urineConsistency: true,
          },
        }),
        this.prisma.fecesExam.findFirst({
          where: { animalId: id },
          orderBy: { createdAt: 'desc' },
          include: {
            fecesColor: true,
            fecesSmell: true,
            fecesConsistency: true,
            fecesForm: true,
          },
        }),
        this.prisma.mucosaExam.findFirst({
          where: { animalId: id },
          orderBy: { createdAt: 'desc' },
          include: {
            mucosaType: true,
            mucosaAppearance: true,
          },
        }),
      ]);

    if (!bloodExam || !clinicalExam) {
      return null;
    }

    const payload = {
      // Animal
      sex: animal?.sex?.numericValue ?? null,

      // Clinical — numeric vitals
      temperature: clinicalExam.temperature,
      pulse: clinicalExam.pulse,
      respiratoryRate: clinicalExam.respiratoryRate,
      rumination: clinicalExam.rumination,
      rumenInfusoriaCount: clinicalExam.rumenInfusoriaCount,

      // Clinical — habitus lookup values
      bodyType: clinicalExam.bodyType?.numericValue ?? null,
      obesity: clinicalExam.obesity?.numericValue ?? null,
      bodyPosition: clinicalExam.bodyPosition?.numericValue ?? null,
      constitution: clinicalExam.constitution?.numericValue ?? null,
      temperament: clinicalExam.temperament?.numericValue ?? null,

      // Clinical — skin cover lookup values
      wool: clinicalExam.wool?.numericValue ?? null,
      down: clinicalExam.down?.numericValue ?? null,
      hair: clinicalExam.hair?.numericValue ?? null,
      feathers: clinicalExam.feathers?.numericValue ?? null,

      // Clinical — skin lookup values
      skinColor: clinicalExam.skinColor?.numericValue ?? null,
      skinHumidity: clinicalExam.skinHumidity?.numericValue ?? null,
      skinTemp: clinicalExam.skinTemp?.numericValue ?? null,
      skinElasticity: clinicalExam.skinElasticity?.numericValue ?? null,

      // Clinical — lymph lookup values
      lymphSize: clinicalExam.lymphSize?.numericValue ?? null,
      lymphShape: clinicalExam.lymphShape?.numericValue ?? null,
      lymphSurface: clinicalExam.lymphSurface?.numericValue ?? null,
      lymphConsistency: clinicalExam.lymphConsistency?.numericValue ?? null,
      lymphTemp: clinicalExam.lymphTemp?.numericValue ?? null,
      lymphPain: clinicalExam.lymphPain?.numericValue ?? null,
      lymphMobility: clinicalExam.lymphMobility?.numericValue ?? null,

      // Blood — morphological
      erythrocyteCount: bloodExam.erythrocyteCount,
      leukocyteCount: bloodExam.leukocyteCount,
      thrombocyteCount: bloodExam.thrombocyteCount,
      hemoglobin: bloodExam.hemoglobin,
      coe: bloodExam.coe,

      // Blood — serum
      totalProtein: bloodExam.totalProtein,
      totalCalcium: bloodExam.totalCalcium,
      organicPhosphorus: bloodExam.organicPhosphorus,
      albumin: bloodExam.albumin,
      glucose: bloodExam.glucose,
      alkalineReserve: bloodExam.alkalineReserve,
      ketoneBodies: bloodExam.ketoneBodies,
      totalBilirubin: bloodExam.totalBilirubin,
      totalCholesterol: bloodExam.totalCholesterol,
      urea: bloodExam.urea,

      // Blood — trace elements
      copper: bloodExam.copper,
      cobalt: bloodExam.cobalt,
      manganese: bloodExam.manganese,
      zinc: bloodExam.zinc,

      // Urine — numeric
      urinePh: urineExam?.ph ?? null,
      urineAmount: urineExam?.amount ?? null,
      urineAcetone: urineExam?.acetone ?? null,
      urineProtein: urineExam?.protein ?? null,
      urineBilirubin: urineExam?.bilirubin ?? null,
      urineSugar: urineExam?.sugar ?? null,
      urineLeukocytes: urineExam?.leukocytes ?? null,
      urineErythrocytes: urineExam?.erythrocytes ?? null,

      // Urine — lookup values
      urineColor: urineExam?.urineColor?.numericValue ?? null,
      urineSmell: urineExam?.urineSmell?.numericValue ?? null,
      urineClarity: urineExam?.urineClarity?.numericValue ?? null,
      urineConsistency: urineExam?.urineConsistency?.numericValue ?? null,

      // Feces — numeric
      fecesAmount: fecesExam?.amount ?? null,
      fecesUndigestedFood: fecesExam?.undigestedFood ?? null,

      // Feces — lookup values
      fecesColor: fecesExam?.fecesColor?.numericValue ?? null,
      fecesSmell: fecesExam?.fecesSmell?.numericValue ?? null,
      fecesConsistency: fecesExam?.fecesConsistency?.numericValue ?? null,
      fecesForm: fecesExam?.fecesForm?.numericValue ?? null,

      // Mucosa — lookup values
      mucosaType: mucosaExam?.mucosaType?.numericValue ?? null,
      mucosaAppearance: mucosaExam?.mucosaAppearance?.numericValue ?? null,
    };

    const isNone = Object.values(payload).filter((d) => d === null).length > 0;

    if (isNone) return {};

    const response = await axios.post<Record<number, number>>(uri!, {
      params: Object.values(payload).map((v) =>
        v === null ? null : Number(v),
      ),
    });

    return response.data;
  }

  async update(id: string, data: UpdateAnimalDto) {
    const { birthMonth, birthYear, ...rest } = data;
    let birthDate: Date | null = null;
    birthDate =
      birthMonth && birthYear
        ? new Date(data.birthYear!, data.birthMonth! - 1, 1)
        : null;

    return await this.prisma.animal.update({
      where: { id },
      data: {
        ...rest,
        ...(birthDate && { birthDate }),
        ...(data.arrivalDate && { arrivalDate: new Date(data.arrivalDate) }),
      },
      include: animalInclude,
    });
  }

  async delete(id: string) {
    return await this.prisma.animal.delete({ where: { id } });
  }

  async importFromExcel(
    rows: Record<string, any>[],
  ): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;
    for (const row of rows) {
      try {
        await this.create({
          arrivalDate: String(row['arrivalDate']),
          animalNameCode: String(row['animalNameCode']),
          birthYear: Number(row['birthYear']),
          birthMonth: Number(row['birthMonth']),
          animalTypeId: String(row['animalTypeId']),
          animalBreedId: String(row['animalBreedId']),
          animalColorId: String(row['animalColorId']),
          farmerId: String(row['farmerId']),
        });
        imported++;
      } catch (e) {
        errors.push(String(e.message));
      }
    }
    return { imported, errors };
  }
}

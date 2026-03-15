import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateMedicalSessionDto,
  UpdateMedicalSessionDto,
  MedicalSessionQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

const sessionInclude = {
  animal: { include: { sex: true } },
  veterinarian: true,
  clinicalExam: {
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
      skinSmell: true,
      skinTemp: true,
      skinSurface: true,
      skinElasticity: true,
      skinSensitivity: true,
      skinPain: true,
      lymphSize: true,
      lymphShape: true,
      lymphSurface: true,
      lymphConsistency: true,
      lymphTemp: true,
      lymphPain: true,
      lymphMobility: true,
      rumenFluidState: true,
    },
  },
  bloodExam: true,
  urineExam: {
    include: {
      urineColor: true,
      urineSmell: true,
      urineClarity: true,
      urineConsistency: true,
    },
  },
  fecesExam: {
    include: {
      fecesColor: true,
      fecesSmell: true,
      fecesConsistency: true,
      fecesForm: true,
    },
  },
  mucosaExams: {
    include: {
      mucosaType: true,
      mucosaAppearance: true,
    },
  },
  prediction: true,
} satisfies Prisma.MedicalSessionInclude;

@Injectable()
export class MedicalSessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly config: ConfigService,
  ) {}

  async create(data: CreateMedicalSessionDto) {
    return await this.prisma.medicalSession.create({
      data: {
        ...data,
        ...(data.date && { date: new Date(data.date) }),
      },
      include: sessionInclude,
    });
  }

  async findAll(query: MedicalSessionQueryParamsDto) {
    const { page, perPage, byId, animalId, veterinarianId, status } = query;

    const where: Prisma.MedicalSessionWhereInput = {
      ...(animalId && { animalId }),
      ...(veterinarianId && { veterinarianId }),
      ...(status && { status }),
    };

    const orderBy: Prisma.MedicalSessionOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { createdAt: 'desc' }),
    };

    return await this.paginationService.paginate(
      this.prisma.medicalSession,
      { where, orderBy, include: sessionInclude },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.medicalSession.findUniqueOrThrow({
      where: { id },
      include: sessionInclude,
    });
  }

  async update(id: string, data: UpdateMedicalSessionDto) {
    return await this.prisma.medicalSession.update({
      where: { id },
      data: {
        ...data,
        ...(data.date && { date: new Date(data.date) }),
      },
      include: sessionInclude,
    });
  }

  async submit(id: string) {
    const session = await this.prisma.medicalSession.findUniqueOrThrow({
      where: { id },
      include: sessionInclude,
    });

    if (session.status === 'SUBMITTED' && session.prediction) {
      throw new BadRequestException(
        'Session already submitted. Prediction exists.',
      );
    }

    const {
      clinicalExam,
      bloodExam,
      urineExam,
      fecesExam,
      mucosaExams,
      animal,
    } = session;

    if (!clinicalExam || !bloodExam) {
      throw new BadRequestException(
        'Session must have at least a clinical exam and blood exam before submitting.',
      );
    }

    // Build the numeric input vector from all session exams
    const inputVector = {
      // Animal
      sex: animal?.sex?.numericValue ?? null,

      // Clinical — numeric vitals
      temperature: clinicalExam.temperature,
      pulse: clinicalExam.pulse,
      respiratoryRate: clinicalExam.respiratoryRate,
      rumination: clinicalExam.rumination,
      rumenInfusoriaCount: clinicalExam.rumenInfusoriaCount,

      // Clinical — habitus
      bodyType: clinicalExam.bodyType?.numericValue ?? null,
      obesity: clinicalExam.obesity?.numericValue ?? null,
      bodyPosition: clinicalExam.bodyPosition?.numericValue ?? null,
      constitution: clinicalExam.constitution?.numericValue ?? null,
      temperament: clinicalExam.temperament?.numericValue ?? null,

      // Clinical — skin cover
      wool: clinicalExam.wool?.numericValue ?? null,
      down: clinicalExam.down?.numericValue ?? null,
      hair: clinicalExam.hair?.numericValue ?? null,
      feathers: clinicalExam.feathers?.numericValue ?? null,

      // Clinical — skin
      skinColor: clinicalExam.skinColor?.numericValue ?? null,
      skinHumidity: clinicalExam.skinHumidity?.numericValue ?? null,
      skinSmell: clinicalExam.skinSmell?.numericValue ?? null,
      skinTemp: clinicalExam.skinTemp?.numericValue ?? null,
      skinSurface: clinicalExam.skinSurface?.numericValue ?? null,
      skinElasticity: clinicalExam.skinElasticity?.numericValue ?? null,
      skinSensitivity: clinicalExam.skinSensitivity?.numericValue ?? null,
      skinPain: clinicalExam.skinPain?.numericValue ?? null,

      // Clinical — rumen fluid
      rumenFluidState: clinicalExam.rumenFluidState?.numericValue ?? null,

      // Clinical — lymph
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

      // Urine — lookups
      urineColor: urineExam?.urineColor?.numericValue ?? null,
      urineSmell: urineExam?.urineSmell?.numericValue ?? null,
      urineClarity: urineExam?.urineClarity?.numericValue ?? null,
      urineConsistency: urineExam?.urineConsistency?.numericValue ?? null,

      // Feces — numeric
      fecesAmount: fecesExam?.amount ?? null,
      fecesUndigestedFood: fecesExam?.undigestedFood ?? null,

      // Feces — lookups
      fecesColor: fecesExam?.fecesColor?.numericValue ?? null,
      fecesSmell: fecesExam?.fecesSmell?.numericValue ?? null,
      fecesConsistency: fecesExam?.fecesConsistency?.numericValue ?? null,
      fecesForm: fecesExam?.fecesForm?.numericValue ?? null,

      // Mucosa — extract appearance for each of the 4 types
      // MucosaType numericValue: 0=oral, 1=nasal, 2=ocular, 3=vaginal
      mucosaOral:
        mucosaExams?.find((m) => m.mucosaType?.numericValue === 0)
          ?.mucosaAppearance?.numericValue ?? null,
      mucosaNasal:
        mucosaExams?.find((m) => m.mucosaType?.numericValue === 1)
          ?.mucosaAppearance?.numericValue ?? null,
      mucosaOcular:
        mucosaExams?.find((m) => m.mucosaType?.numericValue === 2)
          ?.mucosaAppearance?.numericValue ?? null,
      mucosaVaginal:
        mucosaExams?.find((m) => m.mucosaType?.numericValue === 3)
          ?.mucosaAppearance?.numericValue ?? null,
    };

    const numericArray = Object.values(inputVector).map((v) =>
      v === null ? null : Number(v),
    );

    // Call the AI prediction service
    const uri = this.config.get<string>('PREDICT_API_URI');

    let response: { data: Record<string, any> };
    try {
      response = await axios.post<Record<string, any>>(uri!, {
        params: numericArray,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new BadRequestException(
            `AI prediction service returned error: ${error.response.status}`,
          );
        }
        throw new BadRequestException(
          'AI prediction service is unavailable. Please try again later.',
        );
      }
      throw new BadRequestException(
        'Failed to get prediction from AI service.',
      );
    }

    // Store prediction and update session status atomically
    const updatedSession = await this.prisma.medicalSession.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        prediction: {
          create: {
            inputVector,
            rawOutput: response.data,
            modelVersion:
              this.config.get<string>('PREDICT_MODEL_VERSION') ?? null,
          },
        },
      },
      include: sessionInclude,
    });

    return updatedSession;
  }

  async delete(id: string) {
    return await this.prisma.medicalSession.delete({
      where: { id },
    });
  }
}

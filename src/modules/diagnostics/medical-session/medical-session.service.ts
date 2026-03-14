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

const sessionInclude: Prisma.MedicalSessionInclude = {
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
};

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
      sex: (animal as any)?.sex?.numericValue ?? null,

      // Clinical — numeric vitals
      temperature: clinicalExam.temperature,
      pulse: clinicalExam.pulse,
      respiratoryRate: clinicalExam.respiratoryRate,
      rumination: clinicalExam.rumination,
      rumenInfusoriaCount: clinicalExam.rumenInfusoriaCount,

      // Clinical — habitus
      bodyType: (clinicalExam as any).bodyType?.numericValue ?? null,
      obesity: (clinicalExam as any).obesity?.numericValue ?? null,
      bodyPosition: (clinicalExam as any).bodyPosition?.numericValue ?? null,
      constitution: (clinicalExam as any).constitution?.numericValue ?? null,
      temperament: (clinicalExam as any).temperament?.numericValue ?? null,

      // Clinical — skin cover
      wool: (clinicalExam as any).wool?.numericValue ?? null,
      down: (clinicalExam as any).down?.numericValue ?? null,
      hair: (clinicalExam as any).hair?.numericValue ?? null,
      feathers: (clinicalExam as any).feathers?.numericValue ?? null,

      // Clinical — skin
      skinColor: (clinicalExam as any).skinColor?.numericValue ?? null,
      skinHumidity: (clinicalExam as any).skinHumidity?.numericValue ?? null,
      skinTemp: (clinicalExam as any).skinTemp?.numericValue ?? null,
      skinElasticity:
        (clinicalExam as any).skinElasticity?.numericValue ?? null,

      // Clinical — lymph
      lymphSize: (clinicalExam as any).lymphSize?.numericValue ?? null,
      lymphShape: (clinicalExam as any).lymphShape?.numericValue ?? null,
      lymphSurface: (clinicalExam as any).lymphSurface?.numericValue ?? null,
      lymphConsistency:
        (clinicalExam as any).lymphConsistency?.numericValue ?? null,
      lymphTemp: (clinicalExam as any).lymphTemp?.numericValue ?? null,
      lymphPain: (clinicalExam as any).lymphPain?.numericValue ?? null,
      lymphMobility: (clinicalExam as any).lymphMobility?.numericValue ?? null,

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
      urineColor: (urineExam as any)?.urineColor?.numericValue ?? null,
      urineSmell: (urineExam as any)?.urineSmell?.numericValue ?? null,
      urineClarity: (urineExam as any)?.urineClarity?.numericValue ?? null,
      urineConsistency:
        (urineExam as any)?.urineConsistency?.numericValue ?? null,

      // Feces — numeric
      fecesAmount: fecesExam?.amount ?? null,
      fecesUndigestedFood: fecesExam?.undigestedFood ?? null,

      // Feces — lookups
      fecesColor: (fecesExam as any)?.fecesColor?.numericValue ?? null,
      fecesSmell: (fecesExam as any)?.fecesSmell?.numericValue ?? null,
      fecesConsistency:
        (fecesExam as any)?.fecesConsistency?.numericValue ?? null,
      fecesForm: (fecesExam as any)?.fecesForm?.numericValue ?? null,

      // Mucosa — from first exam (if any)
      mucosaType: (mucosaExams?.[0] as any)?.mucosaType?.numericValue ?? null,
      mucosaAppearance:
        (mucosaExams?.[0] as any)?.mucosaAppearance?.numericValue ?? null,
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

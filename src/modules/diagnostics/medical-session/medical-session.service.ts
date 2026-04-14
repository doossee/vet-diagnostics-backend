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
  animal: {
    include: { sex: true, animalType: { select: { modelKey: true } } },
  },
  veterinarian: {
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  },
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
  anomalyAlerts: true,
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
        // veterinarianId: veterinarian.id,
        ...(data.date && { date: new Date(data.date) }),
      },
      include: sessionInclude,
    });
  }

  async findAll(query: MedicalSessionQueryParamsDto) {
    const {
      page,
      perPage,
      byId,
      animalId,
      veterinarianId,
      status,
      search,
      hasClinicalExam,
      hasBloodExam,
      hasUrineExam,
      hasFecesExam,
      hasMucosaExam,
    } = query;

    const where: Prisma.MedicalSessionWhereInput = {
      ...(animalId && { animalId }),
      ...(veterinarianId && { veterinarianId }),
      ...(status && { status }),
      ...(search && {
        animal: {
          animalNameCode: { contains: search, mode: 'insensitive' },
        },
      }),
      ...(hasClinicalExam !== undefined && {
        clinicalExam: hasClinicalExam ? { isNot: null } : { is: null },
      }),
      ...(hasBloodExam !== undefined && {
        bloodExam: hasBloodExam ? { isNot: null } : { is: null },
      }),
      ...(hasUrineExam !== undefined && {
        urineExam: hasUrineExam ? { isNot: null } : { is: null },
      }),
      ...(hasFecesExam !== undefined && {
        fecesExam: hasFecesExam ? { isNot: null } : { is: null },
      }),
      ...(hasMucosaExam !== undefined && {
        mucosaExams: hasMucosaExam ? { some: {} } : { none: {} },
      }),
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
    // Order matches values.txt (85 features expected by the ML model)
    const inputVector = {
      // 1–3: Clinical vitals
      pulse: clinicalExam.pulse,
      respiratoryRate: clinicalExam.respiratoryRate,
      temperature: clinicalExam.temperature,

      // 4–11: Blood — morphological
      erythrocyteCount: bloodExam.erythrocyteCount,
      leukocyteCount: bloodExam.leukocyteCount,
      thrombocyteCount: bloodExam.thrombocyteCount,
      coe: bloodExam.coe,
      waterPercentage: bloodExam.waterPercentage,
      dryResidue: bloodExam.dryResidue,
      glutathione: bloodExam.glutathione,
      hemoglobin: bloodExam.hemoglobin,

      // 12–41: Blood — serum & trace elements
      totalProtein: bloodExam.totalProtein,
      albumin: bloodExam.albumin,
      alphaGlobulin: bloodExam.alphaGlobulin,
      betaGlobulin: bloodExam.betaGlobulin,
      gammaGlobulin: bloodExam.gammaGlobulin,
      residualNitrogen: bloodExam.residualNitrogen,
      urea: bloodExam.urea,
      uricAcid: bloodExam.uricAcid,
      creatinine: bloodExam.creatinine,
      alkalineReserve: bloodExam.alkalineReserve,
      glucose: bloodExam.glucose,
      ketoneBodies: bloodExam.ketoneBodies,
      totalBilirubin: bloodExam.totalBilirubin,
      directBilirubin: bloodExam.directBilirubin,
      totalCholesterol: bloodExam.totalCholesterol,
      totalLipids: bloodExam.totalLipids,
      phospholipids: bloodExam.phospholipids,
      lacticAcid: bloodExam.lacticAcid,
      pyruvicAcid: bloodExam.pyruvicAcid,
      citricAcid: bloodExam.citricAcid,
      carotene: bloodExam.carotene,
      vitaminA: bloodExam.vitaminA,
      vitaminC: bloodExam.vitaminC,
      organicPhosphorus: bloodExam.organicPhosphorus,
      totalCalcium: bloodExam.totalCalcium,
      creatine: bloodExam.creatine,
      copper: bloodExam.copper,
      zinc: bloodExam.zinc,
      manganese: bloodExam.manganese,
      cobalt: bloodExam.cobalt,

      // 42–57: Urine
      urineColor: urineExam?.urineColor?.numericValue ?? null,
      urineSmell: urineExam?.urineSmell?.numericValue ?? null,
      urineClarity: urineExam?.urineClarity?.numericValue ?? null,
      urineConsistency: urineExam?.urineConsistency?.numericValue ?? null,
      urinePh: urineExam?.ph ?? null,
      urineAcetone: urineExam?.acetone ?? null,
      urineProtein: urineExam?.protein ?? null,
      urineBilirubin: urineExam?.bilirubin ?? null,
      urineUrobilinogen: urineExam?.urobilinogen ?? null,
      urineSugar: urineExam?.sugar ?? null,
      urineLeukocytes: urineExam?.leukocytes ?? null,
      urineEpithelium: urineExam?.epithelium ?? null,
      urineMicrobialBodies: urineExam?.microbialBodies ?? null,
      urineErythrocytes: urineExam?.erythrocytes ?? null,
      urineSaltCrystals: urineExam?.saltCrystals ?? null,
      urineAmount: urineExam?.amount ?? null,

      // 58–63: Feces
      fecesSmell: fecesExam?.fecesSmell?.numericValue ?? null,
      fecesColor: fecesExam?.fecesColor?.numericValue ?? null,
      fecesConsistency: fecesExam?.fecesConsistency?.numericValue ?? null,
      fecesForm: fecesExam?.fecesForm?.numericValue ?? null,
      fecesAmount: fecesExam?.amount ?? null,
      fecesUndigestedFood: fecesExam?.undigestedFood ?? null,

      // 64–67: Mucosa — MucosaType numericValue: 0=oral, 1=nasal, 2=ocular, 3=vaginal
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

      // 68–85: Clinical — habitus, skin, lymph
      rumination: clinicalExam.rumination,
      obesity: clinicalExam.obesity?.numericValue ?? null,
      bodyType: clinicalExam.bodyType?.numericValue ?? null,
      bodyPosition: clinicalExam.bodyPosition?.numericValue ?? null,
      wool: clinicalExam.wool?.numericValue ?? null,
      skinColor: clinicalExam.skinColor?.numericValue ?? null,
      skinHumidity: clinicalExam.skinHumidity?.numericValue ?? null,
      skinSmell: clinicalExam.skinSmell?.numericValue ?? null,
      skinTemp: clinicalExam.skinTemp?.numericValue ?? null,
      skinSurface: clinicalExam.skinSurface?.numericValue ?? null,
      skinElasticity: clinicalExam.skinElasticity?.numericValue ?? null,
      lymphSize: clinicalExam.lymphSize?.numericValue ?? null,
      lymphShape: clinicalExam.lymphShape?.numericValue ?? null,
      lymphSurface: clinicalExam.lymphSurface?.numericValue ?? null,
      lymphConsistency: clinicalExam.lymphConsistency?.numericValue ?? null,
      lymphTemp: clinicalExam.lymphTemp?.numericValue ?? null,
      lymphPain: clinicalExam.lymphPain?.numericValue ?? null,
      lymphMobility: clinicalExam.lymphMobility?.numericValue ?? null,
    };

    const nullFields = Object.entries(inputVector)
      .filter(([, value]) => value === null)
      .map(([field]) => field);

    if (nullFields.length > 0) {
      throw new BadRequestException({
        message: 'Cannot submit session. Some required fields are null.',
        nullFields,
      });
    }

    const numericArray = Object.values(inputVector).map((v) => Number(v));

    // Call the AI prediction service
    const uri = this.config.get<string>('PREDICT_API_URI');

    let response: { data: Record<string, any> };
    try {
      response = await axios.post<Record<string, any>>(
        uri!,
        {
          params: numericArray,
        },
        { params: { animal: animal.animalType?.modelKey } },
      );
    } catch (error) {
      console.log(error);
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

  async getPrediction(id: string) {
    return await this.prisma.prediction.findUniqueOrThrow({
      where: { sessionId: id },
    });
  }

  async delete(id: string) {
    return await this.prisma.medicalSession.delete({
      where: { id },
    });
  }
}

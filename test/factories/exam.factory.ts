import {
  BloodExam,
  ClinicalExam,
  UrineExam,
  FecesExam,
  MucosaExam,
} from 'src/generated/prisma/client';
import { getPrismaTestClient } from '../utils/database';
import { AnimalFactory } from './animal.factory';

export class BloodExamFactory {
  private prisma = getPrismaTestClient();
  private animalFactory = new AnimalFactory();

  async create(overrides?: {
    animalId?: string;
    sessionId?: string;
    hemoglobin?: number;
    erythrocyteCount?: number;
    leukocyteCount?: number;
    thrombocyteCount?: number;
    glucose?: number;
    totalProtein?: number;
    conclusion?: string;
  }): Promise<BloodExam> {
    let animalId = overrides?.animalId ?? undefined;
    if (!animalId) {
      const animal = await this.animalFactory.create();
      animalId = animal.id;
    }

    return this.prisma.bloodExam.create({
      data: {
        animalId,
        sessionId: overrides?.sessionId || null,
        hemoglobin: overrides?.hemoglobin ?? 12.5,
        erythrocyteCount: overrides?.erythrocyteCount ?? 6.0,
        leukocyteCount: overrides?.leukocyteCount ?? 8.0,
        thrombocyteCount: overrides?.thrombocyteCount ?? 250.0,
        glucose: overrides?.glucose ?? 4.5,
        totalProtein: overrides?.totalProtein ?? 70.0,
        conclusion: overrides?.conclusion || null,
      },
    });
  }
}

export class ClinicalExamFactory {
  private prisma = getPrismaTestClient();
  private animalFactory = new AnimalFactory();

  async create(overrides?: {
    animalId?: string;
    sessionId?: string;
    pulse?: number;
    temperature?: number;
    respiratoryRate?: number;
    rumination?: number;
    bodyTypeId?: string;
    obesityId?: string;
    bodyPositionId?: string;
    constitutionId?: string;
    temperamentId?: string;
  }): Promise<ClinicalExam> {
    let animalId = overrides?.animalId;
    if (!animalId) {
      const animal = await this.animalFactory.create();
      animalId = animal.id;
    }

    return this.prisma.clinicalExam.create({
      data: {
        animalId,
        sessionId: overrides?.sessionId || null,
        pulse: overrides?.pulse ?? 72,
        temperature: overrides?.temperature ?? 38.5,
        respiratoryRate: overrides?.respiratoryRate ?? 18,
        rumination: overrides?.rumination ?? 3,
        bodyTypeId: overrides?.bodyTypeId || null,
        obesityId: overrides?.obesityId || null,
        bodyPositionId: overrides?.bodyPositionId || null,
        constitutionId: overrides?.constitutionId || null,
        temperamentId: overrides?.temperamentId || null,
      },
    });
  }
}

export class UrineExamFactory {
  private prisma = getPrismaTestClient();
  private animalFactory = new AnimalFactory();

  async create(overrides?: {
    animalId?: string;
    sessionId?: string;
    urineColorId?: string;
    urineClarityId?: string;
    urineConsistencyId?: string;
    urineSmellId?: string;
    amount?: number;
    ph?: number;
    protein?: number;
    sugar?: number;
  }): Promise<UrineExam> {
    let animalId = overrides?.animalId ?? undefined;
    if (!animalId) {
      const animal = await this.animalFactory.create();
      animalId = animal.id;
    }

    return this.prisma.urineExam.create({
      data: {
        animalId,
        sessionId: overrides?.sessionId || null,
        urineColorId: overrides?.urineColorId || null,
        urineClarityId: overrides?.urineClarityId || null,
        urineConsistencyId: overrides?.urineConsistencyId || null,
        urineSmellId: overrides?.urineSmellId || null,
        amount: overrides?.amount ?? 1.5,
        ph: overrides?.ph ?? 7.0,
        protein: overrides?.protein ?? 0.1,
        sugar: overrides?.sugar ?? 0.0,
      },
    });
  }
}

export class FecesExamFactory {
  private prisma = getPrismaTestClient();
  private animalFactory = new AnimalFactory();

  async create(overrides?: {
    animalId?: string;
    sessionId?: string;
    fecesColorId?: string;
    fecesSmellId?: string;
    fecesConsistencyId?: string;
    fecesFormId?: string;
    amount?: number;
    undigestedFood?: number;
  }): Promise<FecesExam> {
    let animalId = overrides?.animalId ?? undefined;
    if (!animalId) {
      const animal = await this.animalFactory.create();
      animalId = animal.id;
    }

    return this.prisma.fecesExam.create({
      data: {
        animalId,
        sessionId: overrides?.sessionId || null,
        fecesColorId: overrides?.fecesColorId || null,
        fecesSmellId: overrides?.fecesSmellId || null,
        fecesConsistencyId: overrides?.fecesConsistencyId || null,
        fecesFormId: overrides?.fecesFormId || null,
        amount: overrides?.amount ?? 2.0,
        undigestedFood: overrides?.undigestedFood ?? 0.5,
      },
    });
  }
}

export class MucosaExamFactory {
  private prisma = getPrismaTestClient();
  private animalFactory = new AnimalFactory();

  async create(overrides?: {
    animalId?: string;
    sessionId?: string;
    mucosaTypeId?: string;
    mucosaAppearanceId?: string;
  }): Promise<MucosaExam> {
    let animalId = overrides?.animalId ?? undefined;
    if (!animalId) {
      const animal = await this.animalFactory.create();
      animalId = animal.id;
    }

    return this.prisma.mucosaExam.create({
      data: {
        animalId,
        sessionId: overrides?.sessionId || null,
        mucosaTypeId: overrides?.mucosaTypeId || null,
        mucosaAppearanceId: overrides?.mucosaAppearanceId || null,
      },
    });
  }
}

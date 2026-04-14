import {
  MedicalSession,
  SessionStatus,
  UserRole,
} from 'src/generated/prisma/client';
import { getPrismaTestClient } from '../utils/database';
import { UserFactory } from './user.factory';
import { AnimalFactory } from './animal.factory';
import { RegionFactory } from './region.factory';

export class MedicalSessionFactory {
  private prisma = getPrismaTestClient();
  private userFactory = new UserFactory();
  private animalFactory = new AnimalFactory();
  private regionFactory = new RegionFactory();

  async create(overrides?: {
    animalId?: string;
    veterinarianId?: string;
    date?: Date;
    status?: SessionStatus;
    notes?: string;
  }): Promise<MedicalSession> {
    let animalId = overrides?.animalId;
    if (!animalId) {
      const animal = await this.animalFactory.create();
      animalId = animal.id;
    }

    let veterinarianId = overrides?.veterinarianId;
    if (!veterinarianId) {
      // Create a region + district for the user
      const region = await this.regionFactory.create();
      const district = await this.prisma.district.create({
        data: {
          name: { ru: `Район_${Date.now()}`, uz: `District_${Date.now()}` },
          regionId: region.id,
        },
      });

      // Create a vet user
      const user = await this.userFactory.create({
        role: UserRole.VETERINARIAN,
        districtId: district.id,
      });

      // Create a VetProfile (shares the same ID as the User)
      await this.prisma.vetProfile.create({
        data: {
          id: user.id,
          licenseNumber: `LIC-${Date.now()}`,
          specialization: 'General',
          experience: 5,
        },
      });

      veterinarianId = user.id;
    }

    return this.prisma.medicalSession.create({
      data: {
        animalId,
        veterinarianId,
        date: overrides?.date || new Date(),
        status: overrides?.status || SessionStatus.DRAFT,
        notes: overrides?.notes || null,
      },
    });
  }

  async createMany(
    count: number,
    overrides?: {
      animalId?: string;
      veterinarianId?: string;
      status?: SessionStatus;
    },
  ): Promise<MedicalSession[]> {
    const sessions: MedicalSession[] = [];
    for (let i = 0; i < count; i++) {
      sessions.push(await this.create(overrides));
    }
    return sessions;
  }
}

import { Region, District } from 'src/generated/prisma/client';
import { getPrismaTestClient } from '../utils/database';

export class RegionFactory {
  private prisma = getPrismaTestClient();

  async create(overrides?: Partial<Region>): Promise<Region> {
    return this.prisma.region.create({
      data: {
        name: {
          ru: (overrides as any)?.nameRu || `Регион ${Date.now()}`,
          uz: (overrides as any)?.nameUz || `Region ${Date.now()}`,
        },
      },
    });
  }

  async createWithDistricts(districtCount: number = 2): Promise<Region> {
    const region = await this.create();

    for (let i = 0; i < districtCount; i++) {
      await this.prisma.district.create({
        data: {
          name: { ru: `Район ${i + 1}`, uz: `District ${i + 1}` },
          regionId: region.id,
        },
      });
    }

    return this.prisma.region.findUniqueOrThrow({
      where: { id: region.id },
      include: { districts: true },
    });
  }
}

export class DistrictFactory {
  private prisma = getPrismaTestClient();

  async create(
    regionId: number,
    overrides?: Partial<District>,
  ): Promise<District> {
    return this.prisma.district.create({
      data: {
        name: {
          ru: (overrides as any)?.nameRu || `Район ${Date.now()}`,
          uz: (overrides as any)?.nameUz || `District ${Date.now()}`,
        },
        regionId: regionId,
      },
    });
  }
}

import { Region, District } from '@prisma/client';
import { getPrismaTestClient } from '../utils/database';

export class RegionFactory {
  private prisma = getPrismaTestClient();

  async create(overrides?: Partial<Region>): Promise<Region> {
    return this.prisma.region.create({
      data: {
        name_ru: overrides?.name_ru || `Регион ${Date.now()}`,
        name_uz: overrides?.name_uz || `Region ${Date.now()}`,
      },
    });
  }

  async createWithDistricts(districtCount: number = 2): Promise<Region> {
    const region = await this.create();

    for (let i = 0; i < districtCount; i++) {
      await this.prisma.district.create({
        data: {
          name_ru: `Район ${i + 1}`,
          name_uz: `District ${i + 1}`,
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
        name_ru: overrides?.name_ru || `Район ${Date.now()}`,
        name_uz: overrides?.name_uz || `District ${Date.now()}`,
        regionId: regionId,
      },
    });
  }
}

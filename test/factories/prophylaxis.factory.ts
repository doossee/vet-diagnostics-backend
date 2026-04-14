import {
  Prophylaxis,
  ProphylaxisItem,
  ProphylaxisDetail,
  ProphylaxisType,
  Prisma,
} from 'src/generated/prisma/client';
import { getPrismaTestClient } from '../utils/database';
import { AnimalFactory } from './animal.factory';

export class ProphylaxisItemFactory {
  private prisma = getPrismaTestClient();

  async create(overrides?: {
    name?: { ru: string; uz: string };
    type?: ProphylaxisType;
  }): Promise<ProphylaxisItem> {
    return this.prisma.prophylaxisItem.create({
      data: {
        name: (overrides?.name || {
          ru: `Препарат_${Date.now()}`,
          uz: `Item_${Date.now()}`,
        }) as unknown as Prisma.InputJsonValue,
        type: overrides?.type || ProphylaxisType.VACCINE,
      },
    });
  }
}

export class ProphylaxisDetailFactory {
  private prisma = getPrismaTestClient();
  private itemFactory = new ProphylaxisItemFactory();

  async create(overrides?: {
    name?: { ru: string; uz: string };
    itemId?: string;
  }): Promise<ProphylaxisDetail> {
    let itemId = overrides?.itemId;
    if (!itemId) {
      const item = await this.itemFactory.create();
      itemId = item.id;
    }

    return this.prisma.prophylaxisDetail.create({
      data: {
        name: (overrides?.name || {
          ru: `Деталь_${Date.now()}`,
          uz: `Detail_${Date.now()}`,
        }) as unknown as Prisma.InputJsonValue,
        itemId,
      },
    });
  }
}

export class ProphylaxisFactory {
  private prisma = getPrismaTestClient();
  private animalFactory = new AnimalFactory();
  private itemFactory = new ProphylaxisItemFactory();

  async create(overrides?: {
    animalId?: string;
    itemId?: string;
    detailId?: string;
    type?: ProphylaxisType;
    date?: Date;
    notes?: string;
  }): Promise<Prophylaxis> {
    let animalId = overrides?.animalId;
    if (!animalId) {
      const animal = await this.animalFactory.create();
      animalId = animal.id;
    }

    const type = overrides?.type || ProphylaxisType.VACCINE;

    let itemId = overrides?.itemId;
    if (!itemId) {
      const item = await this.itemFactory.create({ type });
      itemId = item.id;
    }

    return this.prisma.prophylaxis.create({
      data: {
        animalId,
        itemId,
        detailId: overrides?.detailId || null,
        type,
        date: overrides?.date || new Date(),
        notes: overrides?.notes || null,
      },
    });
  }

  async createMany(
    count: number,
    overrides?: {
      animalId?: string;
      itemId?: string;
      type?: ProphylaxisType;
    },
  ): Promise<Prophylaxis[]> {
    const records: Prophylaxis[] = [];
    for (let i = 0; i < count; i++) {
      records.push(await this.create(overrides));
    }
    return records;
  }
}

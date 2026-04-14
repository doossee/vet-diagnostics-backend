import { getPrismaTestClient } from '../utils/database';
import { Prisma } from 'src/generated/prisma/client';

/**
 * Generic factory for bilingual name lookup tables.
 * All lookup tables have `name Json` with `{ ru, uz }` shape,
 * and many have a `numericValue Int` field.
 */
export class LookupFactory {
  private prisma = getPrismaTestClient();

  async create(
    modelName: string,
    overrides?: {
      name?: { ru: string; uz: string };
      numericValue?: number;
      [key: string]: unknown;
    },
  ) {
    const { name, numericValue, ...rest } = overrides || {};

    const data: Record<string, unknown> = {
      name: (name || {
        ru: `Тест_${Date.now()}`,
        uz: `Test_${Date.now()}`,
      }) as unknown as Prisma.InputJsonValue,
      ...rest,
    };

    if (numericValue !== undefined) {
      data.numericValue = numericValue;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await (this.prisma as any)[modelName].create({ data });
  }

  /**
   * Create a lookup that requires animalTypeId (urine, feces, mucosa lookups).
   */
  async createWithAnimalType(
    modelName: string,
    animalTypeId: string,
    overrides?: {
      name?: { ru: string; uz: string };
      numericValue?: number;
      [key: string]: unknown;
    },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.create(modelName, {
      ...overrides,
      animalTypeId,
    });
  }
}

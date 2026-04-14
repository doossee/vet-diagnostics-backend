import { Disease, DiseaseCategory, Prisma } from 'src/generated/prisma/client';
import { getPrismaTestClient } from '../utils/database';

export class DiseaseCategoryFactory {
  private prisma = getPrismaTestClient();

  async create(overrides?: Partial<DiseaseCategory>): Promise<DiseaseCategory> {
    return this.prisma.diseaseCategory.create({
      data: {
        name: {
          ru: `Категория_${Date.now()}`,
          uz: `Category_${Date.now()}`,
        } as unknown as Prisma.InputJsonValue,
        parentId: overrides?.parentId || null,
      },
    });
  }

  async createWithChildren(childCount: number = 2): Promise<DiseaseCategory> {
    const parent = await this.create();

    for (let i = 0; i < childCount; i++) {
      await this.prisma.diseaseCategory.create({
        data: {
          name: {
            ru: `Подкатегория_${i + 1}_${Date.now()}`,
            uz: `Subcategory_${i + 1}_${Date.now()}`,
          } as unknown as Prisma.InputJsonValue,
          parentId: parent.id,
        },
      });
    }

    return this.prisma.diseaseCategory.findUniqueOrThrow({
      where: { id: parent.id },
      include: { children: true },
    });
  }
}

export class DiseaseFactory {
  private prisma = getPrismaTestClient();
  private categoryFactory = new DiseaseCategoryFactory();

  async create(overrides?: {
    name?: { ru: string; uz: string };
    diseaseCategoryId?: string;
  }): Promise<Disease> {
    let diseaseCategoryId = overrides?.diseaseCategoryId;

    if (!diseaseCategoryId) {
      const category = await this.categoryFactory.create();
      diseaseCategoryId = category.id;
    }

    return this.prisma.disease.create({
      data: {
        name: (overrides?.name || {
          ru: `Болезнь_${Date.now()}`,
          uz: `Disease_${Date.now()}`,
        }) as unknown as Prisma.InputJsonValue,
        diseaseCategoryId,
      },
    });
  }

  async createMany(
    count: number,
    overrides?: {
      name?: { ru: string; uz: string };
      diseaseCategoryId?: string;
    },
  ): Promise<Disease[]> {
    const diseases: Disease[] = [];
    for (let i = 0; i < count; i++) {
      diseases.push(await this.create(overrides));
    }
    return diseases;
  }
}

import { Animal, AnimalSex, AnimalType, Breed, Color } from '@prisma/client';
import { getPrismaTestClient } from '../utils/database';

export class AnimalFactory {
  private prisma = getPrismaTestClient();

  async create(overrides?: Partial<Animal>): Promise<Animal> {
    // Create dependencies if not provided
    let animalTypeId = overrides?.animalTypeId;
    if (!animalTypeId) {
      const animalType = await this.prisma.animalType.create({
        data: {
          name_ru: 'Крупный рогатый скот',
          name_uz: 'Qoramol',
        },
      });
      animalTypeId = animalType.id;
    }

    let animalBreedId = overrides?.animalBreedId;
    if (!animalBreedId) {
      const breed = await this.prisma.breed.create({
        data: {
          name_ru: 'Голштинская',
          name_uz: 'Holstein',
        },
      });
      animalBreedId = breed.id;
    }

    let animalColorId = overrides?.animalColorId;
    if (!animalColorId) {
      const color = await this.prisma.color.create({
        data: {
          name_ru: 'Белый',
          name_uz: 'Oq',
        },
      });
      animalColorId = color.id;
    }

    return this.prisma.animal.create({
      data: {
        arrivalDate: overrides?.arrivalDate || new Date(),
        age: overrides?.age || 12,
        sex: overrides?.sex || AnimalSex.FEMALE,
        farmerId: overrides?.farmerId || 'test-farmer-id',
        animalTypeId,
        animalBreedId,
        animalColorId,
      },
    });
  }

  async createMany(
    count: number,
    overrides?: Partial<Animal>,
  ): Promise<Animal[]> {
    const animals: Animal[] = [];
    for (let i = 0; i < count; i++) {
      animals.push(await this.create(overrides));
    }
    return animals;
  }
}

export class AnimalTypeFactory {
  private prisma = getPrismaTestClient();

  async create(overrides?: Partial<AnimalType>): Promise<AnimalType> {
    return this.prisma.animalType.create({
      data: {
        name_ru: overrides?.name_ru || `Тип ${Date.now()}`,
        name_uz: overrides?.name_uz || `Type ${Date.now()}`,
        parentId: overrides?.parentId || null,
      },
    });
  }
}

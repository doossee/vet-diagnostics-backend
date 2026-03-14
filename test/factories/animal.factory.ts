import { Animal, AnimalSex, AnimalType, Breed, Color } from '../src/generated/prisma/client';
import { getPrismaTestClient } from '../utils/database';

export class AnimalFactory {
  private prisma = getPrismaTestClient();

  async create(overrides?: Partial<Animal>): Promise<Animal> {
    // Create dependencies if not provided
    let animalTypeId = overrides?.animalTypeId;
    if (!animalTypeId) {
      const animalType = await this.prisma.animalType.create({
        data: {
          nameRu: 'Крупный рогатый скот',
          nameUz: 'Qoramol',
        },
      });
      animalTypeId = animalType.id;
    }

    let animalBreedId = overrides?.animalBreedId;
    if (!animalBreedId) {
      const breed = await this.prisma.breed.create({
        data: {
          nameRu: 'Голштинская',
          nameUz: 'Holstein',
        },
      });
      animalBreedId = breed.id;
    }

    let animalColorId = overrides?.animalColorId;
    if (!animalColorId) {
      const color = await this.prisma.color.create({
        data: {
          nameRu: 'Белый',
          nameUz: 'Oq',
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
        nameRu: overrides?.nameRu || `Тип ${Date.now()}`,
        nameUz: overrides?.nameUz || `Type ${Date.now()}`,
        parentId: overrides?.parentId || null,
      },
    });
  }
}

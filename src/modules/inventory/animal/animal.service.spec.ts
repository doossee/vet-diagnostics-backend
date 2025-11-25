import { Test, TestingModule } from '@nestjs/testing';
import { AnimalService } from './animal.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import { AnimalSex } from 'src/shared/enums';

describe('AnimalService', () => {
  let service: AnimalService;
  let prismaService: PrismaService;
  let paginationService: PaginationService;

  const mockPrismaService = {
    animal: {
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockPaginationService = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<AnimalService>(AnimalService);
    prismaService = module.get<PrismaService>(PrismaService);
    paginationService = module.get<PaginationService>(PaginationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new animal', async () => {
      const createAnimalDto = {
        arrivalDate: '2024-01-15T00:00:00Z',
        age: 12,
        sex: AnimalSex.FEMALE,
        farmerId: 'farmer-id',
        animalTypeId: 'type-id',
        animalBreedId: 'breed-id',
        animalColorId: 'color-id',
      };

      const mockAnimal = {
        id: 'animal-id',
        arrivalDate: new Date(createAnimalDto.arrivalDate),
        age: createAnimalDto.age,
        sex: createAnimalDto.sex,
        farmerId: createAnimalDto.farmerId,
        animalTypeId: createAnimalDto.animalTypeId,
        animalBreedId: createAnimalDto.animalBreedId,
        animalColorId: createAnimalDto.animalColorId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.animal.create.mockResolvedValue(mockAnimal);

      const result = await service.create(createAnimalDto);

      expect(prismaService.animal.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          arrivalDate: expect.any(Date),
          age: 12,
          sex: AnimalSex.FEMALE,
        }),
        include: {
          animalBreed: true,
          animalColor: true,
          animalType: true,
          farmer: true,
        },
      });
      expect(result).toEqual(mockAnimal);
    });
  });

  describe('findAll', () => {
    it('should return paginated animals', async () => {
      const queryParams = {
        page: 1,
        perPage: 10,
      };

      const mockAnimals = [
        {
          id: 'animal-1',
          age: 12,
          sex: AnimalSex.FEMALE,
          arrivalDate: new Date(),
        },
        {
          id: 'animal-2',
          age: 24,
          sex: AnimalSex.MALE,
          arrivalDate: new Date(),
        },
      ];

      const mockPaginatedResult = {
        data: mockAnimals,
        meta: {
          page: 1,
          perPage: 10,
          total: 2,
          totalPages: 1,
        },
      };

      mockPaginationService.paginate.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(queryParams as any);

      expect(paginationService.paginate).toHaveBeenCalled();
      expect(result.data).toHaveLength(2);
    });

    it('should filter animals by sex', async () => {
      const queryParams = {
        page: 1,
        perPage: 10,
        sex: AnimalSex.FEMALE,
      };

      const mockAnimals = [
        {
          id: 'animal-1',
          age: 12,
          sex: AnimalSex.FEMALE,
          arrivalDate: new Date(),
        },
      ];

      const mockPaginatedResult = {
        data: mockAnimals,
        meta: {
          page: 1,
          perPage: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockPaginationService.paginate.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(queryParams as any);

      expect(paginationService.paginate).toHaveBeenCalledWith(
        prismaService.animal,
        expect.objectContaining({
          where: expect.objectContaining({
            sex: AnimalSex.FEMALE,
          }),
        }),
        { page: 1, perPage: 10 },
      );
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return an animal by id', async () => {
      const mockAnimal = {
        id: 'animal-id',
        age: 12,
        sex: AnimalSex.FEMALE,
        arrivalDate: new Date(),
      };

      mockPrismaService.animal.findUniqueOrThrow.mockResolvedValue(mockAnimal);

      const result = await service.findOne('animal-id');

      expect(prismaService.animal.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 'animal-id' },
        include: {
          animalBreed: true,
          animalColor: true,
          animalType: true,
          farmer: true,
        },
      });
      expect(result).toEqual(mockAnimal);
    });
  });

  describe('update', () => {
    it('should update an animal', async () => {
      const updateData = {
        age: 24,
        sex: AnimalSex.MALE,
      };

      const mockUpdatedAnimal = {
        id: 'animal-id',
        ...updateData,
        arrivalDate: new Date(),
      };

      mockPrismaService.animal.update.mockResolvedValue(mockUpdatedAnimal);

      const result = await service.update('animal-id', updateData);

      expect(prismaService.animal.update).toHaveBeenCalledWith({
        where: { id: 'animal-id' },
        data: updateData,
        include: {
          animalBreed: true,
          animalColor: true,
          animalType: true,
          farmer: true,
        },
      });
      expect(result.age).toBe(24);
    });
  });

  describe('delete', () => {
    it('should delete an animal', async () => {
      const mockAnimal = {
        id: 'animal-id',
        age: 12,
        sex: AnimalSex.FEMALE,
      };

      mockPrismaService.animal.delete.mockResolvedValue(mockAnimal);

      const result = await service.delete('animal-id');

      expect(prismaService.animal.delete).toHaveBeenCalledWith({
        where: { id: 'animal-id' },
      });
      expect(result).toEqual(mockAnimal);
    });
  });
});

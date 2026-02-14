import { Test, TestingModule } from '@nestjs/testing';
import { AnimalBreedService } from './animal-breed.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

describe('AnimalBreedService', () => {
  let service: AnimalBreedService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    breed: {
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
        AnimalBreedService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).compile();

    service = module.get<AnimalBreedService>(AnimalBreedService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a breed', async () => {
      const dto = { name_ru: 'Голштинская', name_uz: 'Holstein', animalTypeId: 'uuid-type' };
      const mockBreed = { id: 'uuid', ...dto };

      mockPrismaService.breed.create.mockResolvedValue(mockBreed);

      const result = await service.create(dto);

      expect(result).toEqual(mockBreed);
    });
  });

  describe('findAll', () => {
    it('should return paginated breeds', async () => {
      const mockResult = {
        data: [{ id: 'uuid', name_ru: 'Порода', name_uz: 'Breed', animalTypeId: 'uuid-type' }],
        meta: { page: 1, perPage: 10, total: 1, totalPages: 1 },
      };

      mockPaginationService.paginate.mockResolvedValue(mockResult);

      const result = await service.findAll({ page: 1, perPage: 10 } as any);

      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return a breed', async () => {
      const mockBreed = { id: 'uuid', name_ru: 'Порода' };
      mockPrismaService.breed.findUniqueOrThrow.mockResolvedValue(mockBreed);

      const result = await service.findOne('uuid');

      expect(result).toEqual(mockBreed);
    });
  });

  describe('update', () => {
    it('should update a breed', async () => {
      const dto = { name_ru: 'Updated' };
      const mockBreed = { id: 'uuid', ...dto };

      mockPrismaService.breed.update.mockResolvedValue(mockBreed);

      const result = await service.update('uuid', dto);

      expect(result).toEqual(mockBreed);
    });
  });

  describe('delete', () => {
    it('should delete a breed', async () => {
      const mockBreed = { id: 'uuid' };
      mockPrismaService.breed.delete.mockResolvedValue(mockBreed);

      const result = await service.delete('uuid');

      expect(result).toEqual(mockBreed);
    });
  });
});

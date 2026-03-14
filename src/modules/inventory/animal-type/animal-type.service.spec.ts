import { Test, TestingModule } from '@nestjs/testing';
import { AnimalTypeService } from './animal-type.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

describe('AnimalTypeService', () => {
  let service: AnimalTypeService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    animalType: {
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
        AnimalTypeService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).compile();

    service = module.get<AnimalTypeService>(AnimalTypeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create an animal type', async () => {
      const dto = { nameRu: 'Крупный рогатый скот', nameUz: 'Qoramol' };
      const mockType = { id: 'uuid', ...dto, parentId: null };

      mockPrismaService.animalType.create.mockResolvedValue(mockType);

      const result = await service.create(dto);

      expect(result).toEqual(mockType);
    });

    it('should create an animal type with parent', async () => {
      const dto = {
        nameRu: 'Подтип',
        nameUz: 'Subtype',
        parentId: 'parent-id',
      };
      const mockType = { id: 'uuid', ...dto };

      mockPrismaService.animalType.create.mockResolvedValue(mockType);

      const result = await service.create(dto);

      expect(result).toEqual(mockType);
    });
  });

  describe('findOne', () => {
    it('should return an animal type', async () => {
      const mockType = { id: 'uuid', nameRu: 'Тип', nameUz: 'Type' };
      mockPrismaService.animalType.findUniqueOrThrow.mockResolvedValue(
        mockType,
      );

      const result = await service.findOne('uuid');

      expect(result).toEqual(mockType);
    });
  });

  describe('update', () => {
    it('should update an animal type', async () => {
      const dto = { nameRu: 'Updated' };
      const mockType = { id: 'uuid', ...dto };

      mockPrismaService.animalType.update.mockResolvedValue(mockType);

      const result = await service.update('uuid', dto);

      expect(result).toEqual(mockType);
    });
  });

  describe('delete', () => {
    it('should delete an animal type', async () => {
      const mockType = { id: 'uuid' };
      mockPrismaService.animalType.delete.mockResolvedValue(mockType);

      const result = await service.delete('uuid');

      expect(result).toEqual(mockType);
    });
  });
});

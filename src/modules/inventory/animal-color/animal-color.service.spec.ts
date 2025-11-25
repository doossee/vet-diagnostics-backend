import { Test, TestingModule } from '@nestjs/testing';
import { AnimalColorService } from './animal-color.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

describe('AnimalColorService', () => {
  let service: AnimalColorService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    color: {
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
        AnimalColorService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).compile();

    service = module.get<AnimalColorService>(AnimalColorService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a color', async () => {
      const dto = { name_ru: 'Белый', name_uz: 'Oq' };
      const mockColor = { id: 'uuid', ...dto };

      mockPrismaService.color.create.mockResolvedValue(mockColor);

      const result = await service.create(dto);

      expect(result).toEqual(mockColor);
    });
  });

  describe('findAll', () => {
    it('should return paginated colors', async () => {
      const mockResult = {
        data: [{ id: 'uuid', name_ru: 'Белый', name_uz: 'Oq' }],
        meta: { page: 1, perPage: 10, total: 1, totalPages: 1 },
      };

      mockPaginationService.paginate.mockResolvedValue(mockResult);

      const result = await service.findAll({ page: 1, perPage: 10 } as any);

      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return a color', async () => {
      const mockColor = { id: 'uuid', name_ru: 'Белый' };
      mockPrismaService.color.findUniqueOrThrow.mockResolvedValue(mockColor);

      const result = await service.findOne('uuid');

      expect(result).toEqual(mockColor);
    });
  });

  describe('update', () => {
    it('should update a color', async () => {
      const dto = { name_ru: 'Updated' };
      const mockColor = { id: 'uuid', ...dto };

      mockPrismaService.color.update.mockResolvedValue(mockColor);

      const result = await service.update('uuid', dto);

      expect(result).toEqual(mockColor);
    });
  });

  describe('delete', () => {
    it('should delete a color', async () => {
      const mockColor = { id: 'uuid' };
      mockPrismaService.color.delete.mockResolvedValue(mockColor);

      const result = await service.delete('uuid');

      expect(result).toEqual(mockColor);
    });
  });
});

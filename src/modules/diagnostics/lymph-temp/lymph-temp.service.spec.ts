import { Test, TestingModule } from '@nestjs/testing';
import { LymphTempService } from './lymph-temp.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

describe('LymphTempService', () => {
  let service: LymphTempService;

  const mockPrismaService = {
    lymphTemp: {
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockPaginationService = { paginate: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LymphTempService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).compile();
    service = module.get<LymphTempService>(LymphTempService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a record', async () => {
      const dto = { name: { ru: 'Тест', uz: 'Test' }, numericValue: 1 };
      const mock = { id: 'uuid', ...dto };
      mockPrismaService.lymphTemp.create.mockResolvedValue(mock);
      expect(await service.create(dto as any)).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a record', async () => {
      const mock = { id: 'uuid', name: { ru: 'Тест', uz: 'Test' } };
      mockPrismaService.lymphTemp.findUniqueOrThrow.mockResolvedValue(mock);
      expect(await service.findOne('uuid')).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const dto = { name: { ru: 'Обновлено', uz: 'Updated' } };
      const mock = { id: 'uuid', ...dto };
      mockPrismaService.lymphTemp.update.mockResolvedValue(mock);
      expect(await service.update('uuid', dto as any)).toEqual(mock);
    });
  });

  describe('delete', () => {
    it('should delete a record', async () => {
      const mock = { id: 'uuid' };
      mockPrismaService.lymphTemp.delete.mockResolvedValue(mock);
      expect(await service.delete('uuid')).toEqual(mock);
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const mockResult = { data: [], meta: { total: 0, currentPage: 1, perPage: 10, lastPage: 0, prev: null, next: null } };
      mockPaginationService.paginate.mockResolvedValue(mockResult);
      expect(await service.findAll({ page: 1, perPage: 10 } as any)).toEqual(mockResult);
    });
  });

  describe('importFromExcel', () => {
    it('should import rows successfully', async () => {
      mockPrismaService.lymphTemp.create.mockResolvedValue({});
      const result = await service.importFromExcel([
        { name_ru: 'Тест', name_uz: 'Test', numericValue: 1 },
      ]);
      expect(result.imported).toBe(1);
      expect(result.errors).toHaveLength(0);
    });

    it('should collect errors for failed rows', async () => {
      mockPrismaService.lymphTemp.create.mockRejectedValue(new Error('duplicate'));
      const result = await service.importFromExcel([
        { name_ru: 'Тест', name_uz: 'Test', numericValue: 1 },
      ]);
      expect(result.imported).toBe(0);
      expect(result.errors).toHaveLength(1);
    });
  });
});

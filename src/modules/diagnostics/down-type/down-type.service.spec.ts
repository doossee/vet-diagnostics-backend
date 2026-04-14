import { Test, TestingModule } from '@nestjs/testing';
import { DownTypeService } from './down-type.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

describe('DownTypeService', () => {
  let service: DownTypeService;

  const mockPrismaService = {
    downType: {
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
        DownTypeService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).compile();
    service = module.get<DownTypeService>(DownTypeService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a record', async () => {
      const dto = { name: { ru: 'Тест', uz: 'Test' }, numericValue: 1 };
      const mock = { id: 'uuid', ...dto };
      mockPrismaService.downType.create.mockResolvedValue(mock);
      expect(await service.create(dto as any)).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a record', async () => {
      const mock = { id: 'uuid', name: { ru: 'Тест', uz: 'Test' } };
      mockPrismaService.downType.findUniqueOrThrow.mockResolvedValue(mock);
      expect(await service.findOne('uuid')).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const dto = { name: { ru: 'Обновлено', uz: 'Updated' } };
      const mock = { id: 'uuid', ...dto };
      mockPrismaService.downType.update.mockResolvedValue(mock);
      expect(await service.update('uuid', dto as any)).toEqual(mock);
    });
  });

  describe('delete', () => {
    it('should delete a record', async () => {
      const mock = { id: 'uuid' };
      mockPrismaService.downType.delete.mockResolvedValue(mock);
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
      mockPrismaService.downType.create.mockResolvedValue({});
      const result = await service.importFromExcel([
        { name_ru: 'Тест', name_uz: 'Test', numericValue: 1 },
      ]);
      expect(result.imported).toBe(1);
      expect(result.errors).toHaveLength(0);
    });

    it('should collect errors for failed rows', async () => {
      mockPrismaService.downType.create.mockRejectedValue(new Error('duplicate'));
      const result = await service.importFromExcel([
        { name_ru: 'Тест', name_uz: 'Test', numericValue: 1 },
      ]);
      expect(result.imported).toBe(0);
      expect(result.errors).toHaveLength(1);
    });
  });
});

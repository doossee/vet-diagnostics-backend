import { Test, TestingModule } from '@nestjs/testing';
import { DiseaseService } from './disease.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

describe('DiseaseService', () => {
  let service: DiseaseService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    disease: {
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
        DiseaseService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).compile();

    service = module.get<DiseaseService>(DiseaseService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a record', async () => {
      const dto = { name: 'Test' };
      const mockRecord = { id: 'uuid', ...dto };

      mockPrismaService.disease.create.mockResolvedValue(mockRecord);

      const result = await service.create(dto as any);

      expect(result).toEqual(mockRecord);
    });
  });

  describe('findOne', () => {
    it('should return a record', async () => {
      const mockRecord = { id: 'uuid', name: 'Test' };
      mockPrismaService.disease.findUniqueOrThrow.mockResolvedValue(mockRecord);

      const result = await service.findOne('uuid');

      expect(result).toEqual(mockRecord);
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const dto = { name: 'Updated' };
      const mockRecord = { id: 'uuid', ...dto };

      mockPrismaService.disease.update.mockResolvedValue(mockRecord);

      const result = await service.update('uuid', dto as any);

      expect(result).toEqual(mockRecord);
    });
  });

  describe('delete', () => {
    it('should delete a record', async () => {
      const mockRecord = { id: 'uuid' };
      mockPrismaService.disease.delete.mockResolvedValue(mockRecord);

      const result = await service.delete('uuid');

      expect(result).toEqual(mockRecord);
    });
  });
});

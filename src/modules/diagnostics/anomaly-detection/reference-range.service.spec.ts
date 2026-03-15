import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceRangeService } from './reference-range.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

describe('ReferenceRangeService', () => {
  let service: ReferenceRangeService;

  const mockPrismaService = {
    referenceRange: {
      create: jest.fn(),
      findMany: jest.fn(),
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
        ReferenceRangeService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).compile();

    service = module.get<ReferenceRangeService>(ReferenceRangeService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a reference range', async () => {
      const dto = {
        animalTypeId: 'type-uuid',
        parameter: 'pulse',
        minValue: 60,
        maxValue: 80,
        unit: 'bpm',
      };
      const mockRecord = { id: 'uuid', ...dto };
      mockPrismaService.referenceRange.create.mockResolvedValue(mockRecord);

      const result = await service.create(dto);
      expect(result).toEqual(mockRecord);
    });
  });

  describe('findOne', () => {
    it('should return a reference range', async () => {
      const mockRecord = { id: 'uuid', parameter: 'pulse' };
      mockPrismaService.referenceRange.findUniqueOrThrow.mockResolvedValue(
        mockRecord,
      );

      const result = await service.findOne('uuid');
      expect(result).toEqual(mockRecord);
    });
  });

  describe('delete', () => {
    it('should delete a reference range', async () => {
      const mockRecord = { id: 'uuid' };
      mockPrismaService.referenceRange.delete.mockResolvedValue(mockRecord);

      const result = await service.delete('uuid');
      expect(result).toEqual(mockRecord);
    });
  });

  describe('checkAnomalies', () => {
    const animalTypeId = 'type-uuid';

    it('should return empty array when no reference ranges exist', async () => {
      mockPrismaService.referenceRange.findMany.mockResolvedValue([]);

      const result = await service.checkAnomalies(animalTypeId, { pulse: 90 });
      expect(result).toEqual([]);
    });

    it('should return empty array when all values within range', async () => {
      mockPrismaService.referenceRange.findMany.mockResolvedValue([
        { parameter: 'pulse', minValue: 60, maxValue: 80 },
        { parameter: 'temperature', minValue: 37.5, maxValue: 39.5 },
      ]);

      const result = await service.checkAnomalies(animalTypeId, {
        pulse: 70,
        temperature: 38.5,
      });
      expect(result).toEqual([]);
    });

    it('should detect LOW severity anomaly (0-20% outside)', async () => {
      // Range: 60-80, span = 20. Value 82 → deviation 2, percent = 10%
      mockPrismaService.referenceRange.findMany.mockResolvedValue([
        { parameter: 'pulse', minValue: 60, maxValue: 80 },
      ]);

      const result = await service.checkAnomalies(animalTypeId, { pulse: 82 });
      expect(result).toHaveLength(1);
      expect(result[0].severity).toBe('LOW');
      expect(result[0].parameter).toBe('pulse');
      expect(result[0].value).toBe(82);
    });

    it('should detect MEDIUM severity anomaly (20-50% outside)', async () => {
      // Range: 60-80, span = 20. Value 90 → deviation 10, percent = 50%
      mockPrismaService.referenceRange.findMany.mockResolvedValue([
        { parameter: 'pulse', minValue: 60, maxValue: 80 },
      ]);

      const result = await service.checkAnomalies(animalTypeId, { pulse: 87 });
      expect(result).toHaveLength(1);
      expect(result[0].severity).toBe('MEDIUM');
    });

    it('should detect HIGH severity anomaly (50-100% outside)', async () => {
      // Range: 60-80, span = 20. Value 95 → deviation 15, percent = 75%
      mockPrismaService.referenceRange.findMany.mockResolvedValue([
        { parameter: 'pulse', minValue: 60, maxValue: 80 },
      ]);

      const result = await service.checkAnomalies(animalTypeId, { pulse: 95 });
      expect(result).toHaveLength(1);
      expect(result[0].severity).toBe('HIGH');
    });

    it('should detect CRITICAL severity anomaly (>100% outside)', async () => {
      // Range: 60-80, span = 20. Value 110 → deviation 30, percent = 150%
      mockPrismaService.referenceRange.findMany.mockResolvedValue([
        { parameter: 'pulse', minValue: 60, maxValue: 80 },
      ]);

      const result = await service.checkAnomalies(animalTypeId, { pulse: 110 });
      expect(result).toHaveLength(1);
      expect(result[0].severity).toBe('CRITICAL');
    });

    it('should detect below-range anomalies', async () => {
      // Range: 60-80, value 55 → deviation 5, percent = 25% → MEDIUM
      mockPrismaService.referenceRange.findMany.mockResolvedValue([
        { parameter: 'pulse', minValue: 60, maxValue: 80 },
      ]);

      const result = await service.checkAnomalies(animalTypeId, { pulse: 55 });
      expect(result).toHaveLength(1);
      expect(result[0].severity).toBe('MEDIUM');
    });

    it('should skip null/undefined values', async () => {
      mockPrismaService.referenceRange.findMany.mockResolvedValue([
        { parameter: 'pulse', minValue: 60, maxValue: 80 },
      ]);

      const result = await service.checkAnomalies(animalTypeId, {
        pulse: null,
        temperature: undefined,
      });
      expect(result).toEqual([]);
    });

    it('should skip parameters without reference ranges', async () => {
      mockPrismaService.referenceRange.findMany.mockResolvedValue([
        { parameter: 'pulse', minValue: 60, maxValue: 80 },
      ]);

      const result = await service.checkAnomalies(animalTypeId, {
        unknownParam: 999,
      });
      expect(result).toEqual([]);
    });

    it('should detect multiple anomalies at once', async () => {
      mockPrismaService.referenceRange.findMany.mockResolvedValue([
        { parameter: 'pulse', minValue: 60, maxValue: 80 },
        { parameter: 'temperature', minValue: 37.5, maxValue: 39.5 },
      ]);

      const result = await service.checkAnomalies(animalTypeId, {
        pulse: 110,
        temperature: 42,
      });
      expect(result).toHaveLength(2);
    });
  });
});

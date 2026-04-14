import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from './statistics.service';
import { PrismaService } from 'src/core/prisma/prisma.service';

describe('StatisticsService', () => {
  let service: StatisticsService;

  const mockPrismaService = {
    medicalSession: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    service = module.get<StatisticsService>(StatisticsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getDiseasesByAnimals', () => {
    it('should return disease stats sorted by index', async () => {
      mockPrismaService.medicalSession.findMany.mockResolvedValue([
        { prediction: { rawOutput: { '0': 0.9, '1': 0.05, '2': 0.05 } } },
        { prediction: { rawOutput: { '0': 0.8, '1': 0.1, '2': 0.1 } } },
        { prediction: { rawOutput: { '0': 0.1, '1': 0.8, '2': 0.1 } } },
      ]);

      const result = await service.getDiseasesByAnimals({} as any);

      expect(result.totalSessionsAnalyzed).toBe(3);
      expect(result.data).toHaveLength(2);
      // disease index "1" (from model output 0) should have count 2
      const disease1 = result.data.find((d) => d.diseaseIndex === '1');
      expect(disease1?.count).toBe(2);
    });

    it('should return empty data when no sessions exist', async () => {
      mockPrismaService.medicalSession.findMany.mockResolvedValue([]);
      const result = await service.getDiseasesByAnimals({} as any);
      expect(result.data).toHaveLength(0);
      expect(result.totalSessionsAnalyzed).toBe(0);
    });

    it('should skip sessions without predictions', async () => {
      mockPrismaService.medicalSession.findMany.mockResolvedValue([
        { prediction: { rawOutput: null } },
        { prediction: { rawOutput: { '0': 0.9, '1': 0.1 } } },
      ]);
      const result = await service.getDiseasesByAnimals({} as any);
      expect(result.totalSessionsAnalyzed).toBe(1);
    });
  });

  describe('getDiseasesChart', () => {
    it('should return disease stats sorted by count descending', async () => {
      mockPrismaService.medicalSession.findMany.mockResolvedValue([
        { prediction: { rawOutput: { '0': 0.9, '1': 0.05 } } },
        { prediction: { rawOutput: { '0': 0.1, '1': 0.9 } } },
        { prediction: { rawOutput: { '0': 0.1, '1': 0.9 } } },
      ]);

      const result = await service.getDiseasesChart({} as any);

      expect(result.data[0].count).toBeGreaterThanOrEqual(result.data[1].count);
    });
  });

  describe('getOverview', () => {
    it('should return overview statistics', async () => {
      mockPrismaService.medicalSession.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(5) // submitted
        .mockResolvedValueOnce(3) // draft
        .mockResolvedValueOnce(2); // ready

      mockPrismaService.medicalSession.findMany
        .mockResolvedValueOnce([{ animalId: 'a1' }, { animalId: 'a2' }]) // distinct animals
        .mockResolvedValueOnce([
          // submitted sessions with predictions
          { prediction: { rawOutput: { '0': 0.9, '1': 0.1 } } },
          { prediction: { rawOutput: { '0': 0.8, '1': 0.2 } } },
        ]);

      const result = await service.getOverview({} as any);

      expect(result.totalSessions).toBe(10);
      expect(result.submittedSessions).toBe(5);
      expect(result.draftSessions).toBe(3);
      expect(result.readySessions).toBe(2);
      expect(result.totalAnimalsExamined).toBe(2);
      expect(result.mostCommonDisease).not.toBeNull();
    });

    it('should handle no submitted sessions', async () => {
      mockPrismaService.medicalSession.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      mockPrismaService.medicalSession.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await service.getOverview({} as any);

      expect(result.totalSessions).toBe(0);
      expect(result.totalAnimalsExamined).toBe(0);
      expect(result.mostCommonDisease).toBeNull();
    });
  });

  describe('getMonthlyTrends', () => {
    it('should group sessions by month', async () => {
      mockPrismaService.medicalSession.findMany.mockResolvedValue([
        {
          date: new Date('2024-01-15'),
          prediction: { rawOutput: { '0': 0.9, '1': 0.1 } },
        },
        {
          date: new Date('2024-01-20'),
          prediction: { rawOutput: { '0': 0.8, '1': 0.2 } },
        },
        {
          date: new Date('2024-02-10'),
          prediction: { rawOutput: { '0': 0.1, '1': 0.9 } },
        },
      ]);

      const result = await service.getMonthlyTrends({} as any);

      expect(result.data).toHaveLength(2);
      const jan = result.data.find((d) => d.period === '2024-01');
      expect(jan?.total).toBe(2);
      const feb = result.data.find((d) => d.period === '2024-02');
      expect(feb?.total).toBe(1);
    });

    it('should skip sessions without predictions', async () => {
      mockPrismaService.medicalSession.findMany.mockResolvedValue([
        { date: new Date('2024-01-15'), prediction: null },
      ]);

      const result = await service.getMonthlyTrends({} as any);
      expect(result.data).toHaveLength(0);
    });

    it('should return empty data when no sessions', async () => {
      mockPrismaService.medicalSession.findMany.mockResolvedValue([]);
      const result = await service.getMonthlyTrends({} as any);
      expect(result.data).toHaveLength(0);
    });
  });
});

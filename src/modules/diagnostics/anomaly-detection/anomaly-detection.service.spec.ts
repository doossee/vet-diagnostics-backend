import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { AnomalyDetectionService } from './anomaly-detection.service';
import { ReferenceRangeService } from './reference-range.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AnomalyDetectionService', () => {
  let service: AnomalyDetectionService;

  const mockPrismaService = {
    anomalyAlert: {
      createMany: jest.fn(),
      update: jest.fn(),
      groupBy: jest.fn(),
    },
    medicalSession: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
    animal: {
      findUnique: jest.fn(),
    },
    referenceRange: {
      findUnique: jest.fn(),
    },
  };

  const mockPaginationService = {
    paginate: jest.fn(),
  };

  const mockReferenceRangeService = {
    checkAnomalies: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('http://localhost:3005/predict'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnomalyDetectionService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
        { provide: ReferenceRangeService, useValue: mockReferenceRangeService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AnomalyDetectionService>(AnomalyDetectionService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('predict', () => {
    const basePredictDto = {
      animalTypeId: 'type-uuid',
      pulse: 75,
      temperature: 38.5,
      hemoglobin: 120,
    };

    it('should call ML service and return predictions with no anomalies', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { disease: 'Стоматит', confidence: 0.85 },
      });
      mockReferenceRangeService.checkAnomalies.mockResolvedValue([]);

      const result = await service.predict(basePredictDto);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3005/predict',
        expect.objectContaining({
          params: expect.any(Array),
          animalTypeId: 'type-uuid',
        }),
      );
      expect(result.predictions).toEqual({
        disease: 'Стоматит',
        confidence: 0.85,
      });
      expect(result.anomalies).toEqual([]);
      expect(result.overallSeverity).toBe('OK');
    });

    it('should detect anomalies and return overall severity', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { disease: 'Нефрит', confidence: 0.72 },
      });
      mockReferenceRangeService.checkAnomalies.mockResolvedValue([
        {
          parameter: 'pulse',
          value: 110,
          minNorm: 60,
          maxNorm: 80,
          severity: 'CRITICAL',
        },
        {
          parameter: 'temperature',
          value: 40,
          minNorm: 37.5,
          maxNorm: 39.5,
          severity: 'LOW',
        },
      ]);

      const result = await service.predict(basePredictDto);

      expect(result.anomalies).toHaveLength(2);
      expect(result.overallSeverity).toBe('CRITICAL');
    });

    it('should persist alerts when animalId and sessionId are provided', async () => {
      mockedAxios.post.mockResolvedValue({ data: {} });
      mockReferenceRangeService.checkAnomalies.mockResolvedValue([
        {
          parameter: 'pulse',
          value: 95,
          minNorm: 60,
          maxNorm: 80,
          severity: 'HIGH',
        },
      ]);

      await service.predict({
        ...basePredictDto,
        animalId: 'animal-uuid',
        sessionId: 'session-uuid',
      });

      expect(mockPrismaService.anomalyAlert.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            animalId: 'animal-uuid',
            sessionId: 'session-uuid',
            parameter: 'pulse',
            severity: 'HIGH',
          }),
        ],
      });
    });

    it('should not persist alerts without animalId/sessionId', async () => {
      mockedAxios.post.mockResolvedValue({ data: {} });
      mockReferenceRangeService.checkAnomalies.mockResolvedValue([
        {
          parameter: 'pulse',
          value: 95,
          minNorm: 60,
          maxNorm: 80,
          severity: 'HIGH',
        },
      ]);

      await service.predict(basePredictDto);

      expect(mockPrismaService.anomalyAlert.createMany).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when ML service fails', async () => {
      mockedAxios.post.mockRejectedValue({
        isAxiosError: true,
        response: { status: 500 },
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(service.predict(basePredictDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getAnimalTrend', () => {
    it('should return trend data with increasing direction', async () => {
      mockPrismaService.medicalSession.findMany.mockResolvedValue([
        { date: new Date('2026-01-01'), bloodExam: { hemoglobin: 100 } },
        { date: new Date('2026-02-01'), bloodExam: { hemoglobin: 110 } },
        { date: new Date('2026-03-01'), bloodExam: { hemoglobin: 120 } },
      ]);
      mockPrismaService.animal.findUnique.mockResolvedValue({
        animalTypeId: 'type-uuid',
      });
      mockPrismaService.referenceRange.findUnique.mockResolvedValue({
        unit: 'g/l',
      });

      const result = await service.getAnimalTrend({
        animalId: 'animal-uuid',
        parameter: 'hemoglobin',
      });

      expect(result.dataPoints).toHaveLength(3);
      expect(result.trend).toBe('increasing');
      expect(result.changePercent).toBe(20);
      expect(result.unit).toBe('g/l');
    });

    it('should return stable trend when change is small', async () => {
      mockPrismaService.medicalSession.findMany.mockResolvedValue([
        { date: new Date('2026-01-01'), bloodExam: { hemoglobin: 100 } },
        { date: new Date('2026-02-01'), bloodExam: { hemoglobin: 101 } },
      ]);
      mockPrismaService.animal.findUnique.mockResolvedValue({
        animalTypeId: 'type-uuid',
      });
      mockPrismaService.referenceRange.findUnique.mockResolvedValue(null);

      const result = await service.getAnimalTrend({
        animalId: 'animal-uuid',
        parameter: 'hemoglobin',
      });

      expect(result.trend).toBe('stable');
    });

    it('should throw for unknown parameter', async () => {
      await expect(
        service.getAnimalTrend({
          animalId: 'animal-uuid',
          parameter: 'invalidParam',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateAlert', () => {
    it('should update alert status', async () => {
      const mockAlert = { id: 'uuid', status: 'ACKNOWLEDGED' };
      mockPrismaService.anomalyAlert.update.mockResolvedValue(mockAlert);

      const result = await service.updateAlert('uuid', {
        status: 'ACKNOWLEDGED' as any,
      });
      expect(result.status).toBe('ACKNOWLEDGED');
    });
  });

  describe('getAnimalHealthSummary', () => {
    it('should return HEALTHY when no active alerts', async () => {
      mockPrismaService.anomalyAlert.groupBy.mockResolvedValue([]);
      mockPrismaService.medicalSession.findFirst.mockResolvedValue({
        date: new Date('2026-03-01'),
      });
      mockPrismaService.medicalSession.count.mockResolvedValue(5);

      const result = await service.getAnimalHealthSummary('animal-uuid');

      expect(result.healthStatus).toBe('HEALTHY');
      expect(result.activeAlerts).toBe(0);
      expect(result.totalSessions).toBe(5);
    });

    it('should return CRITICAL when critical alerts exist', async () => {
      mockPrismaService.anomalyAlert.groupBy.mockResolvedValue([
        { severity: 'LOW', _count: 2 },
        { severity: 'CRITICAL', _count: 1 },
      ]);
      mockPrismaService.medicalSession.findFirst.mockResolvedValue(null);
      mockPrismaService.medicalSession.count.mockResolvedValue(0);

      const result = await service.getAnimalHealthSummary('animal-uuid');

      expect(result.healthStatus).toBe('CRITICAL');
      expect(result.activeAlerts).toBe(3);
      expect(result.alertsBySeverity.CRITICAL).toBe(1);
      expect(result.alertsBySeverity.LOW).toBe(2);
    });

    it('should return WARNING when medium/high alerts exist', async () => {
      mockPrismaService.anomalyAlert.groupBy.mockResolvedValue([
        { severity: 'MEDIUM', _count: 3 },
      ]);
      mockPrismaService.medicalSession.findFirst.mockResolvedValue(null);
      mockPrismaService.medicalSession.count.mockResolvedValue(0);

      const result = await service.getAnimalHealthSummary('animal-uuid');

      expect(result.healthStatus).toBe('WARNING');
    });

    it('should return ATTENTION when only low alerts exist', async () => {
      mockPrismaService.anomalyAlert.groupBy.mockResolvedValue([
        { severity: 'LOW', _count: 1 },
      ]);
      mockPrismaService.medicalSession.findFirst.mockResolvedValue(null);
      mockPrismaService.medicalSession.count.mockResolvedValue(0);

      const result = await service.getAnimalHealthSummary('animal-uuid');

      expect(result.healthStatus).toBe('ATTENTION');
    });
  });
});

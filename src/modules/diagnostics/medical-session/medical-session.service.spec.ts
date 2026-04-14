import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { MedicalSessionService } from './medical-session.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MedicalSessionService', () => {
  let service: MedicalSessionService;

  const mockPrismaService = {
    medicalSession: {
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    prediction: {
      findUniqueOrThrow: jest.fn(),
    },
  };

  const mockPaginationService = { paginate: jest.fn() };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'PREDICT_API_URI') return 'http://ml-service/predict';
      if (key === 'PREDICT_MODEL_VERSION') return 'v1.0';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalSessionService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    service = module.get<MedicalSessionService>(MedicalSessionService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a medical session', async () => {
      const dto = { animalId: 'animal-1', veterinarianId: 'vet-1' };
      const mock = { id: 'session-1', ...dto };
      mockPrismaService.medicalSession.create.mockResolvedValue(mock);
      expect(await service.create(dto as any)).toEqual(mock);
    });

    it('should handle date conversion', async () => {
      const dto = { animalId: 'animal-1', date: '2024-01-15' };
      const mock = { id: 'session-1', ...dto };
      mockPrismaService.medicalSession.create.mockResolvedValue(mock);
      await service.create(dto as any);
      expect(mockPrismaService.medicalSession.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ date: expect.any(Date) }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const mockResult = {
        data: [],
        meta: {
          total: 0,
          currentPage: 1,
          perPage: 10,
          lastPage: 0,
          prev: null,
          next: null,
        },
      };
      mockPaginationService.paginate.mockResolvedValue(mockResult);
      expect(await service.findAll({ page: 1, perPage: 10 } as any)).toEqual(
        mockResult,
      );
    });
  });

  describe('findOne', () => {
    it('should return a session by id', async () => {
      const mock = { id: 'session-1', animalId: 'animal-1' };
      mockPrismaService.medicalSession.findUniqueOrThrow.mockResolvedValue(
        mock,
      );
      expect(await service.findOne('session-1')).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update a session', async () => {
      const dto = { status: 'DRAFT' };
      const mock = { id: 'session-1', ...dto };
      mockPrismaService.medicalSession.update.mockResolvedValue(mock);
      expect(await service.update('session-1', dto as any)).toEqual(mock);
    });
  });

  describe('delete', () => {
    it('should delete a session', async () => {
      const mock = { id: 'session-1' };
      mockPrismaService.medicalSession.delete.mockResolvedValue(mock);
      expect(await service.delete('session-1')).toEqual(mock);
    });
  });

  describe('submit', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const buildFullSession = (overrides?: any) => ({
      id: 'session-1',
      status: 'DRAFT',
      prediction: null,
      animal: { animalType: { modelKey: 'cattle' } },
      clinicalExam: {
        pulse: 70,
        respiratoryRate: 20,
        temperature: 38.5,
        rumination: 3,
        bodyType: { numericValue: 1 },
        obesity: { numericValue: 1 },
        bodyPosition: { numericValue: 1 },
        constitution: { numericValue: 1 },
        temperament: { numericValue: 1 },
        wool: { numericValue: 1 },
        down: null,
        hair: null,
        feathers: null,
        skinColor: { numericValue: 1 },
        skinHumidity: { numericValue: 1 },
        skinSmell: { numericValue: 1 },
        skinTemp: { numericValue: 1 },
        skinSurface: { numericValue: 1 },
        skinElasticity: { numericValue: 1 },
        skinSensitivity: { numericValue: 1 },
        skinPain: { numericValue: 1 },
        lymphSize: { numericValue: 1 },
        lymphShape: { numericValue: 1 },
        lymphSurface: { numericValue: 1 },
        lymphConsistency: { numericValue: 1 },
        lymphTemp: { numericValue: 1 },
        lymphPain: { numericValue: 1 },
        lymphMobility: { numericValue: 1 },
        rumenFluidState: null,
      },
      bloodExam: {
        erythrocyteCount: 5,
        leukocyteCount: 8,
        thrombocyteCount: 300,
        coe: 1.5,
        waterPercentage: 80,
        dryResidue: 20,
        glutathione: 30,
        hemoglobin: 12,
        totalProtein: 7,
        albumin: 3.5,
        alphaGlobulin: 0.5,
        betaGlobulin: 0.8,
        gammaGlobulin: 1.2,
        residualNitrogen: 25,
        urea: 5,
        uricAcid: 3,
        creatinine: 1.2,
        alkalineReserve: 50,
        glucose: 4.5,
        ketoneBodies: 0.5,
        totalBilirubin: 0.8,
        directBilirubin: 0.2,
        totalCholesterol: 5,
        totalLipids: 4,
        phospholipids: 2,
        lacticAcid: 1,
        pyruvicAcid: 0.5,
        citricAcid: 0.3,
        carotene: 0.4,
        vitaminA: 0.3,
        vitaminC: 0.5,
        organicPhosphorus: 5,
        totalCalcium: 10,
        creatine: 1,
        copper: 0.8,
        zinc: 1.2,
        manganese: 0.3,
        cobalt: 0.1,
      },
      urineExam: {
        urineColor: { numericValue: 1 },
        urineSmell: { numericValue: 1 },
        urineClarity: { numericValue: 1 },
        urineConsistency: { numericValue: 1 },
        ph: 7,
        acetone: 0,
        protein: 0,
        bilirubin: 0,
        urobilinogen: 0,
        sugar: 0,
        leukocytes: 0,
        epithelium: 0,
        microbialBodies: 0,
        erythrocytes: 0,
        saltCrystals: 0,
        amount: 1000,
      },
      fecesExam: {
        fecesColor: { numericValue: 1 },
        fecesSmell: { numericValue: 1 },
        fecesConsistency: { numericValue: 1 },
        fecesForm: { numericValue: 1 },
        amount: 500,
        undigestedFood: 0,
      },
      mucosaExams: [
        {
          mucosaType: { numericValue: 0 },
          mucosaAppearance: { numericValue: 1 },
        },
        {
          mucosaType: { numericValue: 1 },
          mucosaAppearance: { numericValue: 1 },
        },
        {
          mucosaType: { numericValue: 2 },
          mucosaAppearance: { numericValue: 1 },
        },
        {
          mucosaType: { numericValue: 3 },
          mucosaAppearance: { numericValue: 1 },
        },
      ],
      anomalyAlerts: [],
      ...overrides,
    });

    it('should throw if session is already submitted with prediction', async () => {
      mockPrismaService.medicalSession.findUniqueOrThrow.mockResolvedValue(
        buildFullSession({ status: 'SUBMITTED', prediction: { id: 'pred-1' } }),
      );
      await expect(service.submit('session-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if clinical exam is missing', async () => {
      mockPrismaService.medicalSession.findUniqueOrThrow.mockResolvedValue(
        buildFullSession({ clinicalExam: null }),
      );
      await expect(service.submit('session-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if blood exam is missing', async () => {
      mockPrismaService.medicalSession.findUniqueOrThrow.mockResolvedValue(
        buildFullSession({ bloodExam: null }),
      );
      await expect(service.submit('session-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should call AI prediction service and update session on success', async () => {
      const session = buildFullSession();
      mockPrismaService.medicalSession.findUniqueOrThrow.mockResolvedValue(
        session,
      );
      mockedAxios.post.mockResolvedValue({
        data: { '0': 0.9, '1': 0.05, '2': 0.05 },
      });
      const updatedSession = {
        ...session,
        status: 'SUBMITTED',
        prediction: { id: 'pred-1' },
      };
      mockPrismaService.medicalSession.update.mockResolvedValue(updatedSession);

      const result = await service.submit('session-1');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://ml-service/predict',
        { params: expect.any(Array) },
        { params: { animal: 'cattle' } },
      );
      expect(mockPrismaService.medicalSession.update).toHaveBeenCalled();
      expect(result.status).toBe('SUBMITTED');
    });

    it('should throw if AI service returns error response', async () => {
      const session = buildFullSession();
      mockPrismaService.medicalSession.findUniqueOrThrow.mockResolvedValue(
        session,
      );
      const axiosError = new Error('Request failed') as any;
      axiosError.response = { status: 500 };
      axiosError.isAxiosError = true;
      mockedAxios.post.mockRejectedValue(axiosError);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(service.submit('session-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if AI service is unavailable', async () => {
      const session = buildFullSession();
      mockPrismaService.medicalSession.findUniqueOrThrow.mockResolvedValue(
        session,
      );
      const axiosError = new Error('Network error') as any;
      axiosError.isAxiosError = true;
      mockedAxios.post.mockRejectedValue(axiosError);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(service.submit('session-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getPrediction', () => {
    it('should return prediction by session id', async () => {
      const mock = { id: 'pred-1', sessionId: 'session-1' };
      mockPrismaService.prediction.findUniqueOrThrow.mockResolvedValue(mock);
      expect(await service.getPrediction('session-1')).toEqual(mock);
    });
  });
});

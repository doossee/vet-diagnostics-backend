import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

describe('FeedbackService', () => {
  let service: FeedbackService;

  const mockPrismaService = {
    feedback: {
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
        FeedbackService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).compile();
    service = module.get<FeedbackService>(FeedbackService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create feedback with all fields', async () => {
      const dto = {
        predictionId: 'pred-1',
        veterinarianId: 'vet-1',
        adminId: null,
        rating: 5,
        comment: 'Good prediction',
        suggestedDiseaseId: 'disease-1',
      };
      const mock = { id: 'fb-1', ...dto };
      mockPrismaService.feedback.create.mockResolvedValue(mock);
      expect(await service.create(dto as any)).toEqual(mock);
    });

    it('should create feedback with null optional fields', async () => {
      const dto = {
        predictionId: 'pred-1',
        rating: 3,
        comment: 'Average',
        suggestedDiseaseId: 'disease-2',
      };
      const mock = { id: 'fb-2', ...dto, veterinarianId: null, adminId: null };
      mockPrismaService.feedback.create.mockResolvedValue(mock);
      const result = await service.create(dto as any);
      expect(result).toEqual(mock);
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

    it('should filter by predictionId', async () => {
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
      await service.findAll({
        page: 1,
        perPage: 10,
        predictionId: 'pred-1',
      } as any);
      expect(mockPaginationService.paginate).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return feedback by id', async () => {
      const mock = { id: 'fb-1', rating: 5 };
      mockPrismaService.feedback.findUniqueOrThrow.mockResolvedValue(mock);
      expect(await service.findOne('fb-1')).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update feedback', async () => {
      const dto = { rating: 4, comment: 'Updated' };
      const mock = { id: 'fb-1', ...dto };
      mockPrismaService.feedback.update.mockResolvedValue(mock);
      expect(await service.update('fb-1', dto as any)).toEqual(mock);
    });
  });

  describe('delete', () => {
    it('should delete feedback', async () => {
      const mock = { id: 'fb-1' };
      mockPrismaService.feedback.delete.mockResolvedValue(mock);
      expect(await service.delete('fb-1')).toEqual(mock);
    });
  });
});

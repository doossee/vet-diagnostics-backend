import { Test, TestingModule } from '@nestjs/testing';
import { ProphylaxisService } from './prophylaxis.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

describe('ProphylaxisService', () => {
  let service: ProphylaxisService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    prophylaxis: {
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
        ProphylaxisService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).compile();

    service = module.get<ProphylaxisService>(ProphylaxisService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a record', async () => {
      const dto = { name: 'Test' };
      const mockRecord = { id: 'uuid', ...dto };

      mockPrismaService.prophylaxis.create.mockResolvedValue(mockRecord);

      const result = await service.create(dto as any);

      expect(result).toEqual(mockRecord);
    });
  });

  describe('findOne', () => {
    it('should return a record', async () => {
      const mockRecord = { id: 'uuid', name: 'Test' };
      mockPrismaService.prophylaxis.findUniqueOrThrow.mockResolvedValue(
        mockRecord,
      );

      const result = await service.findOne('uuid');

      expect(result).toEqual(mockRecord);
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const dto = { name: 'Updated' };
      const mockRecord = { id: 'uuid', ...dto };

      mockPrismaService.prophylaxis.update.mockResolvedValue(mockRecord);

      const result = await service.update('uuid', dto as any);

      expect(result).toEqual(mockRecord);
    });
  });

  describe('delete', () => {
    it('should delete a record', async () => {
      const mockRecord = { id: 'uuid' };
      mockPrismaService.prophylaxis.delete.mockResolvedValue(mockRecord);

      const result = await service.delete('uuid');

      expect(result).toEqual(mockRecord);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { VetStationService } from './vet-station.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

describe('VetStationService', () => {
  let service: VetStationService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    vetStation: {
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
        VetStationService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).compile();

    service = module.get<VetStationService>(VetStationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a vet station', async () => {
      const dto = {
        name: { ru: 'Станция №1', uz: 'Station #1' },
        address: 'Address',
        districtId: 'district-id',
      };
      const mockStation = {
        id: 'uuid',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.vetStation.create.mockResolvedValue(mockStation);

      const result = await service.create(dto as any);

      expect(result).toEqual(mockStation);
    });
  });

  describe('findOne', () => {
    it('should return a vet station', async () => {
      const mockStation = { id: 'uuid', name: { ru: 'Станция №1', uz: 'Station #1' } };
      mockPrismaService.vetStation.findUniqueOrThrow.mockResolvedValue(
        mockStation,
      );

      const result = await service.findOne('uuid');

      expect(result).toEqual(mockStation);
    });
  });

  describe('update', () => {
    it('should update a vet station', async () => {
      const dto = { name: { ru: 'Updated', uz: 'Updated' } };
      const mockStation = { id: 'uuid', ...dto };

      mockPrismaService.vetStation.update.mockResolvedValue(mockStation);

      const result = await service.update('uuid', dto as any);

      expect(result).toEqual(mockStation);
    });
  });

  describe('delete', () => {
    it('should delete a vet station', async () => {
      const mockStation = { id: 'uuid' };
      mockPrismaService.vetStation.delete.mockResolvedValue(mockStation);

      const result = await service.delete('uuid');

      expect(result).toEqual(mockStation);
    });
  });
});

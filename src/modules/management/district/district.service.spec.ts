import { Test, TestingModule } from '@nestjs/testing';
import { DistrictService } from './district.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

describe('DistrictService', () => {
  let service: DistrictService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    district: {
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
        DistrictService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).compile();

    service = module.get<DistrictService>(DistrictService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a district', async () => {
      const dto = { nameRu: 'Юнусабад', nameUz: 'Yunusabad', regionId: 1 };
      const mockDistrict = { id: 'uuid', ...dto };

      mockPrismaService.district.create.mockResolvedValue(mockDistrict);

      const result = await service.create(dto);

      expect(result).toEqual(mockDistrict);
      expect(prismaService.district.create).toHaveBeenCalledWith({
        data: dto,
        include: { region: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a district', async () => {
      const mockDistrict = {
        id: 'uuid',
        nameRu: 'Юнусабад',
        nameUz: 'Yunusabad',
      };
      mockPrismaService.district.findUniqueOrThrow.mockResolvedValue(
        mockDistrict,
      );

      const result = await service.findOne('uuid');

      expect(result).toEqual(mockDistrict);
    });
  });

  describe('update', () => {
    it('should update a district', async () => {
      const dto = { nameRu: 'Updated' };
      const mockDistrict = { id: 'uuid', ...dto };

      mockPrismaService.district.update.mockResolvedValue(mockDistrict);

      const result = await service.update('uuid', dto);

      expect(result).toEqual(mockDistrict);
    });
  });

  describe('delete', () => {
    it('should delete a district', async () => {
      const mockDistrict = { id: 'uuid' };
      mockPrismaService.district.delete.mockResolvedValue(mockDistrict);

      const result = await service.delete('uuid');

      expect(result).toEqual(mockDistrict);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { RegionService } from './region.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

describe('RegionService', () => {
  let service: RegionService;
  let prismaService: PrismaService;
  let paginationService: PaginationService;

  const mockPrismaService = {
    region: {
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
        RegionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<RegionService>(RegionService);
    prismaService = module.get<PrismaService>(PrismaService);
    paginationService = module.get<PaginationService>(PaginationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new region', async () => {
      const createRegionDto = {
        nameRu: 'Ташкент',
        nameUz: 'Toshkent',
      };

      const mockRegion = {
        id: 1,
        ...createRegionDto,
      };

      mockPrismaService.region.create.mockResolvedValue(mockRegion);

      const result = await service.create(createRegionDto);

      expect(prismaService.region.create).toHaveBeenCalledWith({
        data: createRegionDto,
      });
      expect(result).toEqual(mockRegion);
    });
  });

  describe('findAll', () => {
    it('should return paginated regions', async () => {
      const queryParams = {
        page: 1,
        perPage: 10,
        search: 'Ташкент',
      };

      const mockRegions = [
        { id: 1, nameRu: 'Ташкент', nameUz: 'Toshkent' },
        { id: 2, nameRu: 'Самарканд', nameUz: 'Samarqand' },
      ];

      const mockPaginatedResult = {
        data: mockRegions,
        meta: {
          page: 1,
          perPage: 10,
          total: 2,
          totalPages: 1,
        },
      };

      mockPaginationService.paginate.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(queryParams as any);

      expect(paginationService.paginate).toHaveBeenCalledWith(
        prismaService.region,
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
          }),
        }),
        { page: 1, perPage: 10 },
      );
      expect(result.data).toHaveLength(2);
    });

    it('should return all regions without search filter', async () => {
      const queryParams = {
        page: 1,
        perPage: 10,
      };

      const mockRegions = [{ id: 1, nameRu: 'Ташкент', nameUz: 'Toshkent' }];

      const mockPaginatedResult = {
        data: mockRegions,
        meta: {
          page: 1,
          perPage: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockPaginationService.paginate.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(queryParams as any);

      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a region by id', async () => {
      const mockRegion = {
        id: 1,
        nameRu: 'Ташкент',
        nameUz: 'Toshkent',
      };

      mockPrismaService.region.findUniqueOrThrow.mockResolvedValue(mockRegion);

      const result = await service.findOne(1);

      expect(prismaService.region.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { districts: true },
      });
      expect(result).toEqual(mockRegion);
    });
  });

  describe('update', () => {
    it('should update a region', async () => {
      const updateData = {
        nameRu: 'Ташкент область',
        nameUz: 'Toshkent viloyati',
      };

      const mockUpdatedRegion = {
        id: 1,
        ...updateData,
      };

      mockPrismaService.region.update.mockResolvedValue(mockUpdatedRegion);

      const result = await service.update(1, updateData);

      expect(prismaService.region.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedRegion);
    });
  });

  describe('delete', () => {
    it('should delete a region', async () => {
      const mockRegion = {
        id: 1,
        nameRu: 'Ташкент',
        nameUz: 'Toshkent',
      };

      mockPrismaService.region.delete.mockResolvedValue(mockRegion);

      const result = await service.delete(1);

      expect(prismaService.region.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockRegion);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ProphylaxisItemController } from './prophylaxis-item.controller';
import { ProphylaxisItemService } from './prophylaxis-item.service';
import { ExcelService } from 'src/shared/services';

describe('ProphylaxisItemController', () => {
  let controller: ProphylaxisItemController;
  let service: ProphylaxisItemService;

  const mockExcelService = {
    generateTemplate: jest.fn(),
    parseFile: jest.fn(),
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProphylaxisItemController],
      providers: [
        {
          provide: ProphylaxisItemService,
          useValue: mockService,
        },
        {
          provide: ExcelService,
          useValue: mockExcelService,
        },
      ],
    }).compile();

    controller = module.get<ProphylaxisItemController>(
      ProphylaxisItemController,
    );
    service = module.get<ProphylaxisItemService>(ProphylaxisItemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a record', async () => {
      const dto = { name: 'Test' };
      const result = { id: 'uuid', ...dto };

      mockService.create.mockResolvedValue(result);

      expect(await controller.create(dto as any)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all records', async () => {
      const result = {
        data: [{ id: 'uuid', name: 'Test' }],
        meta: { page: 1, perPage: 10, total: 1, totalPages: 1 },
      };

      mockService.findAll.mockResolvedValue(result);

      expect(await controller.findAll({} as any)).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single record', async () => {
      const result = { id: 'uuid', name: 'Test' };

      mockService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('uuid')).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith('uuid');
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const dto = { name: 'Updated' };
      const result = { id: 'uuid', ...dto };

      mockService.update.mockResolvedValue(result);

      expect(await controller.update('uuid', dto as any)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('delete', () => {
    it('should delete a record', async () => {
      const result = { id: 'uuid' };

      mockService.delete.mockResolvedValue(result);

      expect(await controller.delete('uuid')).toEqual(result);
      expect(service.delete).toHaveBeenCalledWith('uuid');
    });
  });
});

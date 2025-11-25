import { Test, TestingModule } from '@nestjs/testing';
import { ProphylaxisController } from './prophylaxis.controller';
import { ProphylaxisService } from './prophylaxis.service';

describe('ProphylaxisController', () => {
  let controller: ProphylaxisController;
  let service: ProphylaxisService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProphylaxisController],
      providers: [
        {
          provide: ProphylaxisService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProphylaxisController>(ProphylaxisController);
    service = module.get<ProphylaxisService>(ProphylaxisService);
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

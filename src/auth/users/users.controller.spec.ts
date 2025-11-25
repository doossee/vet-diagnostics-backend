import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = {
        username: 'test',
        password: 'password',
        districtId: 'district-id',
      };
      const result = { id: 'uuid', ...dto };

      mockService.create.mockResolvedValue(result);

      expect(await controller.create(dto as any)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = {
        data: [{ id: 'uuid', username: 'test' }],
        meta: { page: 1, perPage: 10, total: 1, totalPages: 1 },
      };

      mockService.findAll.mockResolvedValue(result);

      expect(await controller.findAll({} as any)).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = { id: 'uuid', username: 'test' };

      mockService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('uuid')).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith('uuid');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto = { username: 'updated' };
      const result = { id: 'uuid', ...dto };

      mockService.update.mockResolvedValue(result);

      expect(await controller.update('uuid', dto as any)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = { id: 'uuid' };

      mockService.remove.mockResolvedValue(result);

      expect(await controller.remove('uuid')).toEqual(result);
      expect(service.remove).toHaveBeenCalledWith('uuid');
    });
  });

  describe('changePassword', () => {
    it('should change user password', async () => {
      const dto = { oldPassword: 'old', newPassword: 'new' };
      const result = { id: 'uuid', username: 'test' };

      mockService.changePassword.mockResolvedValue(result);

      expect(await controller.changePassword('uuid', dto)).toEqual(result);
      expect(service.changePassword).toHaveBeenCalledWith('uuid', dto);
    });
  });
});

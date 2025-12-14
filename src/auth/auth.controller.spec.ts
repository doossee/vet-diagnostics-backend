import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRole } from 'src/shared/enums';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockService = {
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login and return tokens', async () => {
      const loginDto = { username: 'test', password: 'password' };
      const result = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        userId: 'user-id',
        role: UserRole.VETERINARIAN,
      };

      mockService.login.mockResolvedValue(result);

      expect(await controller.login(loginDto)).toEqual(result);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens', async () => {
      const result = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        userId: 'user-id',
        role: UserRole.VETERINARIAN,
      };

      mockService.refresh.mockResolvedValue(result);

      // Pass authorization header as string
      expect(await controller.refresh('Bearer refresh-token')).toEqual(result);
      expect(service.refresh).toHaveBeenCalledWith('refresh-token');
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      mockService.logout.mockResolvedValue(undefined);

      // Pass authorization header as string
      await controller.logout('Bearer refresh-token');

      expect(service.logout).toHaveBeenCalledWith('refresh-token');
    });
  });
});

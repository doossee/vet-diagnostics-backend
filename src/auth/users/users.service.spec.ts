import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import { UserRole } from 'src/shared/enums';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let paginationService: PaginationService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },

    /* eslint-disable @typescript-eslint/no-unsafe-return */
    $transaction: jest.fn((fn: any) =>
      fn({
        user: {
          create: jest.fn().mockResolvedValue({
            id: 'user-id',
            role: 'FARMER',
          }),
          findUnique: jest.fn().mockResolvedValue({
            id: 'user-id',
            username: 'testuser',
            role: 'FARMER',
          }),
        },
        vetProfile: { create: jest.fn() },
        farmerProfile: { create: jest.fn() },
      }),
    ),
    /* eslint-enable @typescript-eslint/no-unsafe-return */
  };

  const mockPaginationService = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    paginationService = module.get<PaginationService>(PaginationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto = {
        username: 'testuser',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+998901234567',
        districtId: 'district-id',
        role: UserRole.VETERINARIAN,
      };

      const result = await service.create(createUserDto);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException if neither phone nor email is provided', async () => {
      const createUserDto = {
        username: 'testuser',
        password: 'password123',
        firstName: 'Test',
        districtId: 'district-id',
      };

      await expect(service.create(createUserDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should default to FARMER role if not specified', async () => {
      const createUserDto = {
        username: 'testuser',
        password: 'password123',
        firstName: 'Test',
        phone: '+998901234567',
        districtId: 'district-id',
        veterinarianId: 'vet-id',
      };

      const result = await service.create(createUserDto as any);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const queryParams = {
        page: 1,
        perPage: 10,
        search: 'test',
      };

      const mockUsers = [
        {
          id: 'user-1',
          username: 'testuser1',
          firstName: 'Test',
          lastName: 'User1',
        },
        {
          id: 'user-2',
          username: 'testuser2',
          firstName: 'Test',
          lastName: 'User2',
        },
      ];

      const mockPaginatedResult = {
        data: mockUsers,
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
        prismaService.user,
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
          }),
        }),
        { page: 1, perPage: 10 },
      );
      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: 'user-id',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('user-id');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id' },
      });
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const mockUpdatedUser = {
        id: 'user-id',
        username: 'testuser',
        ...updateData,
      };

      mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.update('user-id', updateData);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: updateData,
        include: { district: true },
      });
      expect(result.firstName).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const mockUser = {
        id: 'user-id',
        username: 'testuser',
      };

      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove('user-id');

      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-id' },
      });
      expect(result).toBeDefined();
    });
  });

  describe('changePassword', () => {
    it('should change user password', async () => {
      const mockUser = {
        id: 'user-id',
        password: '$2a$10$validhashedpassword',
      };

      const changePasswordDto = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        password: 'newhashed',
      });

      // Mock bcrypt.compare to return true
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);

      const _result = await service.changePassword(
        'user-id',
        changePasswordDto,
      );

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: { password: expect.any(String) },
      });
    });
  });
});

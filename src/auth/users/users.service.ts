import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {
  CreateUserDto,
  UserQueryParamsDto,
  UpdateUserDto,
  ChangePasswordDto,
} from './dto';
import { UserEntity, PaginatedUsersEntity } from './entity';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateUserDto): Promise<UserEntity> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Validate role - only ADMIN, VETERINARIAN, and FARMER can be created via API
      // SUPER_ADMIN should only be created manually or by another SUPER_ADMIN
      if (
        data.role &&
        !['ADMIN', 'VETERINARIAN', 'FARMER'].includes(data.role)
      ) {
        throw new BadRequestException(
          'Invalid role. Only ADMIN, VETERINARIAN, or FARMER can be created.',
        );
      }

      if (!data.phone && !data.email) {
        throw new BadRequestException('You must provide a phone or email');
      }

      const user = await this.prisma.user.create({
        data: {
          username: data.username,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          role: data.role || 'FARMER', // Default to FARMER if not specified
          districtId: data.districtId,
        },
      });

      return new UserEntity(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('A user with this data already exists');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid district ID');
        }
      }
      throw error;
    }
  }

  async findAll(params: UserQueryParamsDto): Promise<PaginatedUsersEntity> {
    const {
      search,
      page,
      perPage,
      role,
      createdDate,
      byId,
      byRole,
      byCreatedDate,
    } = params;

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(role && { role: role }),
      ...(createdDate && {
        createdAt: {
          gte: new Date(createdDate.setHours(0, 0, 0, 0)),
          lt: new Date(createdDate.setHours(23, 59, 59, 999)),
        },
      }),
    };

    const orderBy: Prisma.UserOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(byRole && { role: byRole }),
      ...(byCreatedDate && { createdAt: byCreatedDate }),
    };

    const result = await this.paginationService.paginate(
      this.prisma.user,
      { where, orderBy },
      { page, perPage },
    );

    return {
      data: result.data.map((user: User) => new UserEntity(user)),
      meta: result.meta,
    };
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? new UserEntity(user) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    return user ? new UserEntity(user) : null;
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return new UserEntity(user);
  }

  async update(id: string, data: UpdateUserDto): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return new UserEntity(user);
  }

  async remove(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.delete({ where: { id } });

    return new UserEntity(user);
  }

  async changePassword(
    id: string,
    data: ChangePasswordDto,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Проверяем текущий пароль
    const isCurrentPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Хешируем новый пароль
    const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);

    // Обновляем пароль пользователя
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });

    return new UserEntity(updatedUser);
  }
}

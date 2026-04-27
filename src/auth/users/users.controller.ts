import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import {
  CreateUserDto,
  UserQueryParamsDto,
  UpdateUserDto,
  ChangePasswordDto,
} from './dto';
import { UserEntity, PaginatedUsersEntity, CurrentUserEntity } from './entity';
import { UsersService } from './users.service';
import { IsAdminUser, IsAuthenticated } from 'src/shared/decorators';
import { GetCurrentUser } from '../decorators/get-current-user.decorator';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==================== Staff User Endpoints ====================

  @ApiOperation({
    summary: 'Create staff user',
    description: 'Creates a new staff user account (ADMIN role). Admin only.',
  })
  @ApiCreatedResponse({
    type: UserEntity,
    description: 'User created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid data or username already exists',
  })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @IsAdminUser()
  @Post()
  async create(@Body() data: CreateUserDto) {
    return new UserEntity(await this.usersService.create(data));
  }

  @ApiOperation({
    summary: 'List all users',
    description:
      'Retrieve paginated list of all users with optional filters.',
  })
  @ApiOkResponse({
    type: PaginatedUsersEntity,
    description: 'Users retrieved successfully',
  })
  @IsAuthenticated()
  @Get()
  async findAll(@Query() params: UserQueryParamsDto) {
    return await this.usersService.findAll(params);
  }

  // ==================== Current User Endpoints ====================

  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Retrieve authenticated user profile information.',
  })
  @ApiOkResponse({
    type: UserEntity,
    description: 'User profile retrieved successfully',
  })
  @IsAuthenticated()
  @Get(`me`)
  async getMe(@GetCurrentUser() user: CurrentUserEntity) {
    return await this.usersService.findOne(user.userId);
  }

  @ApiOperation({
    summary: 'Update current user profile',
    description: 'Update authenticated user profile information.',
  })
  @ApiOkResponse({
    type: UserEntity,
    description: 'Profile updated successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @IsAuthenticated()
  @Patch(`me`)
  async updateMe(
    @GetCurrentUser() user: CurrentUserEntity,
    @Body() data: UpdateUserDto,
  ) {
    const { userId } = user;
    return await this.usersService.update(userId, data);
  }

  @ApiOperation({
    summary: 'Change current user password',
    description: 'Change password for authenticated user.',
  })
  @ApiOkResponse({
    type: UserEntity,
    description: 'Password changed successfully',
  })
  @ApiBadRequestResponse({
    description:
      'Invalid old password or new password does not meet requirements',
  })
  @IsAuthenticated()
  @Patch(`me/change-password`)
  async changeMyPassword(
    @GetCurrentUser() user: CurrentUserEntity,
    @Body() data: ChangePasswordDto,
  ) {
    const { userId } = user;
    return await this.usersService.changePassword(userId, data);
  }

  // ==================== Admin User Management ====================

  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve user details by ID. Admin only.',
  })
  @ApiOkResponse({
    type: UserEntity,
    description: 'User retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @IsAdminUser()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update user',
    description: 'Update user information by ID. Admin only.',
  })
  @ApiOkResponse({ type: UserEntity, description: 'User updated successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @IsAdminUser()
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDto,
  ) {
    return await this.usersService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete user (soft delete)',
    description: 'Soft delete user by setting deletedAt timestamp. Admin only.',
  })
  @ApiOkResponse({ type: UserEntity, description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @IsAdminUser()
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.remove(id);
  }

  @ApiOperation({
    summary: 'Change user password',
    description: 'Change password for any user by ID. Admin only.',
  })
  @ApiOkResponse({
    type: UserEntity,
    description: 'Password changed successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Invalid password data' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @IsAdminUser()
  @Patch(':id/change-password')
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: ChangePasswordDto,
  ) {
    return await this.usersService.changePassword(id, data);
  }
}

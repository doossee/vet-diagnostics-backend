import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { MucosaAppearanceService } from './mucosa-appearance.service';
import {
  CreateMucosaAppearanceDto,
  UpdateMucosaAppearanceDto,
  MucosaAppearanceQueryParamsDto,
} from './dto';
import {
  MucosaAppearanceEntity,
  PaginatedMucosaAppearanceEntity,
} from './entities';

@ApiTags('mucosa-appearances')
@Controller('mucosa-appearances')
export class MucosaAppearanceController {
  constructor(
    private readonly mucosaAppearanceService: MucosaAppearanceService,
  ) {}

  @ApiOperation({
    summary: 'Create mucosa appearance',
    description: 'Creates a new mucosa appearance.',
  })
  @ApiCreatedResponse({
    type: MucosaAppearanceEntity,
    description: 'Mucosa appearance created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateMucosaAppearanceDto) {
    return await this.mucosaAppearanceService.create(data);
  }

  @ApiOperation({
    summary: 'List mucosa appearances',
    description: 'Retrieve paginated list of mucosa appearances.',
  })
  @ApiOkResponse({
    type: PaginatedMucosaAppearanceEntity,
    description: 'Mucosa appearances retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: MucosaAppearanceQueryParamsDto) {
    return await this.mucosaAppearanceService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get mucosa appearance by ID',
    description: 'Retrieve mucosa appearance details.',
  })
  @ApiOkResponse({
    type: MucosaAppearanceEntity,
    description: 'Mucosa appearance retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Mucosa appearance not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.mucosaAppearanceService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update mucosa appearance',
    description: 'Update mucosa appearance information by ID.',
  })
  @ApiOkResponse({
    type: MucosaAppearanceEntity,
    description: 'Mucosa appearance updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Mucosa appearance not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateMucosaAppearanceDto,
  ) {
    return await this.mucosaAppearanceService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete mucosa appearance',
    description: 'Delete mucosa appearance by ID.',
  })
  @ApiOkResponse({
    type: MucosaAppearanceEntity,
    description: 'Mucosa appearance deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Mucosa appearance not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.mucosaAppearanceService.delete(id);
  }
}

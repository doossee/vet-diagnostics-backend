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
import { FecesColorService } from './feces-color.service';
import {
  CreateFecesColorDto,
  UpdateFecesColorDto,
  FecesColorQueryParamsDto,
} from './dto';
import { FecesColorEntity, PaginatedFecesColorEntity } from './entities';

@ApiTags('feces-colors')
@Controller('feces-colors')
export class FecesColorController {
  constructor(private readonly fecesColorService: FecesColorService) {}

  @ApiOperation({
    summary: 'Create feces color',
    description: 'Creates a new feces color.',
  })
  @ApiCreatedResponse({
    type: FecesColorEntity,
    description: 'Feces color created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateFecesColorDto) {
    return await this.fecesColorService.create(data);
  }

  @ApiOperation({
    summary: 'List feces colors',
    description: 'Retrieve paginated list of feces colors.',
  })
  @ApiOkResponse({
    type: PaginatedFecesColorEntity,
    description: 'Feces colors retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: FecesColorQueryParamsDto) {
    return await this.fecesColorService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get feces color by ID',
    description: 'Retrieve feces color details.',
  })
  @ApiOkResponse({
    type: FecesColorEntity,
    description: 'Feces color retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces color not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesColorService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update feces color',
    description: 'Update feces color information by ID.',
  })
  @ApiOkResponse({
    type: FecesColorEntity,
    description: 'Feces color updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces color not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateFecesColorDto,
  ) {
    return await this.fecesColorService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete feces color',
    description: 'Delete feces color by ID.',
  })
  @ApiOkResponse({
    type: FecesColorEntity,
    description: 'Feces color deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces color not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesColorService.delete(id);
  }
}

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
import { AnimalColorService } from './animal-color.service';
import {
  CreateAnimalColorDto,
  UpdateAnimalColorDto,
  AnimalColorQueryParamsDto,
} from './dto';
import {
  AnimalColorEntity,
  PaginatedAnimalColorEntity,
} from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('colors')
@Controller('colors')
export class AnimalColorController {
  constructor(private readonly colorService: AnimalColorService) {}

  @ApiOperation({
    summary: 'Create color',
    description: 'Creates a new color.',
  })
  @ApiCreatedResponse({
    type: AnimalColorEntity,
    description: 'AnimalColor created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid color data' })
  @Post()
  async create(@Body() data: CreateAnimalColorDto) {
    return await this.colorService.create(data);
  }

  @ApiOperation({
    summary: 'List colors',
    description: 'Retrieve paginated list of colors.',
  })
  @ApiOkResponse({
    type: PaginatedAnimalColorEntity,
    description: 'AnimalColors retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: AnimalColorQueryParamsDto) {
    return await this.colorService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get color by ID',
    description: 'Retrieve color details.',
  })
  @ApiOkResponse({
    type: AnimalColorEntity,
    description: 'AnimalColor retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'AnimalColor not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.colorService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update color',
    description: 'Update color information by ID.',
  })
  @ApiOkResponse({
    type: AnimalColorEntity,
    description: 'AnimalColor updated successfully',
  })
  @ApiNotFoundResponse({ description: 'AnimalColor not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAnimalColorDto,
  ) {
    return await this.colorService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete color',
    description: 'Delete color by ID.',
  })
  @ApiOkResponse({
    type: AnimalColorEntity,
    description: 'AnimalColor deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'AnimalColor not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.colorService.delete(id);
  }
}

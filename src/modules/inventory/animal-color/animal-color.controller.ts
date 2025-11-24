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
import { AnimalAnimalColorService } from './animal-color.service';
import {
  CreateAnimalAnimalColorDto,
  UpdateAnimalAnimalColorDto,
  AnimalAnimalColorQueryParamsDto,
} from './dto';
import {
  AnimalAnimalColorEntity,
  PaginatedAnimalAnimalColorEntity,
} from './entities';

@ApiTags('colors')
@Controller('colors')
export class AnimalAnimalColorController {
  constructor(private readonly colorService: AnimalAnimalColorService) {}

  @ApiOperation({
    summary: 'Create color',
    description: 'Creates a new color.',
  })
  @ApiCreatedResponse({
    type: AnimalAnimalColorEntity,
    description: 'AnimalColor created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid color data' })
  @Post()
  async create(@Body() data: CreateAnimalAnimalColorDto) {
    return await this.colorService.create(data);
  }

  @ApiOperation({
    summary: 'List colors',
    description: 'Retrieve paginated list of colors.',
  })
  @ApiOkResponse({
    type: PaginatedAnimalAnimalColorEntity,
    description: 'AnimalColors retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: AnimalAnimalColorQueryParamsDto) {
    return await this.colorService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get color by ID',
    description: 'Retrieve color details.',
  })
  @ApiOkResponse({
    type: AnimalAnimalColorEntity,
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
    type: AnimalAnimalColorEntity,
    description: 'AnimalColor updated successfully',
  })
  @ApiNotFoundResponse({ description: 'AnimalColor not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAnimalAnimalColorDto,
  ) {
    return await this.colorService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete color',
    description: 'Delete color by ID.',
  })
  @ApiOkResponse({
    type: AnimalAnimalColorEntity,
    description: 'AnimalColor deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'AnimalColor not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.colorService.delete(id);
  }
}

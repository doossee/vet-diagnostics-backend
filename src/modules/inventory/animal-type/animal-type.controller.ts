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
} from '@nestjs/swagger';
import { AnimalTypeService } from './animal-type.service';
import {
  CreateAnimalTypeDto,
  UpdateAnimalTypeDto,
  AnimalTypeQueryParamsDto,
  ResolveAnimalTypeDto,
} from './dto';
import { AnimalTypeEntity, PaginatedAnimalTypeEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('animal-types')
@Controller('animal-types')
export class AnimalTypeController {
  constructor(private readonly animalTypeService: AnimalTypeService) {}

  @ApiOperation({ summary: 'Create animal type' })
  @ApiCreatedResponse({ type: AnimalTypeEntity })
  @Post()
  async create(@Body() data: CreateAnimalTypeDto) {
    return await this.animalTypeService.create(data);
  }

  @ApiOperation({ summary: 'List animal types' })
  @ApiOkResponse({ type: PaginatedAnimalTypeEntity })
  @Get()
  async findAll(@Query() query: AnimalTypeQueryParamsDto) {
    return await this.animalTypeService.findAll(query);
  }

  @ApiOperation({ summary: 'Resolve leaf AnimalType from parent + sex + birth month/year' })
  @ApiOkResponse({ type: AnimalTypeEntity })
  @Get('resolve')
  async resolveAnimalType(@Query() query: ResolveAnimalTypeDto) {
    return await this.animalTypeService.resolveAnimalType(query);
  }

  @ApiOperation({ summary: 'Get animal type by ID' })
  @ApiOkResponse({ type: AnimalTypeEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.animalTypeService.findOne(id);
  }

  @ApiOperation({ summary: 'Update animal type' })
  @ApiOkResponse({ type: AnimalTypeEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAnimalTypeDto,
  ) {
    return await this.animalTypeService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete animal type' })
  @ApiOkResponse({ type: AnimalTypeEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.animalTypeService.delete(id);
  }
}

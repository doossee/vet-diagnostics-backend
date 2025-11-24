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
import { AnimalAnimalBreedService } from './animal-breed.service';
import {
  CreateAnimalAnimalBreedDto,
  UpdateAnimalAnimalBreedDto,
  AnimalAnimalBreedQueryParamsDto,
} from './dto';
import {
  AnimalAnimalBreedEntity,
  PaginatedAnimalAnimalBreedEntity,
} from './entities';

@ApiTags('breeds')
@Controller('breeds')
export class AnimalAnimalBreedController {
  constructor(private readonly breedService: AnimalAnimalBreedService) {}

  @ApiOperation({ summary: 'Create breed' })
  @ApiCreatedResponse({ type: AnimalAnimalBreedEntity })
  @Post()
  async create(@Body() data: CreateAnimalAnimalBreedDto) {
    return await this.breedService.create(data);
  }

  @ApiOperation({ summary: 'List breeds' })
  @ApiOkResponse({ type: PaginatedAnimalAnimalBreedEntity })
  @Get()
  async findAll(@Query() query: AnimalAnimalBreedQueryParamsDto) {
    return await this.breedService.findAll(query);
  }

  @ApiOperation({ summary: 'Get breed by ID' })
  @ApiOkResponse({ type: AnimalAnimalBreedEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.breedService.findOne(id);
  }

  @ApiOperation({ summary: 'Update breed' })
  @ApiOkResponse({ type: AnimalAnimalBreedEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAnimalAnimalBreedDto,
  ) {
    return await this.breedService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete breed' })
  @ApiOkResponse({ type: AnimalAnimalBreedEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.breedService.delete(id);
  }
}

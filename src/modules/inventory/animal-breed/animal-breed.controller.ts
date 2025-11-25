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
import { AnimalBreedService } from './animal-breed.service';
import {
  CreateAnimalBreedDto,
  UpdateAnimalBreedDto,
  AnimalBreedQueryParamsDto,
} from './dto';
import { AnimalBreedEntity, PaginatedAnimalBreedEntity } from './entities';

@ApiTags('breeds')
@Controller('breeds')
export class AnimalBreedController {
  constructor(private readonly breedService: AnimalBreedService) {}

  @ApiOperation({ summary: 'Create breed' })
  @ApiCreatedResponse({ type: AnimalBreedEntity })
  @Post()
  async create(@Body() data: CreateAnimalBreedDto) {
    return await this.breedService.create(data);
  }

  @ApiOperation({ summary: 'List breeds' })
  @ApiOkResponse({ type: PaginatedAnimalBreedEntity })
  @Get()
  async findAll(@Query() query: AnimalBreedQueryParamsDto) {
    return await this.breedService.findAll(query);
  }

  @ApiOperation({ summary: 'Get breed by ID' })
  @ApiOkResponse({ type: AnimalBreedEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.breedService.findOne(id);
  }

  @ApiOperation({ summary: 'Update breed' })
  @ApiOkResponse({ type: AnimalBreedEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAnimalBreedDto,
  ) {
    return await this.breedService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete breed' })
  @ApiOkResponse({ type: AnimalBreedEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.breedService.delete(id);
  }
}

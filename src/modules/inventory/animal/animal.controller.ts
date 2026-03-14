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
import { AnimalService } from './animal.service';
import { CreateAnimalDto, UpdateAnimalDto, AnimalQueryParamsDto } from './dto';
import { AnimalEntity, PaginatedAnimalEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('animals')
@Controller('animals')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @ApiOperation({ summary: 'Create animal' })
  @ApiCreatedResponse({ type: AnimalEntity })
  @Post()
  async create(@Body() data: CreateAnimalDto) {
    return await this.animalService.create(data);
  }

  @ApiOperation({ summary: 'List animals' })
  @ApiOkResponse({ type: PaginatedAnimalEntity })
  @Get()
  async findAll(@Query() query: AnimalQueryParamsDto) {
    return await this.animalService.findAll(query);
  }

  @ApiOperation({ summary: 'Get animal by ID' })
  @ApiOkResponse({ type: AnimalEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.animalService.findOne(id);
  }

  @ApiOperation({ summary: 'Get animal by ID' })
  @ApiOkResponse({ type: AnimalEntity })
  @ApiNotFoundResponse()
  @Get('/predict/:id')
  async findPredict(@Param('id', ParseUUIDPipe) id: string) {
    return await this.animalService.findPredict(id);
  }

  @ApiOperation({ summary: 'Update animal' })
  @ApiOkResponse({ type: AnimalEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAnimalDto,
  ) {
    return await this.animalService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete animal' })
  @ApiOkResponse({ type: AnimalEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.animalService.delete(id);
  }
}

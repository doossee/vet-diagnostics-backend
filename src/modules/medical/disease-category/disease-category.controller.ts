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
import { DiseaseCategoryService } from './disease-category.service';
import {
  CreateDiseaseCategoryDto,
  UpdateDiseaseCategoryDto,
  DiseaseCategoryQueryParamsDto,
} from './dto';
import {
  DiseaseCategoryEntity,
  PaginatedDiseaseCategoryEntity,
} from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('disease-categories')
@Controller('disease-categories')
export class DiseaseCategoryController {
  constructor(
    private readonly diseaseCategoryService: DiseaseCategoryService,
  ) {}

  @ApiOperation({ summary: 'Create disease category' })
  @ApiCreatedResponse({ type: DiseaseCategoryEntity })
  @Post()
  async create(@Body() data: CreateDiseaseCategoryDto) {
    return await this.diseaseCategoryService.create(data);
  }

  @ApiOperation({ summary: 'List disease categories' })
  @ApiOkResponse({ type: PaginatedDiseaseCategoryEntity })
  @Get()
  async findAll(@Query() query: DiseaseCategoryQueryParamsDto) {
    return await this.diseaseCategoryService.findAll(query);
  }

  @ApiOperation({ summary: 'Get disease category by ID' })
  @ApiOkResponse({ type: DiseaseCategoryEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.diseaseCategoryService.findOne(id);
  }

  @ApiOperation({ summary: 'Update disease category' })
  @ApiOkResponse({ type: DiseaseCategoryEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateDiseaseCategoryDto,
  ) {
    return await this.diseaseCategoryService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete disease category' })
  @ApiOkResponse({ type: DiseaseCategoryEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.diseaseCategoryService.delete(id);
  }
}

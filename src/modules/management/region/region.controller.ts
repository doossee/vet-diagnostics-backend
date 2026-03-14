import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { RegionService } from './region.service';
import { CreateRegionDto, UpdateRegionDto, RegionQueryParamsDto } from './dto';
import { RegionEntity, PaginatedRegionEntity } from './entities';
import { IsAdminUser } from 'src/shared/decorators';

@IsAdminUser()
@ApiTags('regions')
@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @ApiOperation({
    summary: 'Create region',
    description: 'Creates a new region with Russian and Uzbek names.',
  })
  @ApiCreatedResponse({
    type: RegionEntity,
    description: 'Region created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid region data' })
  @Post()
  async create(@Body() data: CreateRegionDto) {
    return await this.regionService.create(data);
  }

  @ApiOperation({
    summary: 'List regions',
    description: 'Retrieve paginated list of regions with nested districts.',
  })
  @ApiOkResponse({
    type: PaginatedRegionEntity,
    description: 'Regions retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: RegionQueryParamsDto) {
    return await this.regionService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get region by ID',
    description: 'Retrieve region details with nested districts.',
  })
  @ApiOkResponse({
    type: RegionEntity,
    description: 'Region retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Region not found' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.regionService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update region',
    description: 'Update region information by ID.',
  })
  @ApiOkResponse({
    type: RegionEntity,
    description: 'Region updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Region not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRegionDto,
  ) {
    return await this.regionService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete region',
    description: 'Delete region by ID.',
  })
  @ApiOkResponse({
    type: RegionEntity,
    description: 'Region deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Region not found' })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.regionService.delete(id);
  }
}

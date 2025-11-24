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
import { DistrictService } from './district.service';
import {
  CreateDistrictDto,
  UpdateDistrictDto,
  DistrictQueryParamsDto,
} from './dto';
import { DistrictEntity, PaginatedDistrictEntity } from './entities';

@ApiTags('districts')
@Controller('districts')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @ApiOperation({
    summary: 'Create district',
    description: 'Creates a new district with Russian and Uzbek names.',
  })
  @ApiCreatedResponse({
    type: DistrictEntity,
    description: 'District created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid district data' })
  @Post()
  async create(@Body() data: CreateDistrictDto) {
    return await this.districtService.create(data);
  }

  @ApiOperation({
    summary: 'List districts',
    description:
      'Retrieve paginated list of districts with optional region filter.',
  })
  @ApiOkResponse({
    type: PaginatedDistrictEntity,
    description: 'Districts retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: DistrictQueryParamsDto) {
    return await this.districtService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get district by ID',
    description: 'Retrieve district details with nested region.',
  })
  @ApiOkResponse({
    type: DistrictEntity,
    description: 'District retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'District not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.districtService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update district',
    description: 'Update district information by ID.',
  })
  @ApiOkResponse({
    type: DistrictEntity,
    description: 'District updated successfully',
  })
  @ApiNotFoundResponse({ description: 'District not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateDistrictDto,
  ) {
    return await this.districtService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete district',
    description: 'Delete district by ID.',
  })
  @ApiOkResponse({
    type: DistrictEntity,
    description: 'District deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'District not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.districtService.delete(id);
  }
}

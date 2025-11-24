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
import { UrineSmellService } from './urine-smell.service';
import {
  CreateUrineSmellDto,
  UpdateUrineSmellDto,
  UrineSmellQueryParamsDto,
} from './dto';
import { UrineSmellEntity, PaginatedUrineSmellEntity } from './entities';

@ApiTags('urine-smells')
@Controller('urine-smells')
export class UrineSmellController {
  constructor(private readonly urineSmellService: UrineSmellService) {}

  @ApiOperation({
    summary: 'Create urine smell',
    description: 'Creates a new urine smell.',
  })
  @ApiCreatedResponse({
    type: UrineSmellEntity,
    description: 'Urine smell created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateUrineSmellDto) {
    return await this.urineSmellService.create(data);
  }

  @ApiOperation({
    summary: 'List urine smells',
    description: 'Retrieve paginated list of urine smells.',
  })
  @ApiOkResponse({
    type: PaginatedUrineSmellEntity,
    description: 'Urine smells retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: UrineSmellQueryParamsDto) {
    return await this.urineSmellService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get urine smell by ID',
    description: 'Retrieve urine smell details.',
  })
  @ApiOkResponse({
    type: UrineSmellEntity,
    description: 'Urine smell retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine smell not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.urineSmellService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update urine smell',
    description: 'Update urine smell information by ID.',
  })
  @ApiOkResponse({
    type: UrineSmellEntity,
    description: 'Urine smell updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine smell not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUrineSmellDto,
  ) {
    return await this.urineSmellService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete urine smell',
    description: 'Delete urine smell by ID.',
  })
  @ApiOkResponse({
    type: UrineSmellEntity,
    description: 'Urine smell deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine smell not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.urineSmellService.delete(id);
  }
}

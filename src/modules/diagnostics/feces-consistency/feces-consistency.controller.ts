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
import { FecesConsistencyService } from './feces-consistency.service';
import {
  CreateFecesConsistencyDto,
  UpdateFecesConsistencyDto,
  FecesConsistencyQueryParamsDto,
} from './dto';
import {
  FecesConsistencyEntity,
  PaginatedFecesConsistencyEntity,
} from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('feces-consistencies')
@Controller('feces-consistencies')
export class FecesConsistencyController {
  constructor(
    private readonly fecesConsistencyService: FecesConsistencyService,
  ) {}

  @ApiOperation({
    summary: 'Create feces consistency',
    description: 'Creates a new feces consistency.',
  })
  @ApiCreatedResponse({
    type: FecesConsistencyEntity,
    description: 'Feces consistency created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateFecesConsistencyDto) {
    return await this.fecesConsistencyService.create(data);
  }

  @ApiOperation({
    summary: 'List feces consistencies',
    description: 'Retrieve paginated list of feces consistencies.',
  })
  @ApiOkResponse({
    type: PaginatedFecesConsistencyEntity,
    description: 'Feces consistencies retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: FecesConsistencyQueryParamsDto) {
    return await this.fecesConsistencyService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get feces consistency by ID',
    description: 'Retrieve feces consistency details.',
  })
  @ApiOkResponse({
    type: FecesConsistencyEntity,
    description: 'Feces consistency retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces consistency not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesConsistencyService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update feces consistency',
    description: 'Update feces consistency information by ID.',
  })
  @ApiOkResponse({
    type: FecesConsistencyEntity,
    description: 'Feces consistency updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces consistency not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateFecesConsistencyDto,
  ) {
    return await this.fecesConsistencyService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete feces consistency',
    description: 'Delete feces consistency by ID.',
  })
  @ApiOkResponse({
    type: FecesConsistencyEntity,
    description: 'Feces consistency deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces consistency not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesConsistencyService.delete(id);
  }
}

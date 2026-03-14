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
import { UrineConsistencyService } from './urine-consistency.service';
import {
  CreateUrineConsistencyDto,
  UpdateUrineConsistencyDto,
  UrineConsistencyQueryParamsDto,
} from './dto';
import {
  UrineConsistencyEntity,
  PaginatedUrineConsistencyEntity,
} from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('urine-consistencies')
@Controller('urine-consistencies')
export class UrineConsistencyController {
  constructor(
    private readonly urineConsistencyService: UrineConsistencyService,
  ) {}

  @ApiOperation({
    summary: 'Create urine consistency',
    description: 'Creates a new urine consistency.',
  })
  @ApiCreatedResponse({
    type: UrineConsistencyEntity,
    description: 'Urine consistency created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateUrineConsistencyDto) {
    return await this.urineConsistencyService.create(data);
  }

  @ApiOperation({
    summary: 'List urine consistencies',
    description: 'Retrieve paginated list of urine consistencies.',
  })
  @ApiOkResponse({
    type: PaginatedUrineConsistencyEntity,
    description: 'Urine consistencies retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: UrineConsistencyQueryParamsDto) {
    return await this.urineConsistencyService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get urine consistency by ID',
    description: 'Retrieve urine consistency details.',
  })
  @ApiOkResponse({
    type: UrineConsistencyEntity,
    description: 'Urine consistency retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine consistency not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.urineConsistencyService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update urine consistency',
    description: 'Update urine consistency information by ID.',
  })
  @ApiOkResponse({
    type: UrineConsistencyEntity,
    description: 'Urine consistency updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine consistency not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUrineConsistencyDto,
  ) {
    return await this.urineConsistencyService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete urine consistency',
    description: 'Delete urine consistency by ID.',
  })
  @ApiOkResponse({
    type: UrineConsistencyEntity,
    description: 'Urine consistency deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine consistency not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.urineConsistencyService.delete(id);
  }
}

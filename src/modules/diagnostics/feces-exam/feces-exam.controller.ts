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
import { FecesExamService } from './feces-exam.service';
import {
  CreateFecesExamDto,
  UpdateFecesExamDto,
  FecesExamQueryParamsDto,
} from './dto';
import { FecesExamEntity, PaginatedFecesExamEntity } from './entities';

@ApiTags('feces-exams')
@Controller('feces-exams')
export class FecesExamController {
  constructor(private readonly fecesExamService: FecesExamService) {}

  @ApiOperation({
    summary: 'Create feces exam',
    description: 'Creates a new feces exam.',
  })
  @ApiCreatedResponse({
    type: FecesExamEntity,
    description: 'Feces exam created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateFecesExamDto) {
    return await this.fecesExamService.create(data);
  }

  @ApiOperation({
    summary: 'List feces exams',
    description: 'Retrieve paginated list of feces exams.',
  })
  @ApiOkResponse({
    type: PaginatedFecesExamEntity,
    description: 'Feces exams retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: FecesExamQueryParamsDto) {
    return await this.fecesExamService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get feces exam by ID',
    description: 'Retrieve feces exam details.',
  })
  @ApiOkResponse({
    type: FecesExamEntity,
    description: 'Feces exam retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces exam not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesExamService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update feces exam',
    description: 'Update feces exam information by ID.',
  })
  @ApiOkResponse({
    type: FecesExamEntity,
    description: 'Feces exam updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces exam not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateFecesExamDto,
  ) {
    return await this.fecesExamService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete feces exam',
    description: 'Delete feces exam by ID.',
  })
  @ApiOkResponse({
    type: FecesExamEntity,
    description: 'Feces exam deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces exam not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesExamService.delete(id);
  }
}

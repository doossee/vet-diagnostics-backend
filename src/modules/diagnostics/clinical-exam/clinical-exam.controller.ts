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
import { ClinicalExamService } from './clinical-exam.service';
import {
  CreateClinicalExamDto,
  UpdateClinicalExamDto,
  ClinicalExamQueryParamsDto,
} from './dto';
import { ClinicalExamEntity, PaginatedClinicalExamEntity } from './entities';

@ApiTags('clinical-exams')
@Controller('clinical-exams')
export class ClinicalExamController {
  constructor(private readonly clinicalExamService: ClinicalExamService) {}

  @ApiOperation({
    summary: 'Create clinical exam',
    description: 'Creates a new clinical exam.',
  })
  @ApiCreatedResponse({
    type: ClinicalExamEntity,
    description: 'Clinical exam created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateClinicalExamDto) {
    return await this.clinicalExamService.create(data);
  }

  @ApiOperation({
    summary: 'List clinical exams',
    description: 'Retrieve paginated list of clinical exams.',
  })
  @ApiOkResponse({
    type: PaginatedClinicalExamEntity,
    description: 'Clinical exams retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: ClinicalExamQueryParamsDto) {
    return await this.clinicalExamService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get clinical exam by ID',
    description: 'Retrieve clinical exam details.',
  })
  @ApiOkResponse({
    type: ClinicalExamEntity,
    description: 'Clinical exam retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Clinical exam not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.clinicalExamService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update clinical exam',
    description: 'Update clinical exam information by ID.',
  })
  @ApiOkResponse({
    type: ClinicalExamEntity,
    description: 'Clinical exam updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Clinical exam not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateClinicalExamDto,
  ) {
    return await this.clinicalExamService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete clinical exam',
    description: 'Delete clinical exam by ID.',
  })
  @ApiOkResponse({
    type: ClinicalExamEntity,
    description: 'Clinical exam deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Clinical exam not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.clinicalExamService.delete(id);
  }
}

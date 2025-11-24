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
import { MucosaExamService } from './mucosa-exam.service';
import {
  CreateMucosaExamDto,
  UpdateMucosaExamDto,
  MucosaExamQueryParamsDto,
} from './dto';
import { MucosaExamEntity, PaginatedMucosaExamEntity } from './entities';

@ApiTags('mucosa-exams')
@Controller('mucosa-exams')
export class MucosaExamController {
  constructor(private readonly mucosaExamService: MucosaExamService) {}

  @ApiOperation({
    summary: 'Create mucosa exam',
    description: 'Creates a new mucosa exam.',
  })
  @ApiCreatedResponse({
    type: MucosaExamEntity,
    description: 'Mucosa exam created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateMucosaExamDto) {
    return await this.mucosaExamService.create(data);
  }

  @ApiOperation({
    summary: 'List mucosa exams',
    description: 'Retrieve paginated list of mucosa exams.',
  })
  @ApiOkResponse({
    type: PaginatedMucosaExamEntity,
    description: 'Mucosa exams retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: MucosaExamQueryParamsDto) {
    return await this.mucosaExamService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get mucosa exam by ID',
    description: 'Retrieve mucosa exam details.',
  })
  @ApiOkResponse({
    type: MucosaExamEntity,
    description: 'Mucosa exam retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Mucosa exam not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.mucosaExamService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update mucosa exam',
    description: 'Update mucosa exam information by ID.',
  })
  @ApiOkResponse({
    type: MucosaExamEntity,
    description: 'Mucosa exam updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Mucosa exam not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateMucosaExamDto,
  ) {
    return await this.mucosaExamService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete mucosa exam',
    description: 'Delete mucosa exam by ID.',
  })
  @ApiOkResponse({
    type: MucosaExamEntity,
    description: 'Mucosa exam deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Mucosa exam not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.mucosaExamService.delete(id);
  }
}

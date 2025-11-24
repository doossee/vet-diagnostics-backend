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
import { BloodExamService } from './blood-exam.service';
import {
  CreateBloodExamDto,
  UpdateBloodExamDto,
  BloodExamQueryParamsDto,
} from './dto';
import { BloodExamEntity, PaginatedBloodExamEntity } from './entities';

@ApiTags('blood-exams')
@Controller('blood-exams')
export class BloodExamController {
  constructor(private readonly bloodExamService: BloodExamService) {}

  @ApiOperation({
    summary: 'Create blood exam',
    description: 'Creates a new blood exam.',
  })
  @ApiCreatedResponse({
    type: BloodExamEntity,
    description: 'Blood exam created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateBloodExamDto) {
    return await this.bloodExamService.create(data);
  }

  @ApiOperation({
    summary: 'List blood exams',
    description: 'Retrieve paginated list of blood exams.',
  })
  @ApiOkResponse({
    type: PaginatedBloodExamEntity,
    description: 'Blood exams retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: BloodExamQueryParamsDto) {
    return await this.bloodExamService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get blood exam by ID',
    description: 'Retrieve blood exam details.',
  })
  @ApiOkResponse({
    type: BloodExamEntity,
    description: 'Blood exam retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Blood exam not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.bloodExamService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update blood exam',
    description: 'Update blood exam information by ID.',
  })
  @ApiOkResponse({
    type: BloodExamEntity,
    description: 'Blood exam updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Blood exam not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateBloodExamDto,
  ) {
    return await this.bloodExamService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete blood exam',
    description: 'Delete blood exam by ID.',
  })
  @ApiOkResponse({
    type: BloodExamEntity,
    description: 'Blood exam deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Blood exam not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.bloodExamService.delete(id);
  }
}

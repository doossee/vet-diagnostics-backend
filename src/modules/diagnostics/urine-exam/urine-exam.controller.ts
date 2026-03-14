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
import { UrineExamService } from './urine-exam.service';
import {
  CreateUrineExamDto,
  UpdateUrineExamDto,
  UrineExamQueryParamsDto,
} from './dto';
import { UrineExamEntity, PaginatedUrineExamEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('urine-exams')
@Controller('urine-exams')
export class UrineExamController {
  constructor(private readonly urineExamService: UrineExamService) {}

  @ApiOperation({
    summary: 'Create urine exam',
    description: 'Creates a new urine exam.',
  })
  @ApiCreatedResponse({
    type: UrineExamEntity,
    description: 'Urine exam created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateUrineExamDto) {
    return await this.urineExamService.create(data);
  }

  @ApiOperation({
    summary: 'List urine exams',
    description: 'Retrieve paginated list of urine exams.',
  })
  @ApiOkResponse({
    type: PaginatedUrineExamEntity,
    description: 'Urine exams retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: UrineExamQueryParamsDto) {
    return await this.urineExamService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get last urine exam by animal ID',
    description: 'Retrieve the last urine exam for a specific animal.',
  })
  @ApiOkResponse({
    type: UrineExamEntity,
    description: 'Last urine exam retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine exam not found' })
  @Get('animal/:animalId/last')
  async findLastByAnimalId(@Param('animalId', ParseUUIDPipe) animalId: string) {
    return await this.urineExamService.findLastByAnimalId(animalId);
  }

  @ApiOperation({
    summary: 'Get urine exam by ID',
    description: 'Retrieve urine exam details.',
  })
  @ApiOkResponse({
    type: UrineExamEntity,
    description: 'Urine exam retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine exam not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.urineExamService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update urine exam',
    description: 'Update urine exam information by ID.',
  })
  @ApiOkResponse({
    type: UrineExamEntity,
    description: 'Urine exam updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine exam not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUrineExamDto,
  ) {
    return await this.urineExamService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete urine exam',
    description: 'Delete urine exam by ID.',
  })
  @ApiOkResponse({
    type: UrineExamEntity,
    description: 'Urine exam deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine exam not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.urineExamService.delete(id);
  }
}

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
import { MedicalSessionService } from './medical-session.service';
import {
  CreateMedicalSessionDto,
  UpdateMedicalSessionDto,
  MedicalSessionQueryParamsDto,
} from './dto';
import {
  MedicalSessionEntity,
  PaginatedMedicalSessionEntity,
} from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('medical-sessions')
@Controller('medical-sessions')
export class MedicalSessionController {
  constructor(private readonly medicalSessionService: MedicalSessionService) {}

  @ApiOperation({
    summary: 'Create medical session',
    description: 'Creates a new medical session for an animal.',
  })
  @ApiCreatedResponse({
    type: MedicalSessionEntity,
    description: 'Medical session created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateMedicalSessionDto) {
    return await this.medicalSessionService.create(data);
  }

  @ApiOperation({
    summary: 'List medical sessions',
    description: 'Retrieve paginated list of medical sessions.',
  })
  @ApiOkResponse({
    type: PaginatedMedicalSessionEntity,
    description: 'Medical sessions retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: MedicalSessionQueryParamsDto) {
    return await this.medicalSessionService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get medical session by ID',
    description:
      'Retrieve medical session with all exams and prediction details.',
  })
  @ApiOkResponse({
    type: MedicalSessionEntity,
    description: 'Medical session retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Medical session not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.medicalSessionService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update medical session',
    description: 'Update medical session status or notes.',
  })
  @ApiOkResponse({
    type: MedicalSessionEntity,
    description: 'Medical session updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Medical session not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateMedicalSessionDto,
  ) {
    return await this.medicalSessionService.update(id, data);
  }

  @ApiOperation({
    summary: 'Submit medical session for AI prediction',
    description:
      'Submits the session to the AI model and stores the prediction result.',
  })
  @ApiOkResponse({
    type: MedicalSessionEntity,
    description: 'Session submitted and prediction stored successfully',
  })
  @ApiNotFoundResponse({ description: 'Medical session not found' })
  @ApiBadRequestResponse({
    description: 'Session missing required exams or already submitted',
  })
  @Post(':id/submit')
  async submit(@Param('id', ParseUUIDPipe) id: string) {
    return await this.medicalSessionService.submit(id);
  }

  @ApiOperation({
    summary: 'Delete medical session',
    description: 'Delete medical session by ID.',
  })
  @ApiOkResponse({
    type: MedicalSessionEntity,
    description: 'Medical session deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Medical session not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.medicalSessionService.delete(id);
  }
}

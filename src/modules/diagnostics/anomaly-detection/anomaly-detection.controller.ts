import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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
import { AnomalyDetectionService } from './anomaly-detection.service';
import { ReferenceRangeService } from './reference-range.service';
import {
  PredictDto,
  TrendQueryDto,
  AnomalyQueryDto,
  UpdateAlertDto,
  CreateReferenceRangeDto,
  UpdateReferenceRangeDto,
  ReferenceRangeQueryDto,
} from './dto';
import {
  PredictionResultEntity,
  TrendEntity,
  AnomalyAlertEntity,
  HealthSummaryEntity,
  ReferenceRangeEntity,
} from './entities';
import { IsAuthenticated, IsAdminUser } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('anomaly-detection')
@Controller('anomaly-detection')
export class AnomalyDetectionController {
  constructor(
    private readonly anomalyDetectionService: AnomalyDetectionService,
    private readonly referenceRangeService: ReferenceRangeService,
  ) {}

  // ── Prediction ──

  @ApiOperation({
    summary: 'Run AI prediction with anomaly detection',
    description:
      'Sends 85 features to the ML model for one of 4 cattle types. ' +
      'Returns disease predictions (116 possible diseases), detected anomalies, ' +
      'and overall severity. Automatically creates alert records if animalId and sessionId are provided.',
  })
  @ApiCreatedResponse({
    type: PredictionResultEntity,
    description: 'Prediction and anomaly detection completed',
  })
  @ApiBadRequestResponse({ description: 'ML service error or invalid data' })
  @Post('predict')
  async predict(@Body() dto: PredictDto) {
    return await this.anomalyDetectionService.predict(dto);
  }

  // ── Trends ──

  @ApiOperation({
    summary: 'Get parameter trend for an animal',
    description:
      'Returns historical values of a specific parameter (e.g. hemoglobin, glucose) ' +
      'for an animal over time. Calculates trend direction (stable/increasing/decreasing) ' +
      'and percentage change.',
  })
  @ApiOkResponse({
    type: TrendEntity,
    description: 'Trend data retrieved',
  })
  @ApiBadRequestResponse({ description: 'Unknown parameter name' })
  @Get('trends')
  async getTrend(@Query() query: TrendQueryDto) {
    return await this.anomalyDetectionService.getAnimalTrend(query);
  }

  // ── Alerts ──

  @ApiOperation({
    summary: 'List anomaly alerts',
    description:
      'Paginated list of anomaly alerts with optional filters by animal, session, severity, and status.',
  })
  @ApiOkResponse({
    description: 'Alerts retrieved',
  })
  @Get('alerts')
  async getAlerts(@Query() query: AnomalyQueryDto) {
    return await this.anomalyDetectionService.getAlerts(query);
  }

  @ApiOperation({
    summary: 'Update alert status',
    description: 'Acknowledge or resolve an anomaly alert.',
  })
  @ApiOkResponse({
    type: AnomalyAlertEntity,
    description: 'Alert updated',
  })
  @ApiNotFoundResponse({ description: 'Alert not found' })
  @Patch('alerts/:id')
  async updateAlert(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAlertDto,
  ) {
    return await this.anomalyDetectionService.updateAlert(id, dto);
  }

  // ── Health Summary ──

  @ApiOperation({
    summary: 'Get animal health summary',
    description:
      'Returns active alert counts by severity, overall health status ' +
      '(HEALTHY/ATTENTION/WARNING/CRITICAL), and session statistics.',
  })
  @ApiOkResponse({
    type: HealthSummaryEntity,
    description: 'Health summary retrieved',
  })
  @Get('animals/:animalId/health-summary')
  async getHealthSummary(@Param('animalId', ParseUUIDPipe) animalId: string) {
    return await this.anomalyDetectionService.getAnimalHealthSummary(animalId);
  }
}

// Separate controller for reference range management (admin only)
@IsAdminUser()
@ApiTags('reference-ranges')
@Controller('reference-ranges')
export class ReferenceRangeController {
  constructor(private readonly referenceRangeService: ReferenceRangeService) {}

  @ApiOperation({
    summary: 'Create reference range',
    description:
      'Define a normal min/max range for a parameter for a specific animal type. ' +
      'Used by the anomaly detection system to identify deviations.',
  })
  @ApiCreatedResponse({
    type: ReferenceRangeEntity,
    description: 'Reference range created',
  })
  @Post()
  async create(@Body() dto: CreateReferenceRangeDto) {
    return await this.referenceRangeService.create(dto);
  }

  @ApiOperation({
    summary: 'List reference ranges',
    description:
      'Paginated list of reference ranges, filterable by animal type.',
  })
  @ApiOkResponse({ description: 'Reference ranges retrieved' })
  @Get()
  async findAll(@Query() query: ReferenceRangeQueryDto) {
    return await this.referenceRangeService.findAll(query);
  }

  @ApiOperation({ summary: 'Get reference range by ID' })
  @ApiOkResponse({ type: ReferenceRangeEntity })
  @ApiNotFoundResponse({ description: 'Reference range not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.referenceRangeService.findOne(id);
  }

  @ApiOperation({ summary: 'Update reference range' })
  @ApiOkResponse({ type: ReferenceRangeEntity })
  @ApiNotFoundResponse({ description: 'Reference range not found' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReferenceRangeDto,
  ) {
    return await this.referenceRangeService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete reference range' })
  @ApiOkResponse({ description: 'Reference range deleted' })
  @ApiNotFoundResponse({ description: 'Reference range not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.referenceRangeService.delete(id);
  }
}

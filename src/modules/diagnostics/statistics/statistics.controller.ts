import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { StatisticsQueryDto } from './dto/statistics-query.dto';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiOperation({
    summary: 'Diseases by animal count',
    description:
      'Returns how many animals are diagnosed with each disease. ' +
      'Disease is determined by the highest probability in the AI prediction output. ' +
      'Filters: animalTypeId, startDate, endDate.',
  })
  @ApiOkResponse({
    description: 'Disease counts sorted by disease index',
    schema: {
      example: {
        data: [
          { diseaseIndex: '14', diseaseName: 'Пневмония', count: 23 },
          { diseaseIndex: '34', diseaseName: 'Гепатит', count: 15 },
        ],
        totalSessionsAnalyzed: 60,
      },
    },
  })
  @Get('diseases')
  getDiseasesByAnimals(@Query() query: StatisticsQueryDto) {
    return this.statisticsService.getDiseasesByAnimals(query);
  }

  @ApiOperation({
    summary: 'Disease frequency chart',
    description:
      'Returns disease counts sorted by frequency (descending) — ready for bar/pie charts. ' +
      'Filters: animalTypeId, startDate, endDate.',
  })
  @ApiOkResponse({
    description: 'Disease counts sorted by count descending',
    schema: {
      example: {
        data: [
          { diseaseIndex: '14', diseaseName: 'Пневмония', count: 23 },
          { diseaseIndex: '34', diseaseName: 'Гепатит', count: 15 },
        ],
        totalSessionsAnalyzed: 60,
      },
    },
  })
  @Get('diseases/chart')
  getDiseasesChart(@Query() query: StatisticsQueryDto) {
    return this.statisticsService.getDiseasesChart(query);
  }

  @ApiOperation({
    summary: 'Dashboard overview',
    description:
      'Returns aggregate counts: total sessions by status, unique animals examined, ' +
      'and the most common diagnosed disease. Filters: animalTypeId, startDate, endDate.',
  })
  @ApiOkResponse({
    description: 'Overview statistics',
    schema: {
      example: {
        totalSessions: 100,
        submittedSessions: 60,
        draftSessions: 30,
        readySessions: 10,
        totalAnimalsExamined: 45,
        mostCommonDisease: {
          diseaseIndex: '14',
          diseaseName: 'Пневмония',
          count: 23,
        },
      },
    },
  })
  @Get('overview')
  getOverview(@Query() query: StatisticsQueryDto) {
    return this.statisticsService.getOverview(query);
  }

  @ApiOperation({
    summary: 'Monthly disease trends',
    description:
      'Returns per-month breakdown of diagnosed diseases — useful for time-series charts. ' +
      'Filters: animalTypeId, startDate, endDate.',
  })
  @ApiOkResponse({
    description: 'Monthly trends grouped by period (YYYY-MM)',
    schema: {
      example: {
        data: [
          {
            period: '2026-01',
            total: 12,
            diseases: [
              { diseaseIndex: '14', diseaseName: 'Пневмония', count: 5 },
              { diseaseIndex: '34', diseaseName: 'Гепатит', count: 3 },
            ],
          },
        ],
      },
    },
  })
  @Get('trends')
  getMonthlyTrends(@Query() query: StatisticsQueryDto) {
    return this.statisticsService.getMonthlyTrends(query);
  }
}

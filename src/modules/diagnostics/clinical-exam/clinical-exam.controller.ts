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
  UseInterceptors,
  UploadedFile,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ExcelService } from 'src/shared/services';
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
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('clinical-exams')
@Controller('clinical-exams')
export class ClinicalExamController {
  constructor(
    private readonly clinicalExamService: ClinicalExamService,
    private readonly excelService: ExcelService,
  ) {}

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
    summary: 'Get last clinical exam by animal ID',
    description: 'Retrieve the last clinical exam for a specific animal.',
  })
  @ApiOkResponse({
    type: ClinicalExamEntity,
    description: 'Last clinical exam retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Clinical exam not found' })
  @Get('animal/:animalId/last')
  async findLastByAnimalId(@Param('animalId', ParseUUIDPipe) animalId: string) {
    return await this.clinicalExamService.findLastByAnimalId(animalId);
  }

  @ApiOperation({
    summary: 'Get clinical exam by ID',
    description: 'Retrieve clinical exam details.',
  })
  @ApiOkResponse({
    type: ClinicalExamEntity,
    description: 'Clinical exam retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template for clinical exam' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename="клинический-осмотр-шаблон.xlsx"',
  )
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
        {
          key: 'animalId',
          header: 'ID животного',
          example: 'uuid-here',
          width: 38,
        },
        { key: 'pulse', header: 'Пульс (уд/мин)', example: 72, width: 18 },
        {
          key: 'temperature',
          header: 'Температура (°C)',
          example: 38.5,
          width: 20,
        },
        {
          key: 'respiratoryRate',
          header: 'Частота дыхания (вдохов/мин)',
          example: 18,
          width: 25,
        },
        { key: 'rumination', header: 'Жвачка', example: 1, width: 20 },
        {
          key: 'rumenInfusoriaCount',
          header: 'Инфузории рубца',
          example: 500,
          width: 22,
        },
        {
          key: 'bodyTypeId',
          header: 'ID состояния тела',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'obesityId',
          header: 'ID упитанности',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'bodyPositionId',
          header: 'ID позы тела',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'constitutionId',
          header: 'ID конституции',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'temperamentId',
          header: 'ID темперамента',
          example: 'uuid-here',
          width: 38,
        },
        { key: 'woolId', header: 'ID шерсти', example: 'uuid-here', width: 38 },
        { key: 'downId', header: 'ID пуха', example: 'uuid-here', width: 38 },
        { key: 'hairId', header: 'ID волос', example: 'uuid-here', width: 38 },
        {
          key: 'feathersId',
          header: 'ID перьев',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'skinColorId',
          header: 'ID цвета кожи',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'skinHumidityId',
          header: 'ID влажности кожи',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'skinSmellId',
          header: 'ID запаха кожи',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'skinTempId',
          header: 'ID температуры кожи',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'skinSurfaceId',
          header: 'ID поверхности кожи',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'skinElasticityId',
          header: 'ID эластичности кожи',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'skinSensitivityId',
          header: 'ID чувствительности кожи',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'skinPainId',
          header: 'ID болезненности кожи',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'lymphSizeId',
          header: 'ID размера лимфоузла',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'lymphShapeId',
          header: 'ID формы лимфоузла',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'lymphSurfaceId',
          header: 'ID поверхности лимфоузла',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'lymphConsistencyId',
          header: 'ID консистенции лимфоузла',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'lymphTempId',
          header: 'ID температуры лимфоузла',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'lymphPainId',
          header: 'ID болезненности лимфоузла',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'lymphMobilityId',
          header: 'ID подвижности лимфоузла',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'rumenFluidStateId',
          header: 'ID состояния жидкости рубца',
          example: 'uuid-here',
          width: 38,
        },
      ],
      'Клинический осмотр',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import clinical exams from Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  async importFromExcel(@UploadedFile() file: Express.Multer.File) {
    const rows = await this.excelService.parseFile(file, [
      { key: 'animalId', header: 'ID животного' },
      { key: 'pulse', header: 'Пульс (уд/мин)' },
      { key: 'temperature', header: 'Температура (°C)' },
      { key: 'respiratoryRate', header: 'Частота дыхания (вдохов/мин)' },
      { key: 'rumination', header: 'Жвачка' },
      { key: 'rumenInfusoriaCount', header: 'Инфузории рубца' },
      { key: 'bodyTypeId', header: 'ID состояния тела' },
      { key: 'obesityId', header: 'ID упитанности' },
      { key: 'bodyPositionId', header: 'ID позы тела' },
      { key: 'constitutionId', header: 'ID конституции' },
      { key: 'temperamentId', header: 'ID темперамента' },
      { key: 'woolId', header: 'ID шерсти' },
      { key: 'downId', header: 'ID пуха' },
      { key: 'hairId', header: 'ID волос' },
      { key: 'feathersId', header: 'ID перьев' },
      { key: 'skinColorId', header: 'ID цвета кожи' },
      { key: 'skinHumidityId', header: 'ID влажности кожи' },
      { key: 'skinSmellId', header: 'ID запаха кожи' },
      { key: 'skinTempId', header: 'ID температуры кожи' },
      { key: 'skinSurfaceId', header: 'ID поверхности кожи' },
      { key: 'skinElasticityId', header: 'ID эластичности кожи' },
      { key: 'skinSensitivityId', header: 'ID чувствительности кожи' },
      { key: 'skinPainId', header: 'ID болезненности кожи' },
      { key: 'lymphSizeId', header: 'ID размера лимфоузла' },
      { key: 'lymphShapeId', header: 'ID формы лимфоузла' },
      { key: 'lymphSurfaceId', header: 'ID поверхности лимфоузла' },
      { key: 'lymphConsistencyId', header: 'ID консистенции лимфоузла' },
      { key: 'lymphTempId', header: 'ID температуры лимфоузла' },
      { key: 'lymphPainId', header: 'ID болезненности лимфоузла' },
      { key: 'lymphMobilityId', header: 'ID подвижности лимфоузла' },
      { key: 'rumenFluidStateId', header: 'ID состояния жидкости рубца' },
    ]);
    return await this.clinicalExamService.importFromExcel(rows);
  }

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

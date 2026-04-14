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
import { BloodExamService } from './blood-exam.service';
import {
  CreateBloodExamDto,
  UpdateBloodExamDto,
  BloodExamQueryParamsDto,
} from './dto';
import { BloodExamEntity, PaginatedBloodExamEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('blood-exams')
@Controller('blood-exams')
export class BloodExamController {
  constructor(
    private readonly bloodExamService: BloodExamService,
    private readonly excelService: ExcelService,
  ) {}

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
    summary: 'Get last blood exam by animal ID',
    description: 'Retrieve the last blood exam for a specific animal.',
  })
  @ApiOkResponse({
    type: BloodExamEntity,
    description: 'Last blood exam retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Blood exam not found' })
  @Get('animal/:animalId/last')
  async findLastByAnimalId(@Param('animalId', ParseUUIDPipe) animalId: string) {
    return await this.bloodExamService.findLastByAnimalId(animalId);
  }

  @ApiOperation({
    summary: 'Get blood exam by ID',
    description: 'Retrieve blood exam details.',
  })
  @ApiOkResponse({
    type: BloodExamEntity,
    description: 'Blood exam retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template for blood exam' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename="анализ-крови-шаблон.xlsx"',
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
        { key: 'erythrocyteCount', header: 'Эритроциты', example: 7.5 },
        { key: 'leukocyteCount', header: 'Лейкоциты', example: 8.0 },
        { key: 'thrombocyteCount', header: 'Тромбоциты', example: 300 },
        { key: 'coe', header: 'СОЭ', example: 2.5 },
        { key: 'waterPercentage', header: 'Вода (%)', example: 78 },
        { key: 'dryResidue', header: 'Сухой остаток (%)', example: 22 },
        { key: 'glutathione', header: 'Глутатион (ммоль/л)', example: 1.2 },
        { key: 'hemoglobin', header: 'Гемоглобин (г/л)', example: 120 },
        { key: 'totalProtein', header: 'Общий белок (г/л)', example: 75 },
        { key: 'albumin', header: 'Альбумин (%)', example: 45 },
        { key: 'alphaGlobulin', header: 'α-Глобулин (%)', example: 12 },
        { key: 'betaGlobulin', header: 'β-Глобулин (%)', example: 15 },
        { key: 'gammaGlobulin', header: 'γ-Глобулин (%)', example: 20 },
        {
          key: 'residualNitrogen',
          header: 'Остаточный азот (ммоль/л)',
          example: 18,
        },
        { key: 'urea', header: 'Мочевина (ммоль/л)', example: 5.5 },
        { key: 'uricAcid', header: 'Мочевая кислота (ммоль/л)', example: 0.3 },
        { key: 'creatinine', header: 'Креатинин (мкмоль/л)', example: 90 },
        {
          key: 'alkalineReserve',
          header: 'Щелочной резерв (об% СО2)',
          example: 55,
        },
        { key: 'glucose', header: 'Глюкоза (ммоль/л)', example: 4.5 },
        { key: 'ketoneBodies', header: 'Кетоновые тела (г/л)', example: 0.05 },
        {
          key: 'totalBilirubin',
          header: 'Общий билирубин (мкмоль/л)',
          example: 8,
        },
        {
          key: 'directBilirubin',
          header: 'Прямой билирубин (мкмоль/л)',
          example: 2,
        },
        {
          key: 'totalCholesterol',
          header: 'Общий холестерин (ммоль/л)',
          example: 4.5,
        },
        { key: 'totalLipids', header: 'Общие липиды (г/л)', example: 5.5 },
        { key: 'phospholipids', header: 'Фосфолипиды (г/л)', example: 2.1 },
        {
          key: 'lacticAcid',
          header: 'Молочная кислота (ммоль/л)',
          example: 1.2,
        },
        {
          key: 'pyruvicAcid',
          header: 'Пировиноградная кислота (ммоль/л)',
          example: 0.08,
        },
        {
          key: 'citricAcid',
          header: 'Лимонная кислота (ммоль/л)',
          example: 0.12,
        },
        { key: 'carotene', header: 'Каротин (мкмоль/л)', example: 3.5 },
        { key: 'vitaminA', header: 'Витамин A (мкмоль/л)', example: 1.5 },
        { key: 'vitaminC', header: 'Витамин C (мкмоль/л)', example: 40 },
        {
          key: 'organicPhosphorus',
          header: 'Органический фосфор (ммоль/л)',
          example: 1.8,
        },
        {
          key: 'totalCalcium',
          header: 'Общий кальций (ммоль/л)',
          example: 2.5,
        },
        { key: 'creatine', header: 'Креатин (ммоль/л)', example: 0.15 },
        { key: 'copper', header: 'Медь (ммоль/л)', example: 0.015 },
        { key: 'zinc', header: 'Цинк (ммоль/л)', example: 0.02 },
        { key: 'manganese', header: 'Марганец (ммоль/л)', example: 0.001 },
        { key: 'cobalt', header: 'Кобальт (ммоль/л)', example: 0.0003 },
        { key: 'vitaminB', header: 'Витамин B', example: '' },
        { key: 'conclusion', header: 'Заключение', example: '' },
      ],
      'Анализ крови',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import blood exams from Excel file' })
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
      { key: 'erythrocyteCount', header: 'Эритроциты' },
      { key: 'leukocyteCount', header: 'Лейкоциты' },
      { key: 'thrombocyteCount', header: 'Тромбоциты' },
      { key: 'coe', header: 'СОЭ' },
      { key: 'waterPercentage', header: 'Вода (%)' },
      { key: 'dryResidue', header: 'Сухой остаток (%)' },
      { key: 'glutathione', header: 'Глутатион (ммоль/л)' },
      { key: 'hemoglobin', header: 'Гемоглобин (г/л)' },
      { key: 'totalProtein', header: 'Общий белок (г/л)' },
      { key: 'albumin', header: 'Альбумин (%)' },
      { key: 'alphaGlobulin', header: 'α-Глобулин (%)' },
      { key: 'betaGlobulin', header: 'β-Глобулин (%)' },
      { key: 'gammaGlobulin', header: 'γ-Глобулин (%)' },
      { key: 'residualNitrogen', header: 'Остаточный азот (ммоль/л)' },
      { key: 'urea', header: 'Мочевина (ммоль/л)' },
      { key: 'uricAcid', header: 'Мочевая кислота (ммоль/л)' },
      { key: 'creatinine', header: 'Креатинин (мкмоль/л)' },
      { key: 'alkalineReserve', header: 'Щелочной резерв (об% СО2)' },
      { key: 'glucose', header: 'Глюкоза (ммоль/л)' },
      { key: 'ketoneBodies', header: 'Кетоновые тела (г/л)' },
      { key: 'totalBilirubin', header: 'Общий билирубин (мкмоль/л)' },
      { key: 'directBilirubin', header: 'Прямой билирубин (мкмоль/л)' },
      { key: 'totalCholesterol', header: 'Общий холестерин (ммоль/л)' },
      { key: 'totalLipids', header: 'Общие липиды (г/л)' },
      { key: 'phospholipids', header: 'Фосфолипиды (г/л)' },
      { key: 'lacticAcid', header: 'Молочная кислота (ммоль/л)' },
      { key: 'pyruvicAcid', header: 'Пировиноградная кислота (ммоль/л)' },
      { key: 'citricAcid', header: 'Лимонная кислота (ммоль/л)' },
      { key: 'carotene', header: 'Каротин (мкмоль/л)' },
      { key: 'vitaminA', header: 'Витамин A (мкмоль/л)' },
      { key: 'vitaminC', header: 'Витамин C (мкмоль/л)' },
      { key: 'organicPhosphorus', header: 'Органический фосфор (ммоль/л)' },
      { key: 'totalCalcium', header: 'Общий кальций (ммоль/л)' },
      { key: 'creatine', header: 'Креатин (ммоль/л)' },
      { key: 'copper', header: 'Медь (ммоль/л)' },
      { key: 'zinc', header: 'Цинк (ммоль/л)' },
      { key: 'manganese', header: 'Марганец (ммоль/л)' },
      { key: 'cobalt', header: 'Кобальт (ммоль/л)' },
      { key: 'vitaminB', header: 'Витамин B' },
      { key: 'conclusion', header: 'Заключение' },
    ]);
    return await this.bloodExamService.importFromExcel(rows);
  }

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

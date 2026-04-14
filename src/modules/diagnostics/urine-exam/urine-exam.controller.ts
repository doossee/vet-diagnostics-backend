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
  constructor(
    private readonly urineExamService: UrineExamService,
    private readonly excelService: ExcelService,
  ) {}

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
  @ApiOperation({ summary: 'Download Excel import template for urine exam' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename="анализ-мочи-шаблон.xlsx"',
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
        {
          key: 'urineColorId',
          header: 'ID цвета мочи',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'urineSmellId',
          header: 'ID запаха мочи',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'urineClarityId',
          header: 'ID прозрачности мочи',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'urineConsistencyId',
          header: 'ID консистенции мочи',
          example: 'uuid-here',
          width: 38,
        },
        { key: 'ph', header: 'pH (среда)', example: 6.5 },
        { key: 'acetone', header: 'Ацетон (ммоль/л)', example: 0.1 },
        { key: 'protein', header: 'Белок (г/л)', example: 0.0 },
        { key: 'bilirubin', header: 'Билирубин (мкмоль/л)', example: 0.0 },
        {
          key: 'urobilinogen',
          header: 'Уробилиноген (мкмоль/л)',
          example: 3.5,
        },
        { key: 'sugar', header: 'Сахар (ммоль/л)', example: 0.0 },
        { key: 'leukocytes', header: 'Лейкоциты (кол-во)', example: 2 },
        { key: 'epithelium', header: 'Эпителий (кол-во)', example: 1 },
        {
          key: 'microbialBodies',
          header: 'Микробные тела (кол-во)',
          example: 0,
        },
        { key: 'erythrocytes', header: 'Эритроциты (кол-во)', example: 0 },
        { key: 'saltCrystals', header: 'Соли/кристаллы', example: 0 },
        { key: 'amount', header: 'Объём (л/сутки)', example: 5.0 },
      ],
      'Анализ мочи',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import urine exams from Excel file' })
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
      { key: 'urineColorId', header: 'ID цвета мочи' },
      { key: 'urineSmellId', header: 'ID запаха мочи' },
      { key: 'urineClarityId', header: 'ID прозрачности мочи' },
      { key: 'urineConsistencyId', header: 'ID консистенции мочи' },
      { key: 'ph', header: 'pH (среда)' },
      { key: 'acetone', header: 'Ацетон (ммоль/л)' },
      { key: 'protein', header: 'Белок (г/л)' },
      { key: 'bilirubin', header: 'Билирубин (мкмоль/л)' },
      { key: 'urobilinogen', header: 'Уробилиноген (мкмоль/л)' },
      { key: 'sugar', header: 'Сахар (ммоль/л)' },
      { key: 'leukocytes', header: 'Лейкоциты (кол-во)' },
      { key: 'epithelium', header: 'Эпителий (кол-во)' },
      { key: 'microbialBodies', header: 'Микробные тела (кол-во)' },
      { key: 'erythrocytes', header: 'Эритроциты (кол-во)' },
      { key: 'saltCrystals', header: 'Соли/кристаллы' },
      { key: 'amount', header: 'Объём (л/сутки)' },
    ]);
    return await this.urineExamService.importFromExcel(rows);
  }

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

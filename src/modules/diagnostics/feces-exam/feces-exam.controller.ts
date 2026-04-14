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
import { FecesExamService } from './feces-exam.service';
import {
  CreateFecesExamDto,
  UpdateFecesExamDto,
  FecesExamQueryParamsDto,
} from './dto';
import { FecesExamEntity, PaginatedFecesExamEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('feces-exams')
@Controller('feces-exams')
export class FecesExamController {
  constructor(
    private readonly fecesExamService: FecesExamService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create feces exam',
    description: 'Creates a new feces exam.',
  })
  @ApiCreatedResponse({
    type: FecesExamEntity,
    description: 'Feces exam created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateFecesExamDto) {
    return await this.fecesExamService.create(data);
  }

  @ApiOperation({
    summary: 'List feces exams',
    description: 'Retrieve paginated list of feces exams.',
  })
  @ApiOkResponse({
    type: PaginatedFecesExamEntity,
    description: 'Feces exams retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: FecesExamQueryParamsDto) {
    return await this.fecesExamService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get last feces exam by animal ID',
    description: 'Retrieve the last feces exam for a specific animal.',
  })
  @ApiOkResponse({
    type: FecesExamEntity,
    description: 'Last feces exam retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces exam not found' })
  @Get('animal/:animalId/last')
  async findLastByAnimalId(@Param('animalId', ParseUUIDPipe) animalId: string) {
    return await this.fecesExamService.findLastByAnimalId(animalId);
  }

  @ApiOperation({
    summary: 'Get feces exam by ID',
    description: 'Retrieve feces exam details.',
  })
  @ApiOkResponse({
    type: FecesExamEntity,
    description: 'Feces exam retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template for feces exam' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename="анализ-кала-шаблон.xlsx"',
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
          key: 'fecesColorId',
          header: 'ID цвета кала',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'fecesSmellId',
          header: 'ID запаха кала',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'fecesConsistencyId',
          header: 'ID консистенции кала',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'fecesFormId',
          header: 'ID формы кала',
          example: 'uuid-here',
          width: 38,
        },
        { key: 'amount', header: 'Количество (кг/сутки)', example: 15 },
        {
          key: 'undigestedFood',
          header: 'Непереваренный корм (%)',
          example: 5,
        },
      ],
      'Анализ кала',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import feces exams from Excel file' })
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
      { key: 'fecesColorId', header: 'ID цвета кала' },
      { key: 'fecesSmellId', header: 'ID запаха кала' },
      { key: 'fecesConsistencyId', header: 'ID консистенции кала' },
      { key: 'fecesFormId', header: 'ID формы кала' },
      { key: 'amount', header: 'Количество (кг/сутки)' },
      { key: 'undigestedFood', header: 'Непереваренный корм (%)' },
    ]);
    return await this.fecesExamService.importFromExcel(rows);
  }

  @ApiNotFoundResponse({ description: 'Feces exam not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesExamService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update feces exam',
    description: 'Update feces exam information by ID.',
  })
  @ApiOkResponse({
    type: FecesExamEntity,
    description: 'Feces exam updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces exam not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateFecesExamDto,
  ) {
    return await this.fecesExamService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete feces exam',
    description: 'Delete feces exam by ID.',
  })
  @ApiOkResponse({
    type: FecesExamEntity,
    description: 'Feces exam deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces exam not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesExamService.delete(id);
  }
}

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
import { FecesColorService } from './feces-color.service';
import {
  CreateFecesColorDto,
  UpdateFecesColorDto,
  FecesColorQueryParamsDto,
} from './dto';
import { FecesColorEntity, PaginatedFecesColorEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('feces-colors')
@Controller('feces-colors')
export class FecesColorController {
  constructor(
    private readonly fecesColorService: FecesColorService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create feces color',
    description: 'Creates a new feces color.',
  })
  @ApiCreatedResponse({
    type: FecesColorEntity,
    description: 'Feces color created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateFecesColorDto) {
    return await this.fecesColorService.create(data);
  }

  @ApiOperation({
    summary: 'List feces colors',
    description: 'Retrieve paginated list of feces colors.',
  })
  @ApiOkResponse({
    type: PaginatedFecesColorEntity,
    description: 'Feces colors retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: FecesColorQueryParamsDto) {
    return await this.fecesColorService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get feces color by ID',
    description: 'Retrieve feces color details.',
  })
  @ApiOkResponse({
    type: FecesColorEntity,
    description: 'Feces color retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="цвет-кала-шаблон.xlsx"')
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
    { key: 'name_ru', header: 'Название (рус)', example: 'Пример' },
    { key: 'name_uz', header: 'Название (уз)', example: 'Namuna' },
    { key: 'numericValue', header: 'Числовое значение', example: 1, width: 18 },
    { key: 'animalTypeId', header: 'ID типа животного', example: 'uuid-here', width: 38 },
  ],
      'Цвет кала',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import records from Excel file' })
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
      { key: 'name_ru', header: 'Название (рус)' },
      { key: 'name_uz', header: 'Название (уз)' },
      { key: 'numericValue', header: 'Числовое значение' },
      { key: 'animalTypeId', header: 'ID типа животного' },
    ]);
    return await this.fecesColorService.importFromExcel(rows);
  }

  @ApiNotFoundResponse({ description: 'Feces color not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesColorService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update feces color',
    description: 'Update feces color information by ID.',
  })
  @ApiOkResponse({
    type: FecesColorEntity,
    description: 'Feces color updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces color not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateFecesColorDto,
  ) {
    return await this.fecesColorService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete feces color',
    description: 'Delete feces color by ID.',
  })
  @ApiOkResponse({
    type: FecesColorEntity,
    description: 'Feces color deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces color not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesColorService.delete(id);
  }

}

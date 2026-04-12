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
import { LymphTempService } from './lymph-temp.service';
import {
  CreateLymphTempDto,
  UpdateLymphTempDto,
  LymphTempQueryParamsDto,
} from './dto';
import { LymphTempEntity, PaginatedLymphTempEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('lymph-temps')
@Controller('lymph-temps')
export class LymphTempController {
  constructor(
    private readonly service: LymphTempService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create lymph-temps',
    description: 'Creates a new lookup record.',
  })
  @ApiCreatedResponse({
    type: LymphTempEntity,
    description: 'Record created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateLymphTempDto) {
    return await this.service.create(data);
  }

  @ApiOperation({
    summary: 'List lymph-temps',
    description: 'Retrieve paginated list of lookup records.',
  })
  @ApiOkResponse({
    type: PaginatedLymphTempEntity,
    description: 'Records retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: LymphTempQueryParamsDto) {
    return await this.service.findAll(query);
  }

  @ApiOperation({
    summary: 'Get lymph-temps by ID',
    description: 'Retrieve lookup record details.',
  })
  @ApiOkResponse({
    type: LymphTempEntity,
    description: 'Record retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="температура-лимфоузлов-шаблон.xlsx"')
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
    { key: 'name_ru', header: 'Название (рус)', example: 'Пример' },
    { key: 'name_uz', header: 'Название (уз)', example: 'Namuna' },
    { key: 'numericValue', header: 'Числовое значение', example: 1, width: 18 },
  ],
      'Температура лимфоузлов',
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
    ]);
    return await this.service.importFromExcel(rows);
  }

  @ApiNotFoundResponse({ description: 'Record not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.service.findOne(id);
  }

  @ApiOperation({
    summary: 'Update lymph-temps',
    description: 'Update lookup record by ID.',
  })
  @ApiOkResponse({
    type: LymphTempEntity,
    description: 'Record updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Record not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateLymphTempDto,
  ) {
    return await this.service.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete lymph-temps',
    description: 'Delete lookup record by ID.',
  })
  @ApiOkResponse({
    type: LymphTempEntity,
    description: 'Record deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Record not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.service.delete(id);
  }

}

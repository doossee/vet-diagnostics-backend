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
import { TemperamentService } from './temperament.service';
import {
  CreateTemperamentDto,
  UpdateTemperamentDto,
  TemperamentQueryParamsDto,
} from './dto';
import { TemperamentEntity, PaginatedTemperamentEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('temperaments')
@Controller('temperaments')
export class TemperamentController {
  constructor(
    private readonly service: TemperamentService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create temperaments',
    description: 'Creates a new lookup record.',
  })
  @ApiCreatedResponse({
    type: TemperamentEntity,
    description: 'Record created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateTemperamentDto) {
    return await this.service.create(data);
  }

  @ApiOperation({
    summary: 'List temperaments',
    description: 'Retrieve paginated list of lookup records.',
  })
  @ApiOkResponse({
    type: PaginatedTemperamentEntity,
    description: 'Records retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: TemperamentQueryParamsDto) {
    return await this.service.findAll(query);
  }

  @ApiOperation({
    summary: 'Get temperaments by ID',
    description: 'Retrieve lookup record details.',
  })
  @ApiOkResponse({
    type: TemperamentEntity,
    description: 'Record retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename="темперамент-шаблон.xlsx"',
  )
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
        { key: 'name_ru', header: 'Название (рус)', example: 'Пример' },
        { key: 'name_uz', header: 'Название (уз)', example: 'Namuna' },
        {
          key: 'numericValue',
          header: 'Числовое значение',
          example: 1,
          width: 18,
        },
      ],
      'Темперамент',
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
    summary: 'Update temperaments',
    description: 'Update lookup record by ID.',
  })
  @ApiOkResponse({
    type: TemperamentEntity,
    description: 'Record updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Record not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateTemperamentDto,
  ) {
    return await this.service.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete temperaments',
    description: 'Delete lookup record by ID.',
  })
  @ApiOkResponse({
    type: TemperamentEntity,
    description: 'Record deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Record not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.service.delete(id);
  }
}

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
import { ObesityTypeService } from './obesity-type.service';
import {
  CreateObesityTypeDto,
  UpdateObesityTypeDto,
  ObesityTypeQueryParamsDto,
} from './dto';
import { ObesityTypeEntity, PaginatedObesityTypeEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('obesity-types')
@Controller('obesity-types')
export class ObesityTypeController {
  constructor(
    private readonly service: ObesityTypeService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create obesity-types',
    description: 'Creates a new lookup record.',
  })
  @ApiCreatedResponse({
    type: ObesityTypeEntity,
    description: 'Record created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateObesityTypeDto) {
    return await this.service.create(data);
  }

  @ApiOperation({
    summary: 'List obesity-types',
    description: 'Retrieve paginated list of lookup records.',
  })
  @ApiOkResponse({
    type: PaginatedObesityTypeEntity,
    description: 'Records retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: ObesityTypeQueryParamsDto) {
    return await this.service.findAll(query);
  }

  @ApiOperation({
    summary: 'Get obesity-types by ID',
    description: 'Retrieve lookup record details.',
  })
  @ApiOkResponse({
    type: ObesityTypeEntity,
    description: 'Record retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename="тип-упитанности-шаблон.xlsx"',
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
      'Типы упитанности',
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
    summary: 'Update obesity-types',
    description: 'Update lookup record by ID.',
  })
  @ApiOkResponse({
    type: ObesityTypeEntity,
    description: 'Record updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Record not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateObesityTypeDto,
  ) {
    return await this.service.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete obesity-types',
    description: 'Delete lookup record by ID.',
  })
  @ApiOkResponse({
    type: ObesityTypeEntity,
    description: 'Record deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Record not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.service.delete(id);
  }
}

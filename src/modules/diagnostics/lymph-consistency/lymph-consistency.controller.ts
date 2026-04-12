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
import { LymphConsistencyService } from './lymph-consistency.service';
import {
  CreateLymphConsistencyDto,
  UpdateLymphConsistencyDto,
  LymphConsistencyQueryParamsDto,
} from './dto';
import { LymphConsistencyEntity, PaginatedLymphConsistencyEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('lymph-consistencies')
@Controller('lymph-consistencies')
export class LymphConsistencyController {
  constructor(
    private readonly service: LymphConsistencyService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create lymph-consistencies',
    description: 'Creates a new lookup record.',
  })
  @ApiCreatedResponse({
    type: LymphConsistencyEntity,
    description: 'Record created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateLymphConsistencyDto) {
    return await this.service.create(data);
  }

  @ApiOperation({
    summary: 'List lymph-consistencies',
    description: 'Retrieve paginated list of lookup records.',
  })
  @ApiOkResponse({
    type: PaginatedLymphConsistencyEntity,
    description: 'Records retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: LymphConsistencyQueryParamsDto) {
    return await this.service.findAll(query);
  }

  @ApiOperation({
    summary: 'Get lymph-consistencies by ID',
    description: 'Retrieve lookup record details.',
  })
  @ApiOkResponse({
    type: LymphConsistencyEntity,
    description: 'Record retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="консистенция-лимфоузлов-шаблон.xlsx"')
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
    { key: 'name_ru', header: 'Название (рус)', example: 'Пример' },
    { key: 'name_uz', header: 'Название (уз)', example: 'Namuna' },
    { key: 'numericValue', header: 'Числовое значение', example: 1, width: 18 },
  ],
      'Консистенция лимфоузлов',
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
    summary: 'Update lymph-consistencies',
    description: 'Update lookup record by ID.',
  })
  @ApiOkResponse({
    type: LymphConsistencyEntity,
    description: 'Record updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Record not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateLymphConsistencyDto,
  ) {
    return await this.service.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete lymph-consistencies',
    description: 'Delete lookup record by ID.',
  })
  @ApiOkResponse({
    type: LymphConsistencyEntity,
    description: 'Record deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Record not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.service.delete(id);
  }

}

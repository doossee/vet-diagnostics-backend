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
import { FecesConsistencyService } from './feces-consistency.service';
import {
  CreateFecesConsistencyDto,
  UpdateFecesConsistencyDto,
  FecesConsistencyQueryParamsDto,
} from './dto';
import {
  FecesConsistencyEntity,
  PaginatedFecesConsistencyEntity,
} from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('feces-consistencies')
@Controller('feces-consistencies')
export class FecesConsistencyController {
  constructor(
    private readonly fecesConsistencyService: FecesConsistencyService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create feces consistency',
    description: 'Creates a new feces consistency.',
  })
  @ApiCreatedResponse({
    type: FecesConsistencyEntity,
    description: 'Feces consistency created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateFecesConsistencyDto) {
    return await this.fecesConsistencyService.create(data);
  }

  @ApiOperation({
    summary: 'List feces consistencies',
    description: 'Retrieve paginated list of feces consistencies.',
  })
  @ApiOkResponse({
    type: PaginatedFecesConsistencyEntity,
    description: 'Feces consistencies retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: FecesConsistencyQueryParamsDto) {
    return await this.fecesConsistencyService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get feces consistency by ID',
    description: 'Retrieve feces consistency details.',
  })
  @ApiOkResponse({
    type: FecesConsistencyEntity,
    description: 'Feces consistency retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename="консистенция-кала-шаблон.xlsx"',
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
        {
          key: 'animalTypeId',
          header: 'ID типа животного',
          example: 'uuid-here',
          width: 38,
        },
      ],
      'Консистенция кала',
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
    return await this.fecesConsistencyService.importFromExcel(rows);
  }

  @ApiNotFoundResponse({ description: 'Feces consistency not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesConsistencyService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update feces consistency',
    description: 'Update feces consistency information by ID.',
  })
  @ApiOkResponse({
    type: FecesConsistencyEntity,
    description: 'Feces consistency updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces consistency not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateFecesConsistencyDto,
  ) {
    return await this.fecesConsistencyService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete feces consistency',
    description: 'Delete feces consistency by ID.',
  })
  @ApiOkResponse({
    type: FecesConsistencyEntity,
    description: 'Feces consistency deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces consistency not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesConsistencyService.delete(id);
  }
}

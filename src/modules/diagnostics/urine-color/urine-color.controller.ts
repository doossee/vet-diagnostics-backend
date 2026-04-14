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
import { UrineColorService } from './urine-color.service';
import {
  CreateUrineColorDto,
  UpdateUrineColorDto,
  UrineColorQueryParamsDto,
} from './dto';
import { UrineColorEntity, PaginatedUrineColorEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('urine-colors')
@Controller('urine-colors')
export class UrineColorController {
  constructor(
    private readonly urineColorService: UrineColorService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create urine color',
    description: 'Creates a new urine color.',
  })
  @ApiCreatedResponse({
    type: UrineColorEntity,
    description: 'Urine color created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateUrineColorDto) {
    return await this.urineColorService.create(data);
  }

  @ApiOperation({
    summary: 'List urine colors',
    description: 'Retrieve paginated list of urine colors.',
  })
  @ApiOkResponse({
    type: PaginatedUrineColorEntity,
    description: 'Urine colors retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: UrineColorQueryParamsDto) {
    return await this.urineColorService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get urine color by ID',
    description: 'Retrieve urine color details.',
  })
  @ApiOkResponse({
    type: UrineColorEntity,
    description: 'Urine color retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename="цвет-мочи-шаблон.xlsx"')
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
      'Цвет мочи',
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
    return await this.urineColorService.importFromExcel(rows);
  }

  @ApiNotFoundResponse({ description: 'Urine color not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.urineColorService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update urine color',
    description: 'Update urine color information by ID.',
  })
  @ApiOkResponse({
    type: UrineColorEntity,
    description: 'Urine color updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine color not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUrineColorDto,
  ) {
    return await this.urineColorService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete urine color',
    description: 'Delete urine color by ID.',
  })
  @ApiOkResponse({
    type: UrineColorEntity,
    description: 'Urine color deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine color not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.urineColorService.delete(id);
  }
}

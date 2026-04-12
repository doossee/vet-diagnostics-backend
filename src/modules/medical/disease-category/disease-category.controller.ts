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
} from '@nestjs/swagger';
import { DiseaseCategoryService } from './disease-category.service';
import {
  CreateDiseaseCategoryDto,
  UpdateDiseaseCategoryDto,
  DiseaseCategoryQueryParamsDto,
} from './dto';
import {
  DiseaseCategoryEntity,
  PaginatedDiseaseCategoryEntity,
} from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('disease-categories')
@Controller('disease-categories')
export class DiseaseCategoryController {
  constructor(
    private readonly diseaseCategoryService: DiseaseCategoryService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: 'Create disease category' })
  @ApiCreatedResponse({ type: DiseaseCategoryEntity })
  @Post()
  async create(@Body() data: CreateDiseaseCategoryDto) {
    return await this.diseaseCategoryService.create(data);
  }

  @ApiOperation({ summary: 'List disease categories' })
  @ApiOkResponse({ type: PaginatedDiseaseCategoryEntity })
  @Get()
  async findAll(@Query() query: DiseaseCategoryQueryParamsDto) {
    return await this.diseaseCategoryService.findAll(query);
  }

  @ApiOperation({ summary: 'Download Excel import template for disease categories' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="категории-болезней-шаблон.xlsx"')
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
        { key: 'name_ru', header: 'Название (рус)', example: 'Инфекционные болезни' },
        { key: 'name_uz', header: 'Название (уз)', example: 'Yuqumli kasalliklar' },
        { key: 'parentId', header: 'ID родителя (необязат.)', example: '', width: 38 },
      ],
      'Категории болезней',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import disease categories from Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  async importFromExcel(@UploadedFile() file: Express.Multer.File) {
    const rows = await this.excelService.parseFile(file, [
      { key: 'name_ru', header: 'Название (рус)' },
      { key: 'name_uz', header: 'Название (уз)' },
      { key: 'parentId', header: 'ID родителя (необязат.)' },
    ]);
    return await this.diseaseCategoryService.importFromExcel(rows);
  }

  @ApiOperation({ summary: 'Get disease category by ID' })
  @ApiOkResponse({ type: DiseaseCategoryEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.diseaseCategoryService.findOne(id);
  }

  @ApiOperation({ summary: 'Update disease category' })
  @ApiOkResponse({ type: DiseaseCategoryEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateDiseaseCategoryDto,
  ) {
    return await this.diseaseCategoryService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete disease category' })
  @ApiOkResponse({ type: DiseaseCategoryEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.diseaseCategoryService.delete(id);
  }

}

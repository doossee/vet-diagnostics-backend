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
import { AnimalTypeService } from './animal-type.service';
import {
  CreateAnimalTypeDto,
  UpdateAnimalTypeDto,
  AnimalTypeQueryParamsDto,
  ResolveAnimalTypeDto,
} from './dto';
import { AnimalTypeEntity, PaginatedAnimalTypeEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('animal-types')
@Controller('animal-types')
export class AnimalTypeController {
  constructor(
    private readonly animalTypeService: AnimalTypeService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: 'Create animal type' })
  @ApiCreatedResponse({ type: AnimalTypeEntity })
  @Post()
  async create(@Body() data: CreateAnimalTypeDto) {
    return await this.animalTypeService.create(data);
  }

  @ApiOperation({ summary: 'List animal types' })
  @ApiOkResponse({ type: PaginatedAnimalTypeEntity })
  @Get()
  async findAll(@Query() query: AnimalTypeQueryParamsDto) {
    return await this.animalTypeService.findAll(query);
  }

  @ApiOperation({
    summary: 'Resolve leaf AnimalType from parent + sex + birth month/year',
  })
  @ApiOkResponse({ type: AnimalTypeEntity })
  @Get('resolve')
  async resolveAnimalType(@Query() query: ResolveAnimalTypeDto) {
    return await this.animalTypeService.resolveAnimalType(query);
  }

  @ApiOperation({ summary: 'Download Excel import template for animal types' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename="типы-животных-шаблон.xlsx"',
  )
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
        { key: 'name_ru', header: 'Название (рус)', example: 'Корова' },
        { key: 'name_uz', header: 'Название (уз)', example: 'Sigir' },
        { key: 'modelKey', header: 'Ключ модели', example: 'cow', width: 18 },
        { key: 'parentId', header: 'ID родителя', example: '', width: 38 },
        {
          key: 'minAgeMonths',
          header: 'Мин. возраст (мес)',
          example: 0,
          width: 16,
        },
        {
          key: 'maxAgeMonths',
          header: 'Макс. возраст (мес)',
          example: 24,
          width: 16,
        },
      ],
      'Типы животных',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import animal types from Excel file' })
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
      { key: 'modelKey', header: 'Ключ модели' },
      { key: 'parentId', header: 'ID родителя' },
      { key: 'minAgeMonths', header: 'Мин. возраст (мес)' },
      { key: 'maxAgeMonths', header: 'Макс. возраст (мес)' },
    ]);
    return await this.animalTypeService.importFromExcel(rows);
  }

  @ApiOperation({ summary: 'Get animal type by ID' })
  @ApiOkResponse({ type: AnimalTypeEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.animalTypeService.findOne(id);
  }

  @ApiOperation({ summary: 'Update animal type' })
  @ApiOkResponse({ type: AnimalTypeEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAnimalTypeDto,
  ) {
    return await this.animalTypeService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete animal type' })
  @ApiOkResponse({ type: AnimalTypeEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.animalTypeService.delete(id);
  }
}

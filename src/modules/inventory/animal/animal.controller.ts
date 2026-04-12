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
import { AnimalService } from './animal.service';
import { CreateAnimalDto, UpdateAnimalDto, AnimalQueryParamsDto } from './dto';
import { AnimalEntity, PaginatedAnimalEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('animals')
@Controller('animals')
export class AnimalController {
  constructor(
    private readonly animalService: AnimalService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: 'Create animal' })
  @ApiCreatedResponse({ type: AnimalEntity })
  @Post()
  async create(@Body() data: CreateAnimalDto) {
    return await this.animalService.create(data);
  }

  @ApiOperation({ summary: 'List animals' })
  @ApiOkResponse({ type: PaginatedAnimalEntity })
  @Get()
  async findAll(@Query() query: AnimalQueryParamsDto) {
    return await this.animalService.findAll(query);
  }

  @ApiOperation({ summary: 'Download Excel import template for animals' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename="животные-шаблон.xlsx"')
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
        {
          key: 'animalNameCode',
          header: 'Код/Имя животного',
          example: 'KOV-001',
          width: 22,
        },
        {
          key: 'arrivalDate',
          header: 'Дата поступления (ГГГГ-ММ-ДД)',
          example: '2024-01-15',
          width: 22,
        },
        { key: 'birthYear', header: 'Год рождения', example: 2022, width: 14 },
        {
          key: 'birthMonth',
          header: 'Месяц рождения (1-12)',
          example: 6,
          width: 18,
        },
        {
          key: 'farmerId',
          header: 'ID фермера',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'animalTypeId',
          header: 'ID типа животного',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'animalBreedId',
          header: 'ID породы',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'animalColorId',
          header: 'ID масти',
          example: 'uuid-here',
          width: 38,
        },
      ],
      'Животные',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import animals from Excel file' })
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
      { key: 'animalNameCode', header: 'Код/Имя животного' },
      { key: 'arrivalDate', header: 'Дата поступления (ГГГГ-ММ-ДД)' },
      { key: 'birthYear', header: 'Год рождения' },
      { key: 'birthMonth', header: 'Месяц рождения (1-12)' },
      { key: 'farmerId', header: 'ID фермера' },
      { key: 'animalTypeId', header: 'ID типа животного' },
      { key: 'animalBreedId', header: 'ID породы' },
      { key: 'animalColorId', header: 'ID масти' },
    ]);
    return await this.animalService.importFromExcel(rows);
  }

  @ApiOperation({ summary: 'Get animal by ID' })
  @ApiOkResponse({ type: AnimalEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.animalService.findOne(id);
  }

  @ApiOperation({ summary: 'Get animal by ID' })
  @ApiOkResponse({ type: AnimalEntity })
  @ApiNotFoundResponse()
  @Get('/predict/:id')
  async findPredict(@Param('id', ParseUUIDPipe) id: string) {
    return await this.animalService.findPredict(id);
  }

  @ApiOperation({ summary: 'Update animal' })
  @ApiOkResponse({ type: AnimalEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAnimalDto,
  ) {
    return await this.animalService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete animal' })
  @ApiOkResponse({ type: AnimalEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.animalService.delete(id);
  }

}

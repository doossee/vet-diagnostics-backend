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
import { AnimalBreedService } from './animal-breed.service';
import {
  CreateAnimalBreedDto,
  UpdateAnimalBreedDto,
  AnimalBreedQueryParamsDto,
} from './dto';
import { AnimalBreedEntity, PaginatedAnimalBreedEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('breeds')
@Controller('breeds')
export class AnimalBreedController {
  constructor(
    private readonly breedService: AnimalBreedService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: 'Create breed' })
  @ApiCreatedResponse({ type: AnimalBreedEntity })
  @Post()
  async create(@Body() data: CreateAnimalBreedDto) {
    return await this.breedService.create(data);
  }

  @ApiOperation({ summary: 'List breeds' })
  @ApiOkResponse({ type: PaginatedAnimalBreedEntity })
  @Get()
  async findAll(@Query() query: AnimalBreedQueryParamsDto) {
    return await this.breedService.findAll(query);
  }

  @ApiOperation({ summary: 'Download Excel import template for animal breeds' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="породы-животных-шаблон.xlsx"')
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
        { key: 'name_ru', header: 'Название (рус)', example: 'Голштинская' },
        { key: 'name_uz', header: 'Название (уз)', example: 'Golshtin' },
      ],
      'Породы животных',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import animal breeds from Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  async importFromExcel(@UploadedFile() file: Express.Multer.File) {
    const rows = await this.excelService.parseFile(file, [
      { key: 'name_ru', header: 'Название (рус)' },
      { key: 'name_uz', header: 'Название (уз)' },
    ]);
    return await this.breedService.importFromExcel(rows);
  }

  @ApiOperation({ summary: 'Get breed by ID' })
  @ApiOkResponse({ type: AnimalBreedEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.breedService.findOne(id);
  }

  @ApiOperation({ summary: 'Update breed' })
  @ApiOkResponse({ type: AnimalBreedEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAnimalBreedDto,
  ) {
    return await this.breedService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete breed' })
  @ApiOkResponse({ type: AnimalBreedEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.breedService.delete(id);
  }

}

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
import { DiseaseService } from './disease.service';
import {
  CreateDiseaseDto,
  UpdateDiseaseDto,
  DiseaseQueryParamsDto,
} from './dto';
import { DiseaseEntity, PaginatedDiseaseEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('diseases')
@Controller('diseases')
export class DiseaseController {
  constructor(
    private readonly diseaseService: DiseaseService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: 'Create disease' })
  @ApiCreatedResponse({ type: DiseaseEntity })
  @Post()
  async create(@Body() data: CreateDiseaseDto) {
    return await this.diseaseService.create(data);
  }

  @ApiOperation({ summary: 'List diseases' })
  @ApiOkResponse({ type: PaginatedDiseaseEntity })
  @Get()
  async findAll(@Query() query: DiseaseQueryParamsDto) {
    return await this.diseaseService.findAll(query);
  }

  @ApiOperation({ summary: 'Download Excel import template for diseases' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="болезни-шаблон.xlsx"')
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
        { key: 'name_ru', header: 'Название (рус)', example: 'Ящур' },
        { key: 'name_uz', header: 'Название (уз)', example: 'Tarvaqay' },
        { key: 'diseaseCategoryId', header: 'ID категории болезни', example: 'uuid-here', width: 38 },
      ],
      'Болезни',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import diseases from Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  async importFromExcel(@UploadedFile() file: Express.Multer.File) {
    const rows = await this.excelService.parseFile(file, [
      { key: 'name_ru', header: 'Название (рус)' },
      { key: 'name_uz', header: 'Название (уз)' },
      { key: 'diseaseCategoryId', header: 'ID категории болезни' },
    ]);
    return await this.diseaseService.importFromExcel(rows);
  }

  @ApiOperation({ summary: 'Get disease by ID' })
  @ApiOkResponse({ type: DiseaseEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.diseaseService.findOne(id);
  }

  @ApiOperation({ summary: 'Update disease' })
  @ApiOkResponse({ type: DiseaseEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateDiseaseDto,
  ) {
    return await this.diseaseService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete disease' })
  @ApiOkResponse({ type: DiseaseEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.diseaseService.delete(id);
  }

}

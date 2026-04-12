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
import { ProphylaxisItemService } from './prophylaxis-item.service';
import {
  CreateProphylaxisItemDto,
  UpdateProphylaxisItemDto,
  ProphylaxisItemQueryParamsDto,
} from './dto';
import {
  ProphylaxisItemEntity,
  PaginatedProphylaxisItemEntity,
} from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('prophylaxis-items')
@Controller('prophylaxis-items')
export class ProphylaxisItemController {
  constructor(
    private readonly prophylaxisItemService: ProphylaxisItemService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: 'Create prophylaxis item' })
  @ApiCreatedResponse({ type: ProphylaxisItemEntity })
  @Post()
  async create(@Body() data: CreateProphylaxisItemDto) {
    return await this.prophylaxisItemService.create(data);
  }

  @ApiOperation({ summary: 'List prophylaxis items' })
  @ApiOkResponse({ type: PaginatedProphylaxisItemEntity })
  @Get()
  async findAll(@Query() query: ProphylaxisItemQueryParamsDto) {
    return await this.prophylaxisItemService.findAll(query);
  }

  @ApiOperation({ summary: 'Download Excel import template for prophylaxis items' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="препараты-профилактики-шаблон.xlsx"')
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
        { key: 'name_ru', header: 'Название (рус)', example: 'Вакцина ящура' },
        { key: 'name_uz', header: 'Название (уз)', example: 'Tarvaqay vaktsinasi' },
        { key: 'type', header: 'Тип (VACCINE/DEWORMING/TREATMENT)', example: 'VACCINE', width: 30 },
      ],
      'Препараты профилактики',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import prophylaxis items from Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  async importFromExcel(@UploadedFile() file: Express.Multer.File) {
    const rows = await this.excelService.parseFile(file, [
      { key: 'name_ru', header: 'Название (рус)' },
      { key: 'name_uz', header: 'Название (уз)' },
      { key: 'type', header: 'Тип (VACCINE/DEWORMING/TREATMENT)' },
    ]);
    return await this.prophylaxisItemService.importFromExcel(rows);
  }

  @ApiOperation({ summary: 'Get prophylaxis item by ID' })
  @ApiOkResponse({ type: ProphylaxisItemEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.prophylaxisItemService.findOne(id);
  }

  @ApiOperation({ summary: 'Update prophylaxis item' })
  @ApiOkResponse({ type: ProphylaxisItemEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateProphylaxisItemDto,
  ) {
    return await this.prophylaxisItemService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete prophylaxis item' })
  @ApiOkResponse({ type: ProphylaxisItemEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.prophylaxisItemService.delete(id);
  }

}

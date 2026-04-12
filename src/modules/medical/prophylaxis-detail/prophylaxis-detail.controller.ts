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
import { ProphylaxisDetailService } from './prophylaxis-detail.service';
import {
  CreateProphylaxisDetailDto,
  UpdateProphylaxisDetailDto,
  ProphylaxisDetailQueryParamsDto,
} from './dto';
import {
  ProphylaxisDetailEntity,
  PaginatedProphylaxisDetailEntity,
} from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('prophylaxis-details')
@Controller('prophylaxis-details')
export class ProphylaxisDetailController {
  constructor(
    private readonly prophylaxisDetailService: ProphylaxisDetailService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({ summary: 'Create prophylaxis detail' })
  @ApiCreatedResponse({ type: ProphylaxisDetailEntity })
  @Post()
  async create(@Body() data: CreateProphylaxisDetailDto) {
    return await this.prophylaxisDetailService.create(data);
  }

  @ApiOperation({ summary: 'List prophylaxis details' })
  @ApiOkResponse({ type: PaginatedProphylaxisDetailEntity })
  @Get()
  async findAll(@Query() query: ProphylaxisDetailQueryParamsDto) {
    return await this.prophylaxisDetailService.findAll(query);
  }

  @ApiOperation({ summary: 'Download Excel import template for prophylaxis details' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="детали-профилактики-шаблон.xlsx"')
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
        { key: 'name_ru', header: 'Название (рус)', example: 'Доза 2мл' },
        { key: 'name_uz', header: 'Название (уз)', example: '2ml doza' },
        { key: 'itemId', header: 'ID препарата', example: 'uuid-here', width: 38 },
      ],
      'Детали профилактики',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import prophylaxis details from Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  async importFromExcel(@UploadedFile() file: Express.Multer.File) {
    const rows = await this.excelService.parseFile(file, [
      { key: 'name_ru', header: 'Название (рус)' },
      { key: 'name_uz', header: 'Название (уз)' },
      { key: 'itemId', header: 'ID препарата' },
    ]);
    return await this.prophylaxisDetailService.importFromExcel(rows);
  }

  @ApiOperation({ summary: 'Get prophylaxis detail by ID' })
  @ApiOkResponse({ type: ProphylaxisDetailEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.prophylaxisDetailService.findOne(id);
  }

  @ApiOperation({ summary: 'Update prophylaxis detail' })
  @ApiOkResponse({ type: ProphylaxisDetailEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateProphylaxisDetailDto,
  ) {
    return await this.prophylaxisDetailService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete prophylaxis detail' })
  @ApiOkResponse({ type: ProphylaxisDetailEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.prophylaxisDetailService.delete(id);
  }

}

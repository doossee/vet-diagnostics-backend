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
import { MucosaAppearanceService } from './mucosa-appearance.service';
import {
  CreateMucosaAppearanceDto,
  UpdateMucosaAppearanceDto,
  MucosaAppearanceQueryParamsDto,
} from './dto';
import {
  MucosaAppearanceEntity,
  PaginatedMucosaAppearanceEntity,
} from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('mucosa-appearances')
@Controller('mucosa-appearances')
export class MucosaAppearanceController {
  constructor(
    private readonly mucosaAppearanceService: MucosaAppearanceService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create mucosa appearance',
    description: 'Creates a new mucosa appearance.',
  })
  @ApiCreatedResponse({
    type: MucosaAppearanceEntity,
    description: 'Mucosa appearance created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateMucosaAppearanceDto) {
    return await this.mucosaAppearanceService.create(data);
  }

  @ApiOperation({
    summary: 'List mucosa appearances',
    description: 'Retrieve paginated list of mucosa appearances.',
  })
  @ApiOkResponse({
    type: PaginatedMucosaAppearanceEntity,
    description: 'Mucosa appearances retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: MucosaAppearanceQueryParamsDto) {
    return await this.mucosaAppearanceService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get mucosa appearance by ID',
    description: 'Retrieve mucosa appearance details.',
  })
  @ApiOkResponse({
    type: MucosaAppearanceEntity,
    description: 'Mucosa appearance retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename="вид-слизистой-шаблон.xlsx"',
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
          key: 'mucosaTypeId',
          header: 'ID типа слизистой',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'animalTypeId',
          header: 'ID типа животного',
          example: 'uuid-here',
          width: 38,
        },
      ],
      'Вид слизистой',
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
      { key: 'mucosaTypeId', header: 'ID типа слизистой' },
      { key: 'animalTypeId', header: 'ID типа животного' },
    ]);
    return await this.mucosaAppearanceService.importFromExcel(rows);
  }

  @ApiNotFoundResponse({ description: 'Mucosa appearance not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.mucosaAppearanceService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update mucosa appearance',
    description: 'Update mucosa appearance information by ID.',
  })
  @ApiOkResponse({
    type: MucosaAppearanceEntity,
    description: 'Mucosa appearance updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Mucosa appearance not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateMucosaAppearanceDto,
  ) {
    return await this.mucosaAppearanceService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete mucosa appearance',
    description: 'Delete mucosa appearance by ID.',
  })
  @ApiOkResponse({
    type: MucosaAppearanceEntity,
    description: 'Mucosa appearance deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Mucosa appearance not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.mucosaAppearanceService.delete(id);
  }
}

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
import { FecesSmellService } from './feces-smell.service';
import {
  CreateFecesSmellDto,
  UpdateFecesSmellDto,
  FecesSmellQueryParamsDto,
} from './dto';
import { FecesSmellEntity, PaginatedFecesSmellEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('feces-smells')
@Controller('feces-smells')
export class FecesSmellController {
  constructor(
    private readonly fecesSmellService: FecesSmellService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create feces smell',
    description: 'Creates a new feces smell.',
  })
  @ApiCreatedResponse({
    type: FecesSmellEntity,
    description: 'Feces smell created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateFecesSmellDto) {
    return await this.fecesSmellService.create(data);
  }

  @ApiOperation({
    summary: 'List feces smells',
    description: 'Retrieve paginated list of feces smells.',
  })
  @ApiOkResponse({
    type: PaginatedFecesSmellEntity,
    description: 'Feces smells retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: FecesSmellQueryParamsDto) {
    return await this.fecesSmellService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get feces smell by ID',
    description: 'Retrieve feces smell details.',
  })
  @ApiOkResponse({
    type: FecesSmellEntity,
    description: 'Feces smell retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename="запах-кала-шаблон.xlsx"',
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
      'Запах кала',
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
    return await this.fecesSmellService.importFromExcel(rows);
  }

  @ApiNotFoundResponse({ description: 'Feces smell not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesSmellService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update feces smell',
    description: 'Update feces smell information by ID.',
  })
  @ApiOkResponse({
    type: FecesSmellEntity,
    description: 'Feces smell updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces smell not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateFecesSmellDto,
  ) {
    return await this.fecesSmellService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete feces smell',
    description: 'Delete feces smell by ID.',
  })
  @ApiOkResponse({
    type: FecesSmellEntity,
    description: 'Feces smell deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces smell not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesSmellService.delete(id);
  }
}

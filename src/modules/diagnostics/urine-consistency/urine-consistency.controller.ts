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
import { UrineConsistencyService } from './urine-consistency.service';
import {
  CreateUrineConsistencyDto,
  UpdateUrineConsistencyDto,
  UrineConsistencyQueryParamsDto,
} from './dto';
import {
  UrineConsistencyEntity,
  PaginatedUrineConsistencyEntity,
} from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('urine-consistencies')
@Controller('urine-consistencies')
export class UrineConsistencyController {
  constructor(
    private readonly urineConsistencyService: UrineConsistencyService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create urine consistency',
    description: 'Creates a new urine consistency.',
  })
  @ApiCreatedResponse({
    type: UrineConsistencyEntity,
    description: 'Urine consistency created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateUrineConsistencyDto) {
    return await this.urineConsistencyService.create(data);
  }

  @ApiOperation({
    summary: 'List urine consistencies',
    description: 'Retrieve paginated list of urine consistencies.',
  })
  @ApiOkResponse({
    type: PaginatedUrineConsistencyEntity,
    description: 'Urine consistencies retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: UrineConsistencyQueryParamsDto) {
    return await this.urineConsistencyService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get urine consistency by ID',
    description: 'Retrieve urine consistency details.',
  })
  @ApiOkResponse({
    type: UrineConsistencyEntity,
    description: 'Urine consistency retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="консистенция-мочи-шаблон.xlsx"')
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
    { key: 'name_ru', header: 'Название (рус)', example: 'Пример' },
    { key: 'name_uz', header: 'Название (уз)', example: 'Namuna' },
    { key: 'numericValue', header: 'Числовое значение', example: 1, width: 18 },
    { key: 'animalTypeId', header: 'ID типа животного', example: 'uuid-here', width: 38 },
  ],
      'Консистенция мочи',
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
    return await this.urineConsistencyService.importFromExcel(rows);
  }

  @ApiNotFoundResponse({ description: 'Urine consistency not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.urineConsistencyService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update urine consistency',
    description: 'Update urine consistency information by ID.',
  })
  @ApiOkResponse({
    type: UrineConsistencyEntity,
    description: 'Urine consistency updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine consistency not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUrineConsistencyDto,
  ) {
    return await this.urineConsistencyService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete urine consistency',
    description: 'Delete urine consistency by ID.',
  })
  @ApiOkResponse({
    type: UrineConsistencyEntity,
    description: 'Urine consistency deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine consistency not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.urineConsistencyService.delete(id);
  }

}

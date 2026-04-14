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
import { UrineClarityService } from './urine-clarity.service';
import {
  CreateUrineClarityDto,
  UpdateUrineClarityDto,
  UrineClarityQueryParamsDto,
} from './dto';
import { UrineClarityEntity, PaginatedUrineClarityEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('urine-clarities')
@Controller('urine-clarities')
export class UrineClarityController {
  constructor(
    private readonly urineClarityService: UrineClarityService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create urine clarity',
    description: 'Creates a new urine clarity.',
  })
  @ApiCreatedResponse({
    type: UrineClarityEntity,
    description: 'Urine clarity created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateUrineClarityDto) {
    return await this.urineClarityService.create(data);
  }

  @ApiOperation({
    summary: 'List urine clarities',
    description: 'Retrieve paginated list of urine clarities.',
  })
  @ApiOkResponse({
    type: PaginatedUrineClarityEntity,
    description: 'Urine clarities retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: UrineClarityQueryParamsDto) {
    return await this.urineClarityService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get urine clarity by ID',
    description: 'Retrieve urine clarity details.',
  })
  @ApiOkResponse({
    type: UrineClarityEntity,
    description: 'Urine clarity retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename="прозрачность-мочи-шаблон.xlsx"',
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
      'Прозрачность мочи',
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
    return await this.urineClarityService.importFromExcel(rows);
  }

  @ApiNotFoundResponse({ description: 'Urine clarity not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.urineClarityService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update urine clarity',
    description: 'Update urine clarity information by ID.',
  })
  @ApiOkResponse({
    type: UrineClarityEntity,
    description: 'Urine clarity updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine clarity not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUrineClarityDto,
  ) {
    return await this.urineClarityService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete urine clarity',
    description: 'Delete urine clarity by ID.',
  })
  @ApiOkResponse({
    type: UrineClarityEntity,
    description: 'Urine clarity deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Urine clarity not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.urineClarityService.delete(id);
  }
}

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
import { MucosaExamService } from './mucosa-exam.service';
import {
  CreateMucosaExamDto,
  UpdateMucosaExamDto,
  MucosaExamQueryParamsDto,
} from './dto';
import { MucosaExamEntity, PaginatedMucosaExamEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('mucosa-exams')
@Controller('mucosa-exams')
export class MucosaExamController {
  constructor(
    private readonly mucosaExamService: MucosaExamService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create mucosa exam',
    description: 'Creates a new mucosa exam.',
  })
  @ApiCreatedResponse({
    type: MucosaExamEntity,
    description: 'Mucosa exam created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateMucosaExamDto) {
    return await this.mucosaExamService.create(data);
  }

  @ApiOperation({
    summary: 'List mucosa exams',
    description: 'Retrieve paginated list of mucosa exams.',
  })
  @ApiOkResponse({
    type: PaginatedMucosaExamEntity,
    description: 'Mucosa exams retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: MucosaExamQueryParamsDto) {
    return await this.mucosaExamService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get last mucosa exam by animal ID',
    description: 'Retrieve the last mucosa exam for a specific animal.',
  })
  @ApiOkResponse({
    type: MucosaExamEntity,
    description: 'Last mucosa exam retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Mucosa exam not found' })
  @Get('animal/:animalId/last')
  async findLastByAnimalId(@Param('animalId', ParseUUIDPipe) animalId: string) {
    return await this.mucosaExamService.findLastByAnimalId(animalId);
  }

  @ApiOperation({
    summary: 'Get mucosa exam by ID',
    description: 'Retrieve mucosa exam details.',
  })
  @ApiOkResponse({
    type: MucosaExamEntity,
    description: 'Mucosa exam retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template for mucosa exam' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename="исследование-слизистых-шаблон.xlsx"',
  )
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
        {
          key: 'animalId',
          header: 'ID животного',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'mucosaTypeId',
          header: 'ID типа слизистой',
          example: 'uuid-here',
          width: 38,
        },
        {
          key: 'mucosaAppearanceId',
          header: 'ID вида слизистой',
          example: 'uuid-here',
          width: 38,
        },
      ],
      'Исследование слизистых',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import mucosa exams from Excel file' })
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
      { key: 'animalId', header: 'ID животного' },
      { key: 'mucosaTypeId', header: 'ID типа слизистой' },
      { key: 'mucosaAppearanceId', header: 'ID вида слизистой' },
    ]);
    return await this.mucosaExamService.importFromExcel(rows);
  }

  @ApiNotFoundResponse({ description: 'Mucosa exam not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.mucosaExamService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update mucosa exam',
    description: 'Update mucosa exam information by ID.',
  })
  @ApiOkResponse({
    type: MucosaExamEntity,
    description: 'Mucosa exam updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Mucosa exam not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateMucosaExamDto,
  ) {
    return await this.mucosaExamService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete mucosa exam',
    description: 'Delete mucosa exam by ID.',
  })
  @ApiOkResponse({
    type: MucosaExamEntity,
    description: 'Mucosa exam deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Mucosa exam not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.mucosaExamService.delete(id);
  }
}

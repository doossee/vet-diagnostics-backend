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
import { DistrictService } from './district.service';
import {
  CreateDistrictDto,
  UpdateDistrictDto,
  DistrictQueryParamsDto,
} from './dto';
import { DistrictEntity, PaginatedDistrictEntity } from './entities';
import { IsAdminUser } from 'src/shared/decorators';

@IsAdminUser()
@ApiTags('districts')
@Controller('districts')
export class DistrictController {
  constructor(
    private readonly districtService: DistrictService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create district',
    description: 'Creates a new district with Russian and Uzbek names.',
  })
  @ApiCreatedResponse({
    type: DistrictEntity,
    description: 'District created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid district data' })
  @Post()
  async create(@Body() data: CreateDistrictDto) {
    return await this.districtService.create(data);
  }

  @ApiOperation({
    summary: 'List districts',
    description:
      'Retrieve paginated list of districts with optional region filter.',
  })
  @ApiOkResponse({
    type: PaginatedDistrictEntity,
    description: 'Districts retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: DistrictQueryParamsDto) {
    return await this.districtService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get district by ID',
    description: 'Retrieve district details with nested region.',
  })
  @ApiOkResponse({
    type: DistrictEntity,
    description: 'District retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template for districts' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="районы-шаблон.xlsx"')
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
        { key: 'name_ru', header: 'Название (рус)', example: 'Юнусабад' },
        { key: 'name_uz', header: 'Название (уз)', example: 'Yunusobod' },
        { key: 'regionId', header: 'ID региона', example: 'uuid-here', width: 38 },
      ],
      'Районы',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import districts from Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  async importFromExcel(@UploadedFile() file: Express.Multer.File) {
    const rows = await this.excelService.parseFile(file, [
      { key: 'name_ru', header: 'Название (рус)' },
      { key: 'name_uz', header: 'Название (уз)' },
      { key: 'regionId', header: 'ID региона' },
    ]);
    return await this.districtService.importFromExcel(rows);
  }

  @ApiNotFoundResponse({ description: 'District not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.districtService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update district',
    description: 'Update district information by ID.',
  })
  @ApiOkResponse({
    type: DistrictEntity,
    description: 'District updated successfully',
  })
  @ApiNotFoundResponse({ description: 'District not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateDistrictDto,
  ) {
    return await this.districtService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete district',
    description: 'Delete district by ID.',
  })
  @ApiOkResponse({
    type: DistrictEntity,
    description: 'District deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'District not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.districtService.delete(id);
  }

}

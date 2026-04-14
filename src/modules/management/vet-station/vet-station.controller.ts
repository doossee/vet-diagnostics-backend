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
import { VetStationService } from './vet-station.service';
import {
  CreateVetStationDto,
  UpdateVetStationDto,
  VetStationQueryParamsDto,
} from './dto';
import { VetStationEntity, PaginatedVetStationEntity } from './entities';
import { IsAdminUser } from 'src/shared/decorators';

@IsAdminUser()
@ApiTags('vet-stations')
@Controller('vet-stations')
export class VetStationController {
  constructor(
    private readonly vetStationService: VetStationService,
    private readonly excelService: ExcelService,
  ) {}

  @ApiOperation({
    summary: 'Create vet station',
    description: 'Creates a new vet station.',
  })
  @ApiCreatedResponse({
    type: VetStationEntity,
    description: 'Vet station created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid vet station data' })
  @Post()
  async create(@Body() data: CreateVetStationDto) {
    return await this.vetStationService.create(data);
  }

  @ApiOperation({
    summary: 'List vet stations',
    description: 'Retrieve paginated list of vet stations.',
  })
  @ApiOkResponse({
    type: PaginatedVetStationEntity,
    description: 'Vet stations retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: VetStationQueryParamsDto) {
    return await this.vetStationService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get vet station by ID',
    description: 'Retrieve vet station details.',
  })
  @ApiOkResponse({
    type: VetStationEntity,
    description: 'Vet station retrieved successfully',
  })
  @ApiOperation({ summary: 'Download Excel import template for vet stations' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename="ветстанции-шаблон.xlsx"',
  )
  @Get('template')
  async downloadTemplate() {
    const buffer = await this.excelService.generateTemplate(
      [
        { key: 'name_ru', header: 'Название (рус)', example: 'Ветстанция №1' },
        { key: 'name_uz', header: 'Название (уз)', example: 'Vet stansiya №1' },
        { key: 'address', header: 'Адрес', example: 'ул. Ленина 1', width: 30 },
        {
          key: 'districtId',
          header: 'ID района',
          example: 'uuid-here',
          width: 38,
        },
      ],
      'Ветстанции',
    );
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Import vet stations from Excel file' })
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
      { key: 'address', header: 'Адрес' },
      { key: 'districtId', header: 'ID района' },
    ]);
    return await this.vetStationService.importFromExcel(rows);
  }

  @ApiNotFoundResponse({ description: 'Vet station not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.vetStationService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update vet station',
    description: 'Update vet station information by ID.',
  })
  @ApiOkResponse({
    type: VetStationEntity,
    description: 'Vet station updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Vet station not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateVetStationDto,
  ) {
    return await this.vetStationService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete vet station',
    description: 'Delete vet station by ID.',
  })
  @ApiOkResponse({
    type: VetStationEntity,
    description: 'Vet station deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Vet station not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.vetStationService.delete(id);
  }
}

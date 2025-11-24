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

@ApiTags('diseases')
@Controller('diseases')
export class DiseaseController {
  constructor(private readonly diseaseService: DiseaseService) {}

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

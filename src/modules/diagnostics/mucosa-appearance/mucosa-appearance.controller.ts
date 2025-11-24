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

@ApiTags('mucosa-appearances')
@Controller('mucosa-appearances')
export class MucosaAppearanceController {
  constructor(
    private readonly mucosaAppearanceService: MucosaAppearanceService,
  ) {}

  @ApiOperation({ summary: 'Create mucosa appearance' })
  @ApiCreatedResponse({ type: MucosaAppearanceEntity })
  @Post()
  async create(@Body() data: CreateMucosaAppearanceDto) {
    return await this.mucosaAppearanceService.create(data);
  }

  @ApiOperation({ summary: 'List mucosa appearances' })
  @ApiOkResponse({ type: PaginatedMucosaAppearanceEntity })
  @Get()
  async findAll(@Query() query: MucosaAppearanceQueryParamsDto) {
    return await this.mucosaAppearanceService.findAll(query);
  }

  @ApiOperation({ summary: 'Get mucosa appearance by ID' })
  @ApiOkResponse({ type: MucosaAppearanceEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.mucosaAppearanceService.findOne(id);
  }

  @ApiOperation({ summary: 'Update mucosa appearance' })
  @ApiOkResponse({ type: MucosaAppearanceEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateMucosaAppearanceDto,
  ) {
    return await this.mucosaAppearanceService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete mucosa appearance' })
  @ApiOkResponse({ type: MucosaAppearanceEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.mucosaAppearanceService.delete(id);
  }
}

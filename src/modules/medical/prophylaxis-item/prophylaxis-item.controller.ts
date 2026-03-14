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
import { ProphylaxisItemService } from './prophylaxis-item.service';
import {
  CreateProphylaxisItemDto,
  UpdateProphylaxisItemDto,
  ProphylaxisItemQueryParamsDto,
} from './dto';
import {
  ProphylaxisItemEntity,
  PaginatedProphylaxisItemEntity,
} from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('prophylaxis-items')
@Controller('prophylaxis-items')
export class ProphylaxisItemController {
  constructor(
    private readonly prophylaxisItemService: ProphylaxisItemService,
  ) {}

  @ApiOperation({ summary: 'Create prophylaxis item' })
  @ApiCreatedResponse({ type: ProphylaxisItemEntity })
  @Post()
  async create(@Body() data: CreateProphylaxisItemDto) {
    return await this.prophylaxisItemService.create(data);
  }

  @ApiOperation({ summary: 'List prophylaxis items' })
  @ApiOkResponse({ type: PaginatedProphylaxisItemEntity })
  @Get()
  async findAll(@Query() query: ProphylaxisItemQueryParamsDto) {
    return await this.prophylaxisItemService.findAll(query);
  }

  @ApiOperation({ summary: 'Get prophylaxis item by ID' })
  @ApiOkResponse({ type: ProphylaxisItemEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.prophylaxisItemService.findOne(id);
  }

  @ApiOperation({ summary: 'Update prophylaxis item' })
  @ApiOkResponse({ type: ProphylaxisItemEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateProphylaxisItemDto,
  ) {
    return await this.prophylaxisItemService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete prophylaxis item' })
  @ApiOkResponse({ type: ProphylaxisItemEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.prophylaxisItemService.delete(id);
  }
}

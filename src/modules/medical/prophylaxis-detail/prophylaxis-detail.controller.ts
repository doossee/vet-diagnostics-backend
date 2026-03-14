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
import { ProphylaxisDetailService } from './prophylaxis-detail.service';
import {
  CreateProphylaxisDetailDto,
  UpdateProphylaxisDetailDto,
  ProphylaxisDetailQueryParamsDto,
} from './dto';
import {
  ProphylaxisDetailEntity,
  PaginatedProphylaxisDetailEntity,
} from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('prophylaxis-details')
@Controller('prophylaxis-details')
export class ProphylaxisDetailController {
  constructor(
    private readonly prophylaxisDetailService: ProphylaxisDetailService,
  ) {}

  @ApiOperation({ summary: 'Create prophylaxis detail' })
  @ApiCreatedResponse({ type: ProphylaxisDetailEntity })
  @Post()
  async create(@Body() data: CreateProphylaxisDetailDto) {
    return await this.prophylaxisDetailService.create(data);
  }

  @ApiOperation({ summary: 'List prophylaxis details' })
  @ApiOkResponse({ type: PaginatedProphylaxisDetailEntity })
  @Get()
  async findAll(@Query() query: ProphylaxisDetailQueryParamsDto) {
    return await this.prophylaxisDetailService.findAll(query);
  }

  @ApiOperation({ summary: 'Get prophylaxis detail by ID' })
  @ApiOkResponse({ type: ProphylaxisDetailEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.prophylaxisDetailService.findOne(id);
  }

  @ApiOperation({ summary: 'Update prophylaxis detail' })
  @ApiOkResponse({ type: ProphylaxisDetailEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateProphylaxisDetailDto,
  ) {
    return await this.prophylaxisDetailService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete prophylaxis detail' })
  @ApiOkResponse({ type: ProphylaxisDetailEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.prophylaxisDetailService.delete(id);
  }
}

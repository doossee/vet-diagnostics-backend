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
import { ProphylaxisService } from './prophylaxis.service';
import {
  CreateProphylaxisDto,
  UpdateProphylaxisDto,
  ProphylaxisQueryParamsDto,
} from './dto';
import { ProphylaxisEntity, PaginatedProphylaxisEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('prophylaxis')
@Controller('prophylaxis')
export class ProphylaxisController {
  constructor(private readonly prophylaxisService: ProphylaxisService) {}

  @ApiOperation({ summary: 'Create prophylaxis record' })
  @ApiCreatedResponse({ type: ProphylaxisEntity })
  @Post()
  async create(@Body() data: CreateProphylaxisDto) {
    return await this.prophylaxisService.create(data);
  }

  @ApiOperation({ summary: 'List prophylaxis records' })
  @ApiOkResponse({ type: PaginatedProphylaxisEntity })
  @Get()
  async findAll(@Query() query: ProphylaxisQueryParamsDto) {
    return await this.prophylaxisService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get last prophylaxis by animal ID',
    description: 'Retrieve the last prophylaxis record for a specific animal.',
  })
  @ApiOkResponse({
    type: ProphylaxisEntity,
    description: 'Last prophylaxis record retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Prophylaxis record not found' })
  @Get('animal/:animalId/last')
  async findLastByAnimalId(@Param('animalId', ParseUUIDPipe) animalId: string) {
    return await this.prophylaxisService.findLastByAnimalId(animalId);
  }

  @ApiOperation({ summary: 'Get prophylaxis by ID' })
  @ApiOkResponse({ type: ProphylaxisEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.prophylaxisService.findOne(id);
  }

  @ApiOperation({ summary: 'Update prophylaxis' })
  @ApiOkResponse({ type: ProphylaxisEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateProphylaxisDto,
  ) {
    return await this.prophylaxisService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete prophylaxis' })
  @ApiOkResponse({ type: ProphylaxisEntity })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.prophylaxisService.delete(id);
  }
}

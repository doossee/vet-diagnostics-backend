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
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UrineClarityService } from './urine-clarity.service';
import {
  CreateUrineClarityDto,
  UpdateUrineClarityDto,
  UrineClarityQueryParamsDto,
} from './dto';
import { UrineClarityEntity, PaginatedUrineClarityEntity } from './entities';

@ApiTags('urine-clarities')
@Controller('urine-clarities')
export class UrineClarityController {
  constructor(private readonly urineClarityService: UrineClarityService) {}

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

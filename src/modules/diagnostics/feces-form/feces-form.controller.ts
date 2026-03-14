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
import { FecesFormService } from './feces-form.service';
import {
  CreateFecesFormDto,
  UpdateFecesFormDto,
  FecesFormQueryParamsDto,
} from './dto';
import { FecesFormEntity, PaginatedFecesFormEntity } from './entities';
import { IsAuthenticated } from 'src/shared/decorators';

@IsAuthenticated()
@ApiTags('feces-forms')
@Controller('feces-forms')
export class FecesFormController {
  constructor(private readonly fecesFormService: FecesFormService) {}

  @ApiOperation({
    summary: 'Create feces form',
    description: 'Creates a new feces form.',
  })
  @ApiCreatedResponse({
    type: FecesFormEntity,
    description: 'Feces form created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateFecesFormDto) {
    return await this.fecesFormService.create(data);
  }

  @ApiOperation({
    summary: 'List feces forms',
    description: 'Retrieve paginated list of feces forms.',
  })
  @ApiOkResponse({
    type: PaginatedFecesFormEntity,
    description: 'Feces forms retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: FecesFormQueryParamsDto) {
    return await this.fecesFormService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get feces form by ID',
    description: 'Retrieve feces form details.',
  })
  @ApiOkResponse({
    type: FecesFormEntity,
    description: 'Feces form retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces form not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesFormService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update feces form',
    description: 'Update feces form information by ID.',
  })
  @ApiOkResponse({
    type: FecesFormEntity,
    description: 'Feces form updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces form not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateFecesFormDto,
  ) {
    return await this.fecesFormService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete feces form',
    description: 'Delete feces form by ID.',
  })
  @ApiOkResponse({
    type: FecesFormEntity,
    description: 'Feces form deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Feces form not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.fecesFormService.delete(id);
  }
}

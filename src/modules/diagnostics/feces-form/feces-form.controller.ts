import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FecesFormService } from './feces-form.service';
import { CreateFecesFormDto } from './dto/create-feces-form.dto';
import { UpdateFecesFormDto } from './dto/update-feces-form.dto';
import { FecesFormEntity } from './entities/feces-form.entity';

@ApiTags('Feces Forms')
@Controller('feces-forms')
export class FecesFormController {
  constructor(private readonly fecesFormService: FecesFormService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new feces form' })
  @ApiResponse({
    status: 201,
    description: 'The feces form has been successfully created.',
    type: FecesFormEntity,
  })
  create(@Body() createFecesFormDto: CreateFecesFormDto) {
    return this.fecesFormService.create(createFecesFormDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feces forms' })
  @ApiResponse({
    status: 200,
    description: 'Return all feces forms.',
    type: [FecesFormEntity],
  })
  findAll() {
    return this.fecesFormService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a feces form by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the feces form.',
    type: FecesFormEntity,
  })
  @ApiResponse({ status: 404, description: 'Feces form not found.' })
  findOne(@Param('id') id: string) {
    return this.fecesFormService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a feces form' })
  @ApiResponse({
    status: 200,
    description: 'The feces form has been successfully updated.',
    type: FecesFormEntity,
  })
  @ApiResponse({ status: 404, description: 'Feces form not found.' })
  update(
    @Param('id') id: string,
    @Body() updateFecesFormDto: UpdateFecesFormDto,
  ) {
    return this.fecesFormService.update(id, updateFecesFormDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a feces form' })
  @ApiResponse({
    status: 200,
    description: 'The feces form has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Feces form not found.' })
  remove(@Param('id') id: string) {
    return this.fecesFormService.remove(id);
  }
}

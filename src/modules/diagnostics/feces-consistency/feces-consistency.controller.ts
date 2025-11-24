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
import { FecesConsistencyService } from './feces-consistency.service';
import { CreateFecesConsistencyDto } from './dto/create-feces-consistency.dto';
import { UpdateFecesConsistencyDto } from './dto/update-feces-consistency.dto';
import { FecesConsistencyEntity } from './entities/feces-consistency.entity';

@ApiTags('Feces Consistencies')
@Controller('feces-consistencies')
export class FecesConsistencyController {
  constructor(
    private readonly fecesConsistencyService: FecesConsistencyService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new feces consistency' })
  @ApiResponse({
    status: 201,
    description: 'The feces consistency has been successfully created.',
    type: FecesConsistencyEntity,
  })
  create(@Body() createFecesConsistencyDto: CreateFecesConsistencyDto) {
    return this.fecesConsistencyService.create(createFecesConsistencyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feces consistencies' })
  @ApiResponse({
    status: 200,
    description: 'Return all feces consistencies.',
    type: [FecesConsistencyEntity],
  })
  findAll() {
    return this.fecesConsistencyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a feces consistency by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the feces consistency.',
    type: FecesConsistencyEntity,
  })
  @ApiResponse({ status: 404, description: 'Feces consistency not found.' })
  findOne(@Param('id') id: string) {
    return this.fecesConsistencyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a feces consistency' })
  @ApiResponse({
    status: 200,
    description: 'The feces consistency has been successfully updated.',
    type: FecesConsistencyEntity,
  })
  @ApiResponse({ status: 404, description: 'Feces consistency not found.' })
  update(
    @Param('id') id: string,
    @Body() updateFecesConsistencyDto: UpdateFecesConsistencyDto,
  ) {
    return this.fecesConsistencyService.update(id, updateFecesConsistencyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a feces consistency' })
  @ApiResponse({
    status: 200,
    description: 'The feces consistency has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Feces consistency not found.' })
  remove(@Param('id') id: string) {
    return this.fecesConsistencyService.remove(id);
  }
}

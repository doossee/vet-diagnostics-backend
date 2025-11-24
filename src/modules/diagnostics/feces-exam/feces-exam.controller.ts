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
import { FecesExamService } from './feces-exam.service';
import { CreateFecesExamDto } from './dto/create-feces-exam.dto';
import { UpdateFecesExamDto } from './dto/update-feces-exam.dto';
import { FecesExamEntity } from './entities/feces-exam.entity';

@ApiTags('Feces Exams')
@Controller('feces-exams')
export class FecesExamController {
  constructor(private readonly fecesExamService: FecesExamService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new feces exam' })
  @ApiResponse({
    status: 201,
    description: 'The feces exam has been successfully created.',
    type: FecesExamEntity,
  })
  create(@Body() createFecesExamDto: CreateFecesExamDto) {
    return this.fecesExamService.create(createFecesExamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feces exams' })
  @ApiResponse({
    status: 200,
    description: 'Return all feces exams.',
    type: [FecesExamEntity],
  })
  findAll() {
    return this.fecesExamService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a feces exam by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the feces exam.',
    type: FecesExamEntity,
  })
  @ApiResponse({ status: 404, description: 'Feces exam not found.' })
  findOne(@Param('id') id: string) {
    return this.fecesExamService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a feces exam' })
  @ApiResponse({
    status: 200,
    description: 'The feces exam has been successfully updated.',
    type: FecesExamEntity,
  })
  @ApiResponse({ status: 404, description: 'Feces exam not found.' })
  update(
    @Param('id') id: string,
    @Body() updateFecesExamDto: UpdateFecesExamDto,
  ) {
    return this.fecesExamService.update(id, updateFecesExamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a feces exam' })
  @ApiResponse({
    status: 200,
    description: 'The feces exam has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Feces exam not found.' })
  remove(@Param('id') id: string) {
    return this.fecesExamService.remove(id);
  }
}

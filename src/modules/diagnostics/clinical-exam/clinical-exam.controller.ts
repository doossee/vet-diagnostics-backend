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
import { ClinicalExamService } from './clinical-exam.service';
import { CreateClinicalExamDto } from './dto/create-clinical-exam.dto';
import { UpdateClinicalExamDto } from './dto/update-clinical-exam.dto';
import { ClinicalExamEntity } from './entities/clinical-exam.entity';

@ApiTags('Clinical Exams')
@Controller('clinical-exams')
export class ClinicalExamController {
  constructor(private readonly clinicalExamService: ClinicalExamService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new clinical exam' })
  @ApiResponse({
    status: 201,
    description: 'The clinical exam has been successfully created.',
    type: ClinicalExamEntity,
  })
  create(@Body() createClinicalExamDto: CreateClinicalExamDto) {
    return this.clinicalExamService.create(createClinicalExamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clinical exams' })
  @ApiResponse({
    status: 200,
    description: 'Return all clinical exams.',
    type: [ClinicalExamEntity],
  })
  findAll() {
    return this.clinicalExamService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a clinical exam by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the clinical exam.',
    type: ClinicalExamEntity,
  })
  @ApiResponse({ status: 404, description: 'Clinical exam not found.' })
  findOne(@Param('id') id: string) {
    return this.clinicalExamService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a clinical exam' })
  @ApiResponse({
    status: 200,
    description: 'The clinical exam has been successfully updated.',
    type: ClinicalExamEntity,
  })
  @ApiResponse({ status: 404, description: 'Clinical exam not found.' })
  update(
    @Param('id') id: string,
    @Body() updateClinicalExamDto: UpdateClinicalExamDto,
  ) {
    return this.clinicalExamService.update(id, updateClinicalExamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a clinical exam' })
  @ApiResponse({
    status: 200,
    description: 'The clinical exam has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Clinical exam not found.' })
  remove(@Param('id') id: string) {
    return this.clinicalExamService.remove(id);
  }
}

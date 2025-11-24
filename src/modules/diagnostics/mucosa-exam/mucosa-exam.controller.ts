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
import { MucosaExamService } from './mucosa-exam.service';
import { CreateMucosaExamDto } from './dto/create-mucosa-exam.dto';
import { UpdateMucosaExamDto } from './dto/update-mucosa-exam.dto';
import { MucosaExamEntity } from './entities/mucosa-exam.entity';

@ApiTags('Mucosa Exams')
@Controller('mucosa-exams')
export class MucosaExamController {
  constructor(private readonly mucosaExamService: MucosaExamService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new mucosa exam' })
  @ApiResponse({
    status: 201,
    description: 'The mucosa exam has been successfully created.',
    type: MucosaExamEntity,
  })
  create(@Body() createMucosaExamDto: CreateMucosaExamDto) {
    return this.mucosaExamService.create(createMucosaExamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all mucosa exams' })
  @ApiResponse({
    status: 200,
    description: 'Return all mucosa exams.',
    type: [MucosaExamEntity],
  })
  findAll() {
    return this.mucosaExamService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a mucosa exam by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the mucosa exam.',
    type: MucosaExamEntity,
  })
  @ApiResponse({ status: 404, description: 'Mucosa exam not found.' })
  findOne(@Param('id') id: string) {
    return this.mucosaExamService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a mucosa exam' })
  @ApiResponse({
    status: 200,
    description: 'The mucosa exam has been successfully updated.',
    type: MucosaExamEntity,
  })
  @ApiResponse({ status: 404, description: 'Mucosa exam not found.' })
  update(
    @Param('id') id: string,
    @Body() updateMucosaExamDto: UpdateMucosaExamDto,
  ) {
    return this.mucosaExamService.update(id, updateMucosaExamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a mucosa exam' })
  @ApiResponse({
    status: 200,
    description: 'The mucosa exam has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Mucosa exam not found.' })
  remove(@Param('id') id: string) {
    return this.mucosaExamService.remove(id);
  }
}

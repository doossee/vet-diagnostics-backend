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
import { UrineExamService } from './urine-exam.service';
import { CreateUrineExamDto } from './dto/create-urine-exam.dto';
import { UpdateUrineExamDto } from './dto/update-urine-exam.dto';
import { UrineExamEntity } from './entities/urine-exam.entity';

@ApiTags('Urine Exams')
@Controller('urine-exams')
export class UrineExamController {
  constructor(private readonly urineExamService: UrineExamService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new urine exam' })
  @ApiResponse({
    status: 201,
    description: 'The urine exam has been successfully created.',
    type: UrineExamEntity,
  })
  create(@Body() createUrineExamDto: CreateUrineExamDto) {
    return this.urineExamService.create(createUrineExamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all urine exams' })
  @ApiResponse({
    status: 200,
    description: 'Return all urine exams.',
    type: [UrineExamEntity],
  })
  findAll() {
    return this.urineExamService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a urine exam by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the urine exam.',
    type: UrineExamEntity,
  })
  @ApiResponse({ status: 404, description: 'Urine exam not found.' })
  findOne(@Param('id') id: string) {
    return this.urineExamService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a urine exam' })
  @ApiResponse({
    status: 200,
    description: 'The urine exam has been successfully updated.',
    type: UrineExamEntity,
  })
  @ApiResponse({ status: 404, description: 'Urine exam not found.' })
  update(
    @Param('id') id: string,
    @Body() updateUrineExamDto: UpdateUrineExamDto,
  ) {
    return this.urineExamService.update(id, updateUrineExamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a urine exam' })
  @ApiResponse({
    status: 200,
    description: 'The urine exam has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Urine exam not found.' })
  remove(@Param('id') id: string) {
    return this.urineExamService.remove(id);
  }
}

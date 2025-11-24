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
import { BloodExamService } from './blood-exam.service';
import { CreateBloodExamDto } from './dto/create-blood-exam.dto';
import { UpdateBloodExamDto } from './dto/update-blood-exam.dto';
import { BloodExamEntity } from './entities/blood-exam.entity';

@ApiTags('Blood Exams')
@Controller('blood-exams')
export class BloodExamController {
  constructor(private readonly bloodExamService: BloodExamService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blood exam' })
  @ApiResponse({
    status: 201,
    description: 'The blood exam has been successfully created.',
    type: BloodExamEntity,
  })
  create(@Body() createBloodExamDto: CreateBloodExamDto) {
    return this.bloodExamService.create(createBloodExamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blood exams' })
  @ApiResponse({
    status: 200,
    description: 'Return all blood exams.',
    type: [BloodExamEntity],
  })
  findAll() {
    return this.bloodExamService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blood exam by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the blood exam.',
    type: BloodExamEntity,
  })
  @ApiResponse({ status: 404, description: 'Blood exam not found.' })
  findOne(@Param('id') id: string) {
    return this.bloodExamService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a blood exam' })
  @ApiResponse({
    status: 200,
    description: 'The blood exam has been successfully updated.',
    type: BloodExamEntity,
  })
  @ApiResponse({ status: 404, description: 'Blood exam not found.' })
  update(
    @Param('id') id: string,
    @Body() updateBloodExamDto: UpdateBloodExamDto,
  ) {
    return this.bloodExamService.update(id, updateBloodExamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blood exam' })
  @ApiResponse({
    status: 200,
    description: 'The blood exam has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Blood exam not found.' })
  remove(@Param('id') id: string) {
    return this.bloodExamService.remove(id);
  }
}

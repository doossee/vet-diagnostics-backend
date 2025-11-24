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
import { VetStationService } from './vet-station.service';
import {
  CreateVetStationDto,
  UpdateVetStationDto,
  VetStationQueryParamsDto,
} from './dto';
import { VetStationEntity, PaginatedVetStationEntity } from './entities';

@ApiTags('vet-stations')
@Controller('vet-stations')
export class VetStationController {
  constructor(private readonly vetStationService: VetStationService) {}

  @ApiOperation({
    summary: 'Create vet station',
    description: 'Creates a new vet station.',
  })
  @ApiCreatedResponse({
    type: VetStationEntity,
    description: 'Vet station created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid vet station data' })
  @Post()
  async create(@Body() data: CreateVetStationDto) {
    return await this.vetStationService.create(data);
  }

  @ApiOperation({
    summary: 'List vet stations',
    description: 'Retrieve paginated list of vet stations.',
  })
  @ApiOkResponse({
    type: PaginatedVetStationEntity,
    description: 'Vet stations retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: VetStationQueryParamsDto) {
    return await this.vetStationService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get vet station by ID',
    description: 'Retrieve vet station details.',
  })
  @ApiOkResponse({
    type: VetStationEntity,
    description: 'Vet station retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Vet station not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.vetStationService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update vet station',
    description: 'Update vet station information by ID.',
  })
  @ApiOkResponse({
    type: VetStationEntity,
    description: 'Vet station updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Vet station not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateVetStationDto,
  ) {
    return await this.vetStationService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete vet station',
    description: 'Delete vet station by ID.',
  })
  @ApiOkResponse({
    type: VetStationEntity,
    description: 'Vet station deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Vet station not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.vetStationService.delete(id);
  }
}

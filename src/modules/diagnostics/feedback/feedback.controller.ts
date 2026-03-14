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
import { IsAuthenticated } from 'src/shared/decorators';
import { FeedbackService } from './feedback.service';
import {
  CreateFeedbackDto,
  UpdateFeedbackDto,
  FeedbackQueryParamsDto,
} from './dto';
import { FeedbackEntity, PaginatedFeedbackEntity } from './entities';

@IsAuthenticated()
@ApiTags('feedbacks')
@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @ApiOperation({
    summary: 'Create feedback',
    description: 'Leave feedback on an AI prediction result.',
  })
  @ApiCreatedResponse({
    type: FeedbackEntity,
    description: 'Feedback created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Post()
  async create(@Body() data: CreateFeedbackDto) {
    return await this.feedbackService.create(data);
  }

  @ApiOperation({
    summary: 'List feedbacks',
    description: 'Retrieve paginated list of feedbacks.',
  })
  @ApiOkResponse({
    type: PaginatedFeedbackEntity,
    description: 'Feedbacks retrieved successfully',
  })
  @Get()
  async findAll(@Query() query: FeedbackQueryParamsDto) {
    return await this.feedbackService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get feedback by ID',
    description: 'Retrieve feedback details.',
  })
  @ApiOkResponse({
    type: FeedbackEntity,
    description: 'Feedback retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Feedback not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.feedbackService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update feedback',
    description: 'Update feedback rating, comment, or suggested disease.',
  })
  @ApiOkResponse({
    type: FeedbackEntity,
    description: 'Feedback updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Feedback not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateFeedbackDto,
  ) {
    return await this.feedbackService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete feedback',
    description: 'Delete feedback by ID.',
  })
  @ApiOkResponse({
    type: FeedbackEntity,
    description: 'Feedback deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Feedback not found' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.feedbackService.delete(id);
  }
}

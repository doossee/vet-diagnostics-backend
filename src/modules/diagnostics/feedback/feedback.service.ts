import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateFeedbackDto,
  UpdateFeedbackDto,
  FeedbackQueryParamsDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';

const feedbackInclude: Prisma.FeedbackInclude = {
  prediction: true,
  veterinarian: true,
  suggestedDisease: true,
};

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateFeedbackDto) {
    return await this.prisma.feedback.create({
      data,
      include: feedbackInclude,
    });
  }

  async findAll(query: FeedbackQueryParamsDto) {
    const { page, perPage, byId, predictionId, veterinarianId } = query;

    const where: Prisma.FeedbackWhereInput = {
      ...(predictionId && { predictionId }),
      ...(veterinarianId && { veterinarianId }),
    };

    const orderBy: Prisma.FeedbackOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { createdAt: 'desc' }),
    };

    return await this.paginationService.paginate(
      this.prisma.feedback,
      { where, orderBy, include: feedbackInclude },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.feedback.findUniqueOrThrow({
      where: { id },
      include: feedbackInclude,
    });
  }

  async update(id: string, data: UpdateFeedbackDto) {
    return await this.prisma.feedback.update({
      where: { id },
      data,
      include: feedbackInclude,
    });
  }

  async delete(id: string) {
    return await this.prisma.feedback.delete({
      where: { id },
    });
  }
}

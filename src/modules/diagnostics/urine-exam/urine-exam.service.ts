import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUrineExamDto } from './dto/create-urine-exam.dto';
import { UpdateUrineExamDto } from './dto/update-urine-exam.dto';

@Injectable()
export class UrineExamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUrineExamDto: CreateUrineExamDto) {
    return this.prisma.urineExam.create({
      data: createUrineExamDto,
    });
  }

  async findAll() {
    return this.prisma.urineExam.findMany({
      include: {
        animal: true,
        urineColor: true,
        urineClarity: true,
        urineConsistency: true,
        urineSmell: true,
      },
    });
  }

  async findOne(id: string) {
    const urineExam = await this.prisma.urineExam.findUnique({
      where: { id },
      include: {
        animal: true,
        urineColor: true,
        urineClarity: true,
        urineConsistency: true,
        urineSmell: true,
      },
    });

    if (!urineExam) {
      throw new NotFoundException(`UrineExam with ID ${id} not found`);
    }

    return urineExam;
  }

  async update(id: string, updateUrineExamDto: UpdateUrineExamDto) {
    await this.findOne(id);
    return this.prisma.urineExam.update({
      where: { id },
      data: updateUrineExamDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.urineExam.delete({
      where: { id },
    });
  }
}

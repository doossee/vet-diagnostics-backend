import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateFecesExamDto } from './dto/create-feces-exam.dto';
import { UpdateFecesExamDto } from './dto/update-feces-exam.dto';

@Injectable()
export class FecesExamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFecesExamDto: CreateFecesExamDto) {
    return this.prisma.fecesExam.create({
      data: createFecesExamDto,
    });
  }

  async findAll() {
    return this.prisma.fecesExam.findMany({
      include: {
        animal: true,
        fecesColor: true,
        fecesSmell: true,
        fecesConsistency: true,
        fecesForm: true,
      },
    });
  }

  async findOne(id: string) {
    const fecesExam = await this.prisma.fecesExam.findUnique({
      where: { id },
      include: {
        animal: true,
        fecesColor: true,
        fecesSmell: true,
        fecesConsistency: true,
        fecesForm: true,
      },
    });

    if (!fecesExam) {
      throw new NotFoundException(`FecesExam with ID ${id} not found`);
    }

    return fecesExam;
  }

  async update(id: string, updateFecesExamDto: UpdateFecesExamDto) {
    await this.findOne(id);
    return this.prisma.fecesExam.update({
      where: { id },
      data: updateFecesExamDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.fecesExam.delete({
      where: { id },
    });
  }
}

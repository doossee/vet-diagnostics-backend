import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateMucosaExamDto } from './dto/create-mucosa-exam.dto';
import { UpdateMucosaExamDto } from './dto/update-mucosa-exam.dto';

@Injectable()
export class MucosaExamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMucosaExamDto: CreateMucosaExamDto) {
    return this.prisma.mucosaExam.create({
      data: createMucosaExamDto,
    });
  }

  async findAll() {
    return this.prisma.mucosaExam.findMany({
      include: {
        animal: true,
        mucosaAppearance: true,
      },
    });
  }

  async findOne(id: string) {
    const mucosaExam = await this.prisma.mucosaExam.findUnique({
      where: { id },
      include: {
        animal: true,
        mucosaAppearance: true,
      },
    });

    if (!mucosaExam) {
      throw new NotFoundException(`MucosaExam with ID ${id} not found`);
    }

    return mucosaExam;
  }

  async update(id: string, updateMucosaExamDto: UpdateMucosaExamDto) {
    await this.findOne(id);
    return this.prisma.mucosaExam.update({
      where: { id },
      data: updateMucosaExamDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.mucosaExam.delete({
      where: { id },
    });
  }
}

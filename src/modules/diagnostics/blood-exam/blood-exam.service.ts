import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateBloodExamDto } from './dto/create-blood-exam.dto';
import { UpdateBloodExamDto } from './dto/update-blood-exam.dto';

@Injectable()
export class BloodExamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBloodExamDto: CreateBloodExamDto) {
    return this.prisma.bloodExam.create({
      data: createBloodExamDto,
    });
  }

  async findAll() {
    return this.prisma.bloodExam.findMany({
      include: {
        animal: true,
      },
    });
  }

  async findOne(id: string) {
    const bloodExam = await this.prisma.bloodExam.findUnique({
      where: { id },
      include: {
        animal: true,
      },
    });

    if (!bloodExam) {
      throw new NotFoundException(`BloodExam with ID ${id} not found`);
    }

    return bloodExam;
  }

  async update(id: string, updateBloodExamDto: UpdateBloodExamDto) {
    await this.findOne(id);
    return this.prisma.bloodExam.update({
      where: { id },
      data: updateBloodExamDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.bloodExam.delete({
      where: { id },
    });
  }
}

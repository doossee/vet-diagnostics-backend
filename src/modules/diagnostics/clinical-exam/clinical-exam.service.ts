import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateClinicalExamDto } from './dto/create-clinical-exam.dto';
import { UpdateClinicalExamDto } from './dto/update-clinical-exam.dto';

@Injectable()
export class ClinicalExamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClinicalExamDto: CreateClinicalExamDto) {
    return this.prisma.clinicalExam.create({
      data: createClinicalExamDto,
    });
  }

  async findAll() {
    return this.prisma.clinicalExam.findMany({
      include: {
        animal: true,
      },
    });
  }

  async findOne(id: string) {
    const clinicalExam = await this.prisma.clinicalExam.findUnique({
      where: { id },
      include: {
        animal: true,
      },
    });

    if (!clinicalExam) {
      throw new NotFoundException(`ClinicalExam with ID ${id} not found`);
    }

    return clinicalExam;
  }

  async update(id: string, updateClinicalExamDto: UpdateClinicalExamDto) {
    await this.findOne(id);
    return this.prisma.clinicalExam.update({
      where: { id },
      data: updateClinicalExamDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.clinicalExam.delete({
      where: { id },
    });
  }
}

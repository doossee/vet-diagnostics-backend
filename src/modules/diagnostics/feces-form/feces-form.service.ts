import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateFecesFormDto } from './dto/create-feces-form.dto';
import { UpdateFecesFormDto } from './dto/update-feces-form.dto';

@Injectable()
export class FecesFormService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFecesFormDto: CreateFecesFormDto) {
    return this.prisma.fecesForm.create({
      data: createFecesFormDto,
    });
  }

  async findAll() {
    return this.prisma.fecesForm.findMany({
      include: {
        animalType: true,
      },
    });
  }

  async findOne(id: string) {
    const fecesForm = await this.prisma.fecesForm.findUnique({
      where: { id },
      include: {
        animalType: true,
      },
    });

    if (!fecesForm) {
      throw new NotFoundException(`FecesForm with ID ${id} not found`);
    }

    return fecesForm;
  }

  async update(id: string, updateFecesFormDto: UpdateFecesFormDto) {
    await this.findOne(id);
    return this.prisma.fecesForm.update({
      where: { id },
      data: updateFecesFormDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.fecesForm.delete({
      where: { id },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateFecesConsistencyDto } from './dto/create-feces-consistency.dto';
import { UpdateFecesConsistencyDto } from './dto/update-feces-consistency.dto';

@Injectable()
export class FecesConsistencyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFecesConsistencyDto: CreateFecesConsistencyDto) {
    return this.prisma.fecesConsistency.create({
      data: createFecesConsistencyDto,
    });
  }

  async findAll() {
    return this.prisma.fecesConsistency.findMany({
      include: {
        animalType: true,
      },
    });
  }

  async findOne(id: string) {
    const fecesConsistency = await this.prisma.fecesConsistency.findUnique({
      where: { id },
      include: {
        animalType: true,
      },
    });

    if (!fecesConsistency) {
      throw new NotFoundException(`FecesConsistency with ID ${id} not found`);
    }

    return fecesConsistency;
  }

  async update(
    id: string,
    updateFecesConsistencyDto: UpdateFecesConsistencyDto,
  ) {
    await this.findOne(id);
    return this.prisma.fecesConsistency.update({
      where: { id },
      data: updateFecesConsistencyDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.fecesConsistency.delete({
      where: { id },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import {
  CreateReferenceRangeDto,
  UpdateReferenceRangeDto,
  ReferenceRangeQueryDto,
} from './dto';
import { Prisma } from 'src/generated/prisma/client';
import { AlertSeverity } from 'src/shared/enums';

export interface DetectedAnomaly {
  parameter: string;
  value: number;
  minNorm: number;
  maxNorm: number;
  severity: AlertSeverity;
}

@Injectable()
export class ReferenceRangeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: CreateReferenceRangeDto) {
    return await this.prisma.referenceRange.create({
      data,
      include: { animalType: true },
    });
  }

  async findAll(query: ReferenceRangeQueryDto) {
    const { page, perPage, search, byId, animalTypeId } = query;

    const where: Prisma.ReferenceRangeWhereInput = {
      ...(animalTypeId && { animalTypeId }),
      ...(search && {
        parameter: { contains: search, mode: 'insensitive' as const },
      }),
    };

    const orderBy: Prisma.ReferenceRangeOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { parameter: 'asc' }),
    };

    return await this.paginationService.paginate(
      this.prisma.referenceRange,
      { where, orderBy, include: { animalType: true } },
      { page, perPage },
    );
  }

  async findOne(id: string) {
    return await this.prisma.referenceRange.findUniqueOrThrow({
      where: { id },
      include: { animalType: true },
    });
  }

  async update(id: string, data: UpdateReferenceRangeDto) {
    return await this.prisma.referenceRange.update({
      where: { id },
      data,
      include: { animalType: true },
    });
  }

  async delete(id: string) {
    return await this.prisma.referenceRange.delete({
      where: { id },
    });
  }

  /**
   * Core anomaly detection logic.
   *
   * Compares each provided value against the stored reference range
   * for the given animal type. Returns a list of anomalies with
   * severity calculated by deviation percentage:
   *
   * - Within range: no anomaly
   * - 0-20% outside: LOW
   * - 20-50% outside: MEDIUM
   * - 50-100% outside: HIGH
   * - >100% outside: CRITICAL
   */
  async checkAnomalies(
    animalTypeId: string,
    values: Record<string, number | null | undefined>,
  ): Promise<DetectedAnomaly[]> {
    const ranges = await this.prisma.referenceRange.findMany({
      where: { animalTypeId },
    });

    if (ranges.length === 0) {
      return [];
    }

    const rangeMap = new Map(ranges.map((r) => [r.parameter, r]));
    const anomalies: DetectedAnomaly[] = [];

    for (const [parameter, value] of Object.entries(values)) {
      if (value == null) continue;

      const range = rangeMap.get(parameter);
      if (!range) continue;

      if (value >= range.minValue && value <= range.maxValue) {
        continue; // within normal range
      }

      const rangeSpan = range.maxValue - range.minValue;
      if (rangeSpan === 0) continue;

      // Calculate how far outside the range the value is
      const deviation =
        value < range.minValue
          ? range.minValue - value
          : value - range.maxValue;

      const deviationPercent = (deviation / rangeSpan) * 100;
      const severity = this.calculateSeverity(deviationPercent);

      anomalies.push({
        parameter,
        value,
        minNorm: range.minValue,
        maxNorm: range.maxValue,
        severity,
      });
    }

    return anomalies;
  }

  private calculateSeverity(deviationPercent: number): AlertSeverity {
    if (deviationPercent <= 20) return 'LOW';
    if (deviationPercent <= 50) return 'MEDIUM';
    if (deviationPercent <= 100) return 'HIGH';
    return 'CRITICAL';
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { StatisticsQueryDto } from './dto/statistics-query.dto';
import { DISEASE_NAMES } from './constants/disease-names';

export interface DiseaseStatItem {
  diseaseIndex: string;
  diseaseName: string;
  count: number;
}

export interface OverviewStat {
  totalSessions: number;
  submittedSessions: number;
  draftSessions: number;
  readySessions: number;
  totalAnimalsExamined: number;
  mostCommonDisease: DiseaseStatItem | null;
}

export interface MonthlyTrendItem {
  period: string; // "YYYY-MM"
  total: number;
  diseases: DiseaseStatItem[];
}

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Build Prisma where clause from common query filters.
   */
  private buildSessionWhere(query: StatisticsQueryDto) {
    const { animalTypeId, startDate, endDate } = query;
    return {
      status: 'SUBMITTED' as const,
      ...(animalTypeId && {
        animal: { animalTypeId },
      }),
      ...((startDate || endDate) && {
        date: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      }),
    };
  }

  /**
   * Extract the top predicted disease index from rawOutput.
   * rawOutput is { "1": 0.82, "2": 0.03, ... } — highest value wins.
   */
  private getTopDisease(rawOutput: Record<string, number>): string | null {
    const entries = Object.entries(rawOutput);
    if (!entries.length) return null;
    const topKey = entries.reduce((best, curr) =>
      curr[1] > best[1] ? curr : best,
    )[0];
    // Model output is 0-indexed; DISEASE_NAMES is 1-indexed
    return String(Number(topKey) + 1);
  }

  /**
   * Aggregate disease counts from a list of rawOutput records.
   */
  private aggregateDiseases(
    rawOutputs: Record<string, number>[],
  ): DiseaseStatItem[] {
    const counts: Record<string, number> = {};
    for (const raw of rawOutputs) {
      const top = this.getTopDisease(raw);
      if (top) counts[top] = (counts[top] ?? 0) + 1;
    }
    return Object.entries(counts).map(([diseaseIndex, count]) => ({
      diseaseIndex,
      diseaseName: DISEASE_NAMES[diseaseIndex] ?? `Болезнь #${diseaseIndex}`,
      count,
    }));
  }

  /**
   * GET /statistics/diseases
   * How many animals are sick with each disease.
   * Returns list sorted alphabetically by disease index.
   */
  async getDiseasesByAnimals(query: StatisticsQueryDto): Promise<{
    data: DiseaseStatItem[];
    totalSessionsAnalyzed: number;
  }> {
    const sessions = await this.prisma.medicalSession.findMany({
      where: this.buildSessionWhere(query),
      select: {
        prediction: { select: { rawOutput: true } },
      },
    });

    const rawOutputs = sessions
      .map((s) => s.prediction?.rawOutput as Record<string, number> | null)
      .filter((r): r is Record<string, number> => r !== null);

    const data = this.aggregateDiseases(rawOutputs).sort(
      (a, b) => Number(a.diseaseIndex) - Number(b.diseaseIndex),
    );

    return { data, totalSessionsAnalyzed: rawOutputs.length };
  }

  /**
   * GET /statistics/diseases/chart
   * Disease frequency for charts — sorted by count descending.
   */
  async getDiseasesChart(query: StatisticsQueryDto): Promise<{
    data: DiseaseStatItem[];
    totalSessionsAnalyzed: number;
  }> {
    const sessions = await this.prisma.medicalSession.findMany({
      where: this.buildSessionWhere(query),
      select: {
        prediction: { select: { rawOutput: true } },
      },
    });

    const rawOutputs = sessions
      .map((s) => s.prediction?.rawOutput as Record<string, number> | null)
      .filter((r): r is Record<string, number> => r !== null);

    const data = this.aggregateDiseases(rawOutputs).sort(
      (a, b) => b.count - a.count,
    );

    return { data, totalSessionsAnalyzed: rawOutputs.length };
  }

  /**
   * GET /statistics/overview
   * Dashboard summary: session counts, animals examined, most common disease.
   */
  async getOverview(query: StatisticsQueryDto): Promise<OverviewStat> {
    const dateFilter = {
      ...((query.startDate || query.endDate) && {
        date: {
          ...(query.startDate && { gte: new Date(query.startDate) }),
          ...(query.endDate && {
            lte: new Date(query.endDate),
          }),
        },
      }),
    };

    const animalFilter = query.animalTypeId
      ? { animal: { animalTypeId: query.animalTypeId } }
      : {};

    const baseWhere = { ...dateFilter, ...animalFilter };

    const [totalSessions, submittedSessions, draftSessions, readySessions] =
      await Promise.all([
        this.prisma.medicalSession.count({ where: baseWhere }),
        this.prisma.medicalSession.count({
          where: { ...baseWhere, status: 'SUBMITTED' },
        }),
        this.prisma.medicalSession.count({
          where: { ...baseWhere, status: 'DRAFT' },
        }),
        this.prisma.medicalSession.count({
          where: { ...baseWhere, status: 'READY' },
        }),
      ]);

    // Unique animals with at least one submitted session in the period
    const animalsResult = await this.prisma.medicalSession.findMany({
      where: { ...baseWhere, status: 'SUBMITTED' },
      select: { animalId: true },
      distinct: ['animalId'],
    });
    const totalAnimalsExamined = animalsResult.length;

    // Most common disease among submitted sessions
    const submittedSessions2 = await this.prisma.medicalSession.findMany({
      where: { ...baseWhere, status: 'SUBMITTED' },
      select: { prediction: { select: { rawOutput: true } } },
    });

    const rawOutputs = submittedSessions2
      .map((s) => s.prediction?.rawOutput as Record<string, number> | null)
      .filter((r): r is Record<string, number> => r !== null);

    const diseaseStats = this.aggregateDiseases(rawOutputs).sort(
      (a, b) => b.count - a.count,
    );

    return {
      totalSessions,
      submittedSessions,
      draftSessions,
      readySessions,
      totalAnimalsExamined,
      mostCommonDisease: diseaseStats[0] ?? null,
    };
  }

  /**
   * GET /statistics/trends
   * Monthly disease trends — cases per disease per month.
   */
  async getMonthlyTrends(query: StatisticsQueryDto): Promise<{
    data: MonthlyTrendItem[];
  }> {
    const sessions = await this.prisma.medicalSession.findMany({
      where: this.buildSessionWhere(query),
      select: {
        date: true,
        prediction: { select: { rawOutput: true } },
      },
      orderBy: { date: 'asc' },
    });

    const byMonth: Record<
      string,
      { total: number; rawOutputs: Record<string, number>[] }
    > = {};

    for (const session of sessions) {
      const raw = session.prediction?.rawOutput as
        | Record<string, number>
        | null
        | undefined;
      if (!raw) continue;

      const period = session.date.toISOString().slice(0, 7); // "YYYY-MM"
      if (!byMonth[period]) byMonth[period] = { total: 0, rawOutputs: [] };
      byMonth[period].total += 1;
      byMonth[period].rawOutputs.push(raw);
    }

    const data: MonthlyTrendItem[] = Object.entries(byMonth).map(
      ([period, { total, rawOutputs }]) => ({
        period,
        total,
        diseases: this.aggregateDiseases(rawOutputs).sort(
          (a, b) => b.count - a.count,
        ),
      }),
    );

    return { data };
  }
}

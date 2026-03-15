import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';
import { ReferenceRangeService } from './reference-range.service';
import {
  PredictDto,
  TrendQueryDto,
  AnomalyQueryDto,
  UpdateAlertDto,
} from './dto';
import { Prisma, AlertSeverity } from 'src/generated/prisma/client';
import axios from 'axios';

/**
 * The 85 feature keys in the exact order the ML model expects them.
 * This maps DTO field names to their position in the numeric array.
 */
const FEATURE_KEYS = [
  // Physical (1-3)
  'pulse',
  'respiratoryRate',
  'temperature',
  // Whole blood (4-11)
  'erythrocyteCount',
  'leukocyteCount',
  'thrombocyteCount',
  'coe',
  'waterPercentage',
  'dryResidue',
  'glutathione',
  'hemoglobin',
  // Blood serum (12-41)
  'totalProtein',
  'albumin',
  'alphaGlobulin',
  'betaGlobulin',
  'gammaGlobulin',
  'residualNitrogen',
  'urea',
  'uricAcid',
  'creatinine',
  'alkalineReserve',
  'glucose',
  'ketoneBodies',
  'totalBilirubin',
  'directBilirubin',
  'totalCholesterol',
  'totalLipids',
  'phospholipids',
  'lacticAcid',
  'pyruvicAcid',
  'citricAcid',
  'carotene',
  'vitaminA',
  'vitaminC',
  'organicPhosphorus',
  'totalCalcium',
  'creatine',
  'copper',
  'zinc',
  'manganese',
  'cobalt',
  // Urine (42-57)
  'urineColor',
  'urineSmell',
  'urineClarity',
  'urineConsistency',
  'urinePh',
  'urineAcetone',
  'urineProtein',
  'urineBilirubin',
  'urineUrobilinogen',
  'urineSugar',
  'urineLeukocytes',
  'urineEpithelium',
  'urineMicrobialBodies',
  'urineErythrocytes',
  'urineSaltCrystals',
  'urineAmount',
  // Feces (58-63)
  'fecesSmell',
  'fecesColor',
  'fecesConsistency',
  'fecesForm',
  'fecesAmount',
  'fecesUndigestedFood',
  // Mucosa (64-67)
  'mucosaOral',
  'mucosaNasal',
  'mucosaOcular',
  'mucosaVaginal',
  // Clinical (68-85)
  'rumination',
  'obesity',
  'bodyType',
  'bodyPosition',
  'wool',
  'skinColor',
  'skinHumidity',
  'skinSmell',
  'skinTemp',
  'skinSurface',
  'skinElasticity',
  'skinSensitivity',
  'skinPainValue',
  'rumenFluidState',
  'lymphSize',
  'lymphShape',
  'lymphSurface',
  'lymphConsistency',
  'lymphTemp',
  'lymphPain',
  'lymphMobility',
] as const;

/**
 * Maps parameter names to which exam table + column they live in.
 * Used by getAnimalTrend() to know where to query historical values.
 */
const PARAMETER_SOURCE_MAP: Record<string, { table: string; column: string }> =
  {
    // Clinical exam fields
    pulse: { table: 'clinicalExam', column: 'pulse' },
    respiratoryRate: { table: 'clinicalExam', column: 'respiratoryRate' },
    temperature: { table: 'clinicalExam', column: 'temperature' },
    rumination: { table: 'clinicalExam', column: 'rumination' },
    // Blood exam fields
    erythrocyteCount: { table: 'bloodExam', column: 'erythrocyteCount' },
    leukocyteCount: { table: 'bloodExam', column: 'leukocyteCount' },
    thrombocyteCount: { table: 'bloodExam', column: 'thrombocyteCount' },
    coe: { table: 'bloodExam', column: 'coe' },
    waterPercentage: { table: 'bloodExam', column: 'waterPercentage' },
    dryResidue: { table: 'bloodExam', column: 'dryResidue' },
    glutathione: { table: 'bloodExam', column: 'glutathione' },
    hemoglobin: { table: 'bloodExam', column: 'hemoglobin' },
    totalProtein: { table: 'bloodExam', column: 'totalProtein' },
    albumin: { table: 'bloodExam', column: 'albumin' },
    alphaGlobulin: { table: 'bloodExam', column: 'alphaGlobulin' },
    betaGlobulin: { table: 'bloodExam', column: 'betaGlobulin' },
    gammaGlobulin: { table: 'bloodExam', column: 'gammaGlobulin' },
    residualNitrogen: { table: 'bloodExam', column: 'residualNitrogen' },
    urea: { table: 'bloodExam', column: 'urea' },
    uricAcid: { table: 'bloodExam', column: 'uricAcid' },
    creatinine: { table: 'bloodExam', column: 'creatinine' },
    alkalineReserve: { table: 'bloodExam', column: 'alkalineReserve' },
    glucose: { table: 'bloodExam', column: 'glucose' },
    ketoneBodies: { table: 'bloodExam', column: 'ketoneBodies' },
    totalBilirubin: { table: 'bloodExam', column: 'totalBilirubin' },
    directBilirubin: { table: 'bloodExam', column: 'directBilirubin' },
    totalCholesterol: { table: 'bloodExam', column: 'totalCholesterol' },
    totalLipids: { table: 'bloodExam', column: 'totalLipids' },
    phospholipids: { table: 'bloodExam', column: 'phospholipids' },
    lacticAcid: { table: 'bloodExam', column: 'lacticAcid' },
    pyruvicAcid: { table: 'bloodExam', column: 'pyruvicAcid' },
    citricAcid: { table: 'bloodExam', column: 'citricAcid' },
    carotene: { table: 'bloodExam', column: 'carotene' },
    vitaminA: { table: 'bloodExam', column: 'vitaminA' },
    vitaminC: { table: 'bloodExam', column: 'vitaminC' },
    organicPhosphorus: { table: 'bloodExam', column: 'organicPhosphorus' },
    totalCalcium: { table: 'bloodExam', column: 'totalCalcium' },
    creatine: { table: 'bloodExam', column: 'creatine' },
    copper: { table: 'bloodExam', column: 'copper' },
    zinc: { table: 'bloodExam', column: 'zinc' },
    manganese: { table: 'bloodExam', column: 'manganese' },
    cobalt: { table: 'bloodExam', column: 'cobalt' },
    // Urine exam fields
    urinePh: { table: 'urineExam', column: 'ph' },
    urineAcetone: { table: 'urineExam', column: 'acetone' },
    urineProtein: { table: 'urineExam', column: 'protein' },
    urineBilirubin: { table: 'urineExam', column: 'bilirubin' },
    urineUrobilinogen: { table: 'urineExam', column: 'urobilinogen' },
    urineSugar: { table: 'urineExam', column: 'sugar' },
    urineLeukocytes: { table: 'urineExam', column: 'leukocytes' },
    urineEpithelium: { table: 'urineExam', column: 'epithelium' },
    urineMicrobialBodies: { table: 'urineExam', column: 'microbialBodies' },
    urineErythrocytes: { table: 'urineExam', column: 'erythrocytes' },
    urineSaltCrystals: { table: 'urineExam', column: 'saltCrystals' },
    urineAmount: { table: 'urineExam', column: 'amount' },
    // Feces exam fields
    fecesAmount: { table: 'fecesExam', column: 'amount' },
    fecesUndigestedFood: { table: 'fecesExam', column: 'undigestedFood' },
  };

const SEVERITY_ORDER: AlertSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

@Injectable()
export class AnomalyDetectionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly referenceRangeService: ReferenceRangeService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Unified prediction endpoint.
   *
   * Flow:
   * 1. Build ordered numeric array from 85 features
   * 2. POST to ML service with animalTypeId as query param
   * 3. Check all numeric values against reference ranges → detect anomalies
   * 4. If animalId + sessionId provided, persist AnomalyAlert records
   * 5. Return predictions + anomalies + overall severity
   */
  async predict(dto: PredictDto) {
    const { animalTypeId, animalId, sessionId, ...features } = dto;

    // 1. Build ordered numeric array for the ML model
    const numericArray = FEATURE_KEYS.map((key) => {
      const val = features[key];
      return val != null ? Number(val) : null;
    });

    // 2. Call external ML prediction service
    const uri = this.config.get<string>('PREDICT_API_URI');

    let mlResponse: { data: Record<string, any> };
    try {
      mlResponse = await axios.post<Record<string, any>>(uri!, {
        params: numericArray,
        animalTypeId,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new BadRequestException(
            `AI prediction service returned error: ${error.response.status}`,
          );
        }
        throw new BadRequestException(
          'AI prediction service is unavailable. Please try again later.',
        );
      }
      throw new BadRequestException(
        'Failed to get prediction from AI service.',
      );
    }

    // 3. Check values against reference ranges for anomalies
    const numericValues: Record<string, number | null | undefined> = {};
    for (const key of FEATURE_KEYS) {
      numericValues[key] = features[key];
    }

    const anomalies = await this.referenceRangeService.checkAnomalies(
      animalTypeId,
      numericValues,
    );

    // 4. Persist anomaly alerts if we have animal + session context
    if (animalId && sessionId && anomalies.length > 0) {
      await this.prisma.anomalyAlert.createMany({
        data: anomalies.map((a) => ({
          animalId,
          sessionId,
          parameter: a.parameter,
          value: a.value,
          minNorm: a.minNorm,
          maxNorm: a.maxNorm,
          severity: a.severity,
        })),
      });
    }

    // 5. Calculate overall severity (worst among all anomalies)
    let overallSeverity = 'OK';
    if (anomalies.length > 0) {
      const worstIndex = Math.max(
        ...anomalies.map((a) => SEVERITY_ORDER.indexOf(a.severity)),
      );
      overallSeverity = SEVERITY_ORDER[worstIndex];
    }

    return {
      predictions: mlResponse.data,
      anomalies,
      overallSeverity,
      sessionId: sessionId ?? null,
    };
  }

  /**
   * 📈 Trend tracking — returns historical values of a parameter for an animal.
   *
   * Queries MedicalSession records for the animal, extracts the requested
   * parameter from the linked exam, and calculates the trend direction
   * by comparing the first and last values.
   */
  async getAnimalTrend(query: TrendQueryDto) {
    const { animalId, parameter, from, to, limit = 20 } = query;

    const source = PARAMETER_SOURCE_MAP[parameter];
    if (!source) {
      throw new BadRequestException(
        `Unknown parameter "${parameter}". Supported: ${Object.keys(PARAMETER_SOURCE_MAP).join(', ')}`,
      );
    }

    // Build date filter
    const dateFilter: Prisma.MedicalSessionWhereInput = {};
    if (from || to) {
      dateFilter.date = {};
      if (from) (dateFilter.date as any).gte = new Date(from);
      if (to) (dateFilter.date as any).lte = new Date(to);
    }

    // Query sessions with the relevant exam included
    const includeMap: Record<string, boolean> = {};
    includeMap[source.table] = true;

    const sessions = await this.prisma.medicalSession.findMany({
      where: {
        animalId,
        ...dateFilter,
        [source.table]: { isNot: null },
      },
      include: includeMap,
      orderBy: { date: 'asc' },
      take: limit,
    });

    // Extract values
    const dataPoints: { date: Date; value: number }[] = [];
    for (const session of sessions) {
      const exam = (session as any)[source.table];
      if (exam && exam[source.column] != null) {
        dataPoints.push({
          date: session.date,
          value: Number(exam[source.column]),
        });
      }
    }

    // Calculate trend direction
    let trend: 'stable' | 'increasing' | 'decreasing' = 'stable';
    let changePercent = 0;

    if (dataPoints.length >= 2) {
      const first = dataPoints[0].value;
      const last = dataPoints[dataPoints.length - 1].value;

      if (first !== 0) {
        changePercent = ((last - first) / Math.abs(first)) * 100;
      }

      // Consider >5% change as a meaningful trend
      if (changePercent > 5) trend = 'increasing';
      else if (changePercent < -5) trend = 'decreasing';
    }

    // Get unit from reference range if available
    const animal = await this.prisma.animal.findUnique({
      where: { id: animalId },
      select: { animalTypeId: true },
    });

    let unit: string | null = null;
    if (animal) {
      const range = await this.prisma.referenceRange.findUnique({
        where: {
          animalTypeId_parameter: {
            animalTypeId: animal.animalTypeId,
            parameter,
          },
        },
      });
      unit = range?.unit ?? null;
    }

    return {
      parameter,
      unit,
      dataPoints,
      trend,
      changePercent: Math.round(changePercent * 100) / 100,
    };
  }

  /**
   * 🚨 List anomaly alerts with filtering and pagination.
   */
  async getAlerts(query: AnomalyQueryDto) {
    const { page, perPage, byId, animalId, sessionId, severity, status } =
      query;

    const where: Prisma.AnomalyAlertWhereInput = {
      ...(animalId && { animalId }),
      ...(sessionId && { sessionId }),
      ...(severity && { severity }),
      ...(status && { status }),
    };

    const orderBy: Prisma.AnomalyAlertOrderByWithRelationInput = {
      ...(byId && { id: byId }),
      ...(!byId && { createdAt: 'desc' }),
    };

    return await this.paginationService.paginate(
      this.prisma.anomalyAlert,
      {
        where,
        orderBy,
        include: { animal: true, session: true },
      },
      { page, perPage },
    );
  }

  /**
   * Update alert status (ACKNOWLEDGED or RESOLVED).
   */
  async updateAlert(id: string, dto: UpdateAlertDto) {
    return await this.prisma.anomalyAlert.update({
      where: { id },
      data: { status: dto.status },
      include: { animal: true, session: true },
    });
  }

  /**
   * 🎯 Health summary for early warning.
   *
   * Returns:
   * - Count of active (unresolved) alerts by severity
   * - Overall health status:
   *   - HEALTHY: no active alerts
   *   - ATTENTION: only LOW severity alerts
   *   - WARNING: MEDIUM or HIGH alerts
   *   - CRITICAL: any CRITICAL alerts
   * - Last session date and total session count
   */
  async getAnimalHealthSummary(animalId: string) {
    // Count active alerts grouped by severity
    const activeAlerts = await this.prisma.anomalyAlert.groupBy({
      by: ['severity'],
      where: {
        animalId,
        status: { not: 'RESOLVED' },
      },
      _count: true,
    });

    const alertsBySeverity = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    let totalActive = 0;
    for (const group of activeAlerts) {
      alertsBySeverity[group.severity] = group._count;
      totalActive += group._count;
    }

    // Determine health status
    let healthStatus = 'HEALTHY';
    if (alertsBySeverity.CRITICAL > 0) healthStatus = 'CRITICAL';
    else if (alertsBySeverity.HIGH > 0 || alertsBySeverity.MEDIUM > 0)
      healthStatus = 'WARNING';
    else if (alertsBySeverity.LOW > 0) healthStatus = 'ATTENTION';

    // Last session info
    const lastSession = await this.prisma.medicalSession.findFirst({
      where: { animalId },
      orderBy: { date: 'desc' },
      select: { date: true },
    });

    const totalSessions = await this.prisma.medicalSession.count({
      where: { animalId },
    });

    return {
      animalId,
      activeAlerts: totalActive,
      alertsBySeverity,
      healthStatus,
      lastSessionDate: lastSession?.date ?? null,
      totalSessions,
    };
  }
}

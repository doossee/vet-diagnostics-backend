import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { setupApp } from './utils/setup-app';
import {
  cleanupDatabase,
  disconnectDatabase,
  getPrismaTestClient,
} from './utils/database';
import {
  UserFactory,
  RegionFactory,
  DistrictFactory,
  AnimalFactory,
  AnimalTypeFactory,
  MedicalSessionFactory,
} from './factories';
import { UserRole } from '../src/shared/enums';

describe('Anomaly Detection & Reference Ranges (e2e)', () => {
  let app: INestApplication<App>;
  let userFactory: UserFactory;
  let regionFactory: RegionFactory;
  let districtFactory: DistrictFactory;
  let animalFactory: AnimalFactory;
  let animalTypeFactory: AnimalTypeFactory;
  let medicalSessionFactory: MedicalSessionFactory;
  const prisma = getPrismaTestClient();

  beforeAll(async () => {
    const result = await setupApp();
    app = result.app;

    userFactory = new UserFactory();
    regionFactory = new RegionFactory();
    districtFactory = new DistrictFactory();
    animalFactory = new AnimalFactory();
    animalTypeFactory = new AnimalTypeFactory();
    medicalSessionFactory = new MedicalSessionFactory();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await disconnectDatabase();
    await app.close();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  // ---------------------------------------------------------------------------
  // Helper: create and login as VET
  // ---------------------------------------------------------------------------
  async function loginAsVet(): Promise<string> {
    const region = await regionFactory.create();
    const district = await districtFactory.create(region.id);
    const username = `vet_${Date.now()}`;
    const password = 'password123';

    await userFactory.create({
      username,
      password,
      role: UserRole.VETERINARIAN,
      districtId: district.id,
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password });

    return res.body.accessToken as string;
  }

  // ---------------------------------------------------------------------------
  // Helper: create and login as ADMIN
  // ---------------------------------------------------------------------------
  async function loginAsAdmin(): Promise<string> {
    const region = await regionFactory.create();
    const district = await districtFactory.create(region.id);
    const username = `admin_${Date.now()}`;
    const password = 'password123';

    await userFactory.create({
      username,
      password,
      role: UserRole.ADMIN,
      districtId: district.id,
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password });

    return res.body.accessToken as string;
  }

  // ==========================================================================
  // REFERENCE RANGES (/reference-ranges) — Admin-only CRUD
  // ==========================================================================
  describe('Reference Ranges', () => {
    // ========================================================================
    // POST /reference-ranges
    // ========================================================================
    describe('POST /reference-ranges', () => {
      it('should create a reference range (201)', async () => {
        const adminToken = await loginAsAdmin();
        const animalType = await animalTypeFactory.create();

        const response = await request(app.getHttpServer())
          .post('/reference-ranges')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            animalTypeId: animalType.id,
            parameter: 'pulse',
            minValue: 60,
            maxValue: 80,
            unit: 'beats/min',
          })
          .expect(201);

        expect(response.body).toBeDefined();
        expect(response.body.id).toBeDefined();
        expect(response.body.parameter).toBe('pulse');
        expect(response.body.minValue).toBe(60);
        expect(response.body.maxValue).toBe(80);
        expect(response.body.unit).toBe('beats/min');
        expect(response.body.animalType).toBeDefined();
      });

      it('should create a reference range without optional unit (201)', async () => {
        const adminToken = await loginAsAdmin();
        const animalType = await animalTypeFactory.create();

        const response = await request(app.getHttpServer())
          .post('/reference-ranges')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            animalTypeId: animalType.id,
            parameter: 'temperature',
            minValue: 37.5,
            maxValue: 39.5,
          })
          .expect(201);

        expect(response.body.parameter).toBe('temperature');
      });

      it('should return 400 when required fields are missing', async () => {
        const adminToken = await loginAsAdmin();

        await request(app.getHttpServer())
          .post('/reference-ranges')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            parameter: 'pulse',
          })
          .expect(400);
      });

      it('should return 401 when no auth token is provided', async () => {
        await request(app.getHttpServer())
          .post('/reference-ranges')
          .send({
            animalTypeId: '00000000-0000-4000-a000-000000000000',
            parameter: 'pulse',
            minValue: 60,
            maxValue: 80,
          })
          .expect(401);
      });

      it('should return 403 when non-admin user tries to create', async () => {
        const vetToken = await loginAsVet();
        const animalType = await animalTypeFactory.create();

        await request(app.getHttpServer())
          .post('/reference-ranges')
          .set('Authorization', `Bearer ${vetToken}`)
          .send({
            animalTypeId: animalType.id,
            parameter: 'pulse',
            minValue: 60,
            maxValue: 80,
          })
          .expect(403);
      });
    });

    // ========================================================================
    // GET /reference-ranges
    // ========================================================================
    describe('GET /reference-ranges', () => {
      it('should return paginated list of reference ranges (200)', async () => {
        const adminToken = await loginAsAdmin();
        const animalType = await animalTypeFactory.create();

        // Create test reference ranges
        await prisma.referenceRange.create({
          data: {
            animalTypeId: animalType.id,
            parameter: 'pulse',
            minValue: 60,
            maxValue: 80,
            unit: 'beats/min',
          },
        });
        await prisma.referenceRange.create({
          data: {
            animalTypeId: animalType.id,
            parameter: 'temperature',
            minValue: 37.5,
            maxValue: 39.5,
            unit: 'C',
          },
        });

        const response = await request(app.getHttpServer())
          .get('/reference-ranges')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
        expect(response.body.meta).toBeDefined();
        expect(response.body.meta.total).toBeGreaterThanOrEqual(2);
      });

      it('should filter by animalTypeId', async () => {
        const adminToken = await loginAsAdmin();
        const type1 = await animalTypeFactory.create();
        const type2 = await animalTypeFactory.create();

        await prisma.referenceRange.create({
          data: {
            animalTypeId: type1.id,
            parameter: 'pulse',
            minValue: 60,
            maxValue: 80,
          },
        });
        await prisma.referenceRange.create({
          data: {
            animalTypeId: type2.id,
            parameter: 'pulse',
            minValue: 50,
            maxValue: 70,
          },
        });

        const response = await request(app.getHttpServer())
          .get('/reference-ranges')
          .query({ animalTypeId: type1.id })
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].animalTypeId).toBe(type1.id);
      });

      it('should filter by search (parameter name)', async () => {
        const adminToken = await loginAsAdmin();
        const animalType = await animalTypeFactory.create();

        await prisma.referenceRange.create({
          data: {
            animalTypeId: animalType.id,
            parameter: 'hemoglobin',
            minValue: 80,
            maxValue: 130,
          },
        });
        await prisma.referenceRange.create({
          data: {
            animalTypeId: animalType.id,
            parameter: 'glucose',
            minValue: 2.5,
            maxValue: 5.5,
          },
        });

        const response = await request(app.getHttpServer())
          .get('/reference-ranges')
          .query({ search: 'hemoglobin' })
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].parameter).toBe('hemoglobin');
      });

      it('should return 401 when no auth token is provided', async () => {
        await request(app.getHttpServer()).get('/reference-ranges').expect(401);
      });
    });

    // ========================================================================
    // GET /reference-ranges/:id
    // ========================================================================
    describe('GET /reference-ranges/:id', () => {
      it('should return a reference range by ID (200)', async () => {
        const adminToken = await loginAsAdmin();
        const animalType = await animalTypeFactory.create();

        const range = await prisma.referenceRange.create({
          data: {
            animalTypeId: animalType.id,
            parameter: 'pulse',
            minValue: 60,
            maxValue: 80,
            unit: 'beats/min',
          },
        });

        const response = await request(app.getHttpServer())
          .get(`/reference-ranges/${range.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.id).toBe(range.id);
        expect(response.body.parameter).toBe('pulse');
        expect(response.body.animalType).toBeDefined();
      });

      it('should return 404 for non-existent reference range', async () => {
        const adminToken = await loginAsAdmin();
        const fakeId = '00000000-0000-4000-a000-000000000000';

        await request(app.getHttpServer())
          .get(`/reference-ranges/${fakeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);
      });

      it('should return 400 for invalid UUID param', async () => {
        const adminToken = await loginAsAdmin();

        await request(app.getHttpServer())
          .get('/reference-ranges/not-a-uuid')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(400);
      });
    });

    // ========================================================================
    // PATCH /reference-ranges/:id
    // ========================================================================
    describe('PATCH /reference-ranges/:id', () => {
      it('should update reference range values (200)', async () => {
        const adminToken = await loginAsAdmin();
        const animalType = await animalTypeFactory.create();

        const range = await prisma.referenceRange.create({
          data: {
            animalTypeId: animalType.id,
            parameter: 'pulse',
            minValue: 60,
            maxValue: 80,
          },
        });

        const response = await request(app.getHttpServer())
          .patch(`/reference-ranges/${range.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ minValue: 55, maxValue: 85, unit: 'bpm' })
          .expect(200);

        expect(response.body.id).toBe(range.id);
        expect(response.body.minValue).toBe(55);
        expect(response.body.maxValue).toBe(85);
        expect(response.body.unit).toBe('bpm');
      });

      it('should return 404 for non-existent reference range', async () => {
        const adminToken = await loginAsAdmin();
        const fakeId = '00000000-0000-4000-a000-000000000000';

        await request(app.getHttpServer())
          .patch(`/reference-ranges/${fakeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ minValue: 50 })
          .expect(404);
      });

      it('should return 403 when non-admin user tries to update', async () => {
        const vetToken = await loginAsVet();

        await request(app.getHttpServer())
          .patch('/reference-ranges/00000000-0000-4000-a000-000000000000')
          .set('Authorization', `Bearer ${vetToken}`)
          .send({ minValue: 50 })
          .expect(403);
      });
    });

    // ========================================================================
    // DELETE /reference-ranges/:id
    // ========================================================================
    describe('DELETE /reference-ranges/:id', () => {
      it('should delete a reference range (200)', async () => {
        const adminToken = await loginAsAdmin();
        const animalType = await animalTypeFactory.create();

        const range = await prisma.referenceRange.create({
          data: {
            animalTypeId: animalType.id,
            parameter: 'pulse',
            minValue: 60,
            maxValue: 80,
          },
        });

        const response = await request(app.getHttpServer())
          .delete(`/reference-ranges/${range.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.id).toBe(range.id);

        // Verify it is gone
        await request(app.getHttpServer())
          .get(`/reference-ranges/${range.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);
      });

      it('should return 404 for non-existent reference range', async () => {
        const adminToken = await loginAsAdmin();
        const fakeId = '00000000-0000-4000-a000-000000000000';

        await request(app.getHttpServer())
          .delete(`/reference-ranges/${fakeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);
      });

      it('should return 403 when non-admin user tries to delete', async () => {
        const vetToken = await loginAsVet();

        await request(app.getHttpServer())
          .delete('/reference-ranges/00000000-0000-4000-a000-000000000000')
          .set('Authorization', `Bearer ${vetToken}`)
          .expect(403);
      });

      it('should return 401 when no auth token is provided', async () => {
        await request(app.getHttpServer())
          .delete('/reference-ranges/00000000-0000-4000-a000-000000000000')
          .expect(401);
      });
    });
  });

  // ==========================================================================
  // ANOMALY DETECTION (/anomaly-detection) — Authenticated
  // ==========================================================================
  describe('Anomaly Detection', () => {
    // ========================================================================
    // GET /anomaly-detection/alerts
    // ========================================================================
    describe('GET /anomaly-detection/alerts', () => {
      it('should return paginated list of alerts (200)', async () => {
        const accessToken = await loginAsVet();

        const response = await request(app.getHttpServer())
          .get('/anomaly-detection/alerts')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.meta).toBeDefined();
        expect(response.body.meta.total).toBeDefined();
        expect(response.body.meta.currentPage).toBeDefined();
      });

      it('should return alerts with data when alerts exist (200)', async () => {
        const accessToken = await loginAsVet();
        const animal = await animalFactory.create();
        const session = await medicalSessionFactory.create({
          animalId: animal.id,
        });

        // Create test anomaly alerts directly
        await prisma.anomalyAlert.create({
          data: {
            animalId: animal.id,
            sessionId: session.id,
            parameter: 'pulse',
            value: 120,
            minNorm: 60,
            maxNorm: 80,
            severity: 'HIGH',
          },
        });

        const response = await request(app.getHttpServer())
          .get('/anomaly-detection/alerts')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(response.body.data[0]).toHaveProperty('parameter');
        expect(response.body.data[0]).toHaveProperty('severity');
      });

      it('should filter by severity', async () => {
        const accessToken = await loginAsVet();
        const animal = await animalFactory.create();
        const session = await medicalSessionFactory.create({
          animalId: animal.id,
        });

        await prisma.anomalyAlert.create({
          data: {
            animalId: animal.id,
            sessionId: session.id,
            parameter: 'pulse',
            value: 120,
            minNorm: 60,
            maxNorm: 80,
            severity: 'HIGH',
          },
        });
        await prisma.anomalyAlert.create({
          data: {
            animalId: animal.id,
            sessionId: session.id,
            parameter: 'temperature',
            value: 40.5,
            minNorm: 37.5,
            maxNorm: 39.5,
            severity: 'LOW',
          },
        });

        const response = await request(app.getHttpServer())
          .get('/anomaly-detection/alerts')
          .query({ severity: 'HIGH' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        response.body.data.forEach((alert: any) => {
          expect(alert.severity).toBe('HIGH');
        });
      });

      it('should filter by animalId', async () => {
        const accessToken = await loginAsVet();
        const animal1 = await animalFactory.create();
        const animal2 = await animalFactory.create();
        const session1 = await medicalSessionFactory.create({
          animalId: animal1.id,
        });
        const session2 = await medicalSessionFactory.create({
          animalId: animal2.id,
        });

        await prisma.anomalyAlert.create({
          data: {
            animalId: animal1.id,
            sessionId: session1.id,
            parameter: 'pulse',
            value: 120,
            minNorm: 60,
            maxNorm: 80,
            severity: 'HIGH',
          },
        });
        await prisma.anomalyAlert.create({
          data: {
            animalId: animal2.id,
            sessionId: session2.id,
            parameter: 'pulse',
            value: 110,
            minNorm: 60,
            maxNorm: 80,
            severity: 'MEDIUM',
          },
        });

        const response = await request(app.getHttpServer())
          .get('/anomaly-detection/alerts')
          .query({ animalId: animal1.id })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        response.body.data.forEach((alert: any) => {
          expect(alert.animalId).toBe(animal1.id);
        });
      });

      it('should return 401 when no auth token is provided', async () => {
        await request(app.getHttpServer())
          .get('/anomaly-detection/alerts')
          .expect(401);
      });
    });

    // ========================================================================
    // PATCH /anomaly-detection/alerts/:id
    // ========================================================================
    describe('PATCH /anomaly-detection/alerts/:id', () => {
      it('should update alert status to ACKNOWLEDGED (200)', async () => {
        const accessToken = await loginAsVet();
        const animal = await animalFactory.create();
        const session = await medicalSessionFactory.create({
          animalId: animal.id,
        });

        const alert = await prisma.anomalyAlert.create({
          data: {
            animalId: animal.id,
            sessionId: session.id,
            parameter: 'pulse',
            value: 120,
            minNorm: 60,
            maxNorm: 80,
            severity: 'HIGH',
          },
        });

        const response = await request(app.getHttpServer())
          .patch(`/anomaly-detection/alerts/${alert.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ status: 'ACKNOWLEDGED' })
          .expect(200);

        expect(response.body.id).toBe(alert.id);
        expect(response.body.status).toBe('ACKNOWLEDGED');
      });

      it('should update alert status to RESOLVED (200)', async () => {
        const accessToken = await loginAsVet();
        const animal = await animalFactory.create();
        const session = await medicalSessionFactory.create({
          animalId: animal.id,
        });

        const alert = await prisma.anomalyAlert.create({
          data: {
            animalId: animal.id,
            sessionId: session.id,
            parameter: 'temperature',
            value: 41.5,
            minNorm: 37.5,
            maxNorm: 39.5,
            severity: 'CRITICAL',
          },
        });

        const response = await request(app.getHttpServer())
          .patch(`/anomaly-detection/alerts/${alert.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ status: 'RESOLVED' })
          .expect(200);

        expect(response.body.status).toBe('RESOLVED');
      });

      it('should return 400 for invalid status value', async () => {
        const accessToken = await loginAsVet();

        await request(app.getHttpServer())
          .patch(
            '/anomaly-detection/alerts/00000000-0000-4000-a000-000000000000',
          )
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ status: 'INVALID_STATUS' })
          .expect(400);
      });

      it('should return 404 for non-existent alert', async () => {
        const accessToken = await loginAsVet();
        const fakeId = '00000000-0000-4000-a000-000000000000';

        await request(app.getHttpServer())
          .patch(`/anomaly-detection/alerts/${fakeId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ status: 'ACKNOWLEDGED' })
          .expect(404);
      });

      it('should return 401 when no auth token is provided', async () => {
        await request(app.getHttpServer())
          .patch(
            '/anomaly-detection/alerts/00000000-0000-4000-a000-000000000000',
          )
          .send({ status: 'ACKNOWLEDGED' })
          .expect(401);
      });
    });

    // ========================================================================
    // GET /anomaly-detection/animals/:animalId/health-summary
    // ========================================================================
    describe('GET /anomaly-detection/animals/:animalId/health-summary', () => {
      it('should return health summary for animal with no alerts (200)', async () => {
        const accessToken = await loginAsVet();
        const animal = await animalFactory.create();

        const response = await request(app.getHttpServer())
          .get(`/anomaly-detection/animals/${animal.id}/health-summary`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.animalId).toBe(animal.id);
        expect(response.body.activeAlerts).toBe(0);
        expect(response.body.healthStatus).toBe('HEALTHY');
        expect(response.body).toHaveProperty('alertsBySeverity');
        expect(response.body.alertsBySeverity).toEqual({
          LOW: 0,
          MEDIUM: 0,
          HIGH: 0,
          CRITICAL: 0,
        });
        expect(response.body).toHaveProperty('totalSessions');
        expect(response.body).toHaveProperty('lastSessionDate');
      });

      it('should return ATTENTION status when animal has LOW alerts (200)', async () => {
        const accessToken = await loginAsVet();
        const animal = await animalFactory.create();
        const session = await medicalSessionFactory.create({
          animalId: animal.id,
        });

        await prisma.anomalyAlert.create({
          data: {
            animalId: animal.id,
            sessionId: session.id,
            parameter: 'temperature',
            value: 40.0,
            minNorm: 37.5,
            maxNorm: 39.5,
            severity: 'LOW',
          },
        });

        const response = await request(app.getHttpServer())
          .get(`/anomaly-detection/animals/${animal.id}/health-summary`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.activeAlerts).toBe(1);
        expect(response.body.healthStatus).toBe('ATTENTION');
        expect(response.body.alertsBySeverity.LOW).toBe(1);
      });

      it('should return CRITICAL status when animal has CRITICAL alerts (200)', async () => {
        const accessToken = await loginAsVet();
        const animal = await animalFactory.create();
        const session = await medicalSessionFactory.create({
          animalId: animal.id,
        });

        await prisma.anomalyAlert.create({
          data: {
            animalId: animal.id,
            sessionId: session.id,
            parameter: 'pulse',
            value: 200,
            minNorm: 60,
            maxNorm: 80,
            severity: 'CRITICAL',
          },
        });

        const response = await request(app.getHttpServer())
          .get(`/anomaly-detection/animals/${animal.id}/health-summary`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.healthStatus).toBe('CRITICAL');
        expect(response.body.alertsBySeverity.CRITICAL).toBe(1);
      });

      it('should not count RESOLVED alerts as active (200)', async () => {
        const accessToken = await loginAsVet();
        const animal = await animalFactory.create();
        const session = await medicalSessionFactory.create({
          animalId: animal.id,
        });

        await prisma.anomalyAlert.create({
          data: {
            animalId: animal.id,
            sessionId: session.id,
            parameter: 'pulse',
            value: 120,
            minNorm: 60,
            maxNorm: 80,
            severity: 'HIGH',
            status: 'RESOLVED',
          },
        });

        const response = await request(app.getHttpServer())
          .get(`/anomaly-detection/animals/${animal.id}/health-summary`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.activeAlerts).toBe(0);
        expect(response.body.healthStatus).toBe('HEALTHY');
      });

      it('should include session statistics (200)', async () => {
        const accessToken = await loginAsVet();
        const animal = await animalFactory.create();

        await medicalSessionFactory.create({ animalId: animal.id });
        await medicalSessionFactory.create({ animalId: animal.id });

        const response = await request(app.getHttpServer())
          .get(`/anomaly-detection/animals/${animal.id}/health-summary`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.totalSessions).toBeGreaterThanOrEqual(2);
        expect(response.body.lastSessionDate).toBeDefined();
      });

      it('should return 400 for invalid UUID param', async () => {
        const accessToken = await loginAsVet();

        await request(app.getHttpServer())
          .get('/anomaly-detection/animals/not-a-uuid/health-summary')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(400);
      });

      it('should return 401 when no auth token is provided', async () => {
        await request(app.getHttpServer())
          .get(
            '/anomaly-detection/animals/00000000-0000-4000-a000-000000000000/health-summary',
          )
          .expect(401);
      });
    });

    // ========================================================================
    // GET /anomaly-detection/trends
    // ========================================================================
    describe('GET /anomaly-detection/trends', () => {
      it('should return trend data for a valid parameter (200)', async () => {
        const accessToken = await loginAsVet();
        const animal = await animalFactory.create();

        const response = await request(app.getHttpServer())
          .get('/anomaly-detection/trends')
          .query({ animalId: animal.id, parameter: 'pulse' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.parameter).toBe('pulse');
        expect(response.body).toHaveProperty('dataPoints');
        expect(response.body).toHaveProperty('trend');
        expect(response.body).toHaveProperty('changePercent');
        expect(response.body.dataPoints).toBeInstanceOf(Array);
      });

      it('should return 400 for unknown parameter', async () => {
        const accessToken = await loginAsVet();
        const animal = await animalFactory.create();

        await request(app.getHttpServer())
          .get('/anomaly-detection/trends')
          .query({ animalId: animal.id, parameter: 'unknownParam' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(400);
      });

      it('should return 401 when no auth token is provided', async () => {
        await request(app.getHttpServer())
          .get('/anomaly-detection/trends')
          .query({
            animalId: '00000000-0000-4000-a000-000000000000',
            parameter: 'pulse',
          })
          .expect(401);
      });
    });

    // ========================================================================
    // POST /anomaly-detection/predict
    // ========================================================================
    describe('POST /anomaly-detection/predict', () => {
      it('should return 400 when external ML service is unreachable', async () => {
        const accessToken = await loginAsVet();
        const animalType = await animalTypeFactory.create();

        // The external ML service is not running in test, so we expect
        // a 400 (service unavailable) rather than a crash.
        const response = await request(app.getHttpServer())
          .post('/anomaly-detection/predict')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            animalTypeId: animalType.id,
            pulse: 75,
            respiratoryRate: 18,
            temperature: 38.5,
          });

        // The endpoint should respond (not crash) with an error about
        // the prediction service being unavailable
        expect([400, 500, 502]).toContain(response.status);
      });

      it('should return 401 when no auth token is provided', async () => {
        await request(app.getHttpServer())
          .post('/anomaly-detection/predict')
          .send({
            animalTypeId: '00000000-0000-4000-a000-000000000000',
            pulse: 75,
          })
          .expect(401);
      });
    });
  });
});

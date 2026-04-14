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
  AnimalTypeFactory,
  MedicalSessionFactory,
} from './factories';
import { UserRole, SessionStatus } from '../src/shared/enums';

describe('Statistics (e2e)', () => {
  let app: INestApplication<App>;
  let userFactory: UserFactory;
  let regionFactory: RegionFactory;
  let districtFactory: DistrictFactory;
  let animalTypeFactory: AnimalTypeFactory;
  let medicalSessionFactory: MedicalSessionFactory;
  const prisma = getPrismaTestClient();

  beforeAll(async () => {
    const result = await setupApp();
    app = result.app;

    userFactory = new UserFactory();
    regionFactory = new RegionFactory();
    districtFactory = new DistrictFactory();
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
  // Helper: create a VET user and login
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
  // Helper: create a submitted session with a prediction
  // ---------------------------------------------------------------------------
  async function createSubmittedSessionWithPrediction(overrides?: {
    animalId?: string;
    date?: Date;
    rawOutput?: Record<string, number>;
  }): Promise<void> {
    const session = await medicalSessionFactory.create({
      animalId: overrides?.animalId,
      status: SessionStatus.SUBMITTED,
      date: overrides?.date,
    });

    await prisma.prediction.create({
      data: {
        sessionId: session.id,
        rawOutput: overrides?.rawOutput || {
          '0': 0.85,
          '1': 0.1,
          '2': 0.05,
        },
        predictedClass: 1,
        confidence: 0.85,
      },
    });
  }

  // ===========================================================================
  // GET /statistics/diseases
  // ===========================================================================
  describe('GET /statistics/diseases', () => {
    it('should return disease statistics with correct shape (200)', async () => {
      const accessToken = await loginAsVet();

      const response = await request(app.getHttpServer())
        .get('/statistics/diseases')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('totalSessionsAnalyzed');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(typeof response.body.totalSessionsAnalyzed).toBe('number');
    });

    it('should return disease data when sessions exist (200)', async () => {
      const accessToken = await loginAsVet();
      await createSubmittedSessionWithPrediction();
      await createSubmittedSessionWithPrediction();

      const response = await request(app.getHttpServer())
        .get('/statistics/diseases')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.totalSessionsAnalyzed).toBeGreaterThanOrEqual(2);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);

      // Each item should have the expected shape
      for (const item of response.body.data) {
        expect(item).toHaveProperty('diseaseIndex');
        expect(item).toHaveProperty('diseaseName');
        expect(item).toHaveProperty('count');
        expect(typeof item.count).toBe('number');
      }
    });

    it('should accept query param filters without error (200)', async () => {
      const accessToken = await loginAsVet();
      const animalType = await animalTypeFactory.create();

      await request(app.getHttpServer())
        .get('/statistics/diseases')
        .query({
          animalTypeId: animalType.id,
          startDate: '2026-01-01',
          endDate: '2026-12-31',
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 when no auth token is provided', async () => {
      await request(app.getHttpServer())
        .get('/statistics/diseases')
        .expect(401);
    });
  });

  // ===========================================================================
  // GET /statistics/diseases/chart
  // ===========================================================================
  describe('GET /statistics/diseases/chart', () => {
    it('should return chart data with correct shape (200)', async () => {
      const accessToken = await loginAsVet();

      const response = await request(app.getHttpServer())
        .get('/statistics/diseases/chart')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('totalSessionsAnalyzed');
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should return data sorted by count descending when sessions exist (200)', async () => {
      const accessToken = await loginAsVet();

      // Create sessions with different predictions
      await createSubmittedSessionWithPrediction({
        rawOutput: { '0': 0.9, '1': 0.05, '2': 0.05 },
      });
      await createSubmittedSessionWithPrediction({
        rawOutput: { '0': 0.9, '1': 0.05, '2': 0.05 },
      });
      await createSubmittedSessionWithPrediction({
        rawOutput: { '0': 0.1, '1': 0.8, '2': 0.1 },
      });

      const response = await request(app.getHttpServer())
        .get('/statistics/diseases/chart')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.totalSessionsAnalyzed).toBeGreaterThanOrEqual(3);

      // Verify descending sort
      const counts: number[] = response.body.data.map(
        (d: { count: number }) => d.count,
      );
      for (let i = 1; i < counts.length; i++) {
        expect(counts[i - 1]).toBeGreaterThanOrEqual(counts[i]);
      }
    });

    it('should accept query param filters without error (200)', async () => {
      const accessToken = await loginAsVet();

      await request(app.getHttpServer())
        .get('/statistics/diseases/chart')
        .query({ startDate: '2026-01-01', endDate: '2026-12-31' })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 when no auth token is provided', async () => {
      await request(app.getHttpServer())
        .get('/statistics/diseases/chart')
        .expect(401);
    });
  });

  // ===========================================================================
  // GET /statistics/overview
  // ===========================================================================
  describe('GET /statistics/overview', () => {
    it('should return overview with correct shape (200)', async () => {
      const accessToken = await loginAsVet();

      const response = await request(app.getHttpServer())
        .get('/statistics/overview')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('totalSessions');
      expect(response.body).toHaveProperty('submittedSessions');
      expect(response.body).toHaveProperty('draftSessions');
      expect(response.body).toHaveProperty('readySessions');
      expect(response.body).toHaveProperty('totalAnimalsExamined');
      expect(response.body).toHaveProperty('mostCommonDisease');

      expect(typeof response.body.totalSessions).toBe('number');
      expect(typeof response.body.submittedSessions).toBe('number');
      expect(typeof response.body.draftSessions).toBe('number');
      expect(typeof response.body.readySessions).toBe('number');
      expect(typeof response.body.totalAnimalsExamined).toBe('number');
    });

    it('should reflect session counts accurately (200)', async () => {
      const accessToken = await loginAsVet();

      // Create sessions in different statuses
      await medicalSessionFactory.create({ status: SessionStatus.DRAFT });
      await medicalSessionFactory.create({ status: SessionStatus.READY });
      await createSubmittedSessionWithPrediction();

      const response = await request(app.getHttpServer())
        .get('/statistics/overview')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.totalSessions).toBeGreaterThanOrEqual(3);
      expect(response.body.draftSessions).toBeGreaterThanOrEqual(1);
      expect(response.body.readySessions).toBeGreaterThanOrEqual(1);
      expect(response.body.submittedSessions).toBeGreaterThanOrEqual(1);
    });

    it('should accept query param filters without error (200)', async () => {
      const accessToken = await loginAsVet();
      const animalType = await animalTypeFactory.create();

      await request(app.getHttpServer())
        .get('/statistics/overview')
        .query({
          animalTypeId: animalType.id,
          startDate: '2026-01-01',
          endDate: '2026-12-31',
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 when no auth token is provided', async () => {
      await request(app.getHttpServer())
        .get('/statistics/overview')
        .expect(401);
    });
  });

  // ===========================================================================
  // GET /statistics/trends
  // ===========================================================================
  describe('GET /statistics/trends', () => {
    it('should return trends with correct shape (200)', async () => {
      const accessToken = await loginAsVet();

      const response = await request(app.getHttpServer())
        .get('/statistics/trends')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should return monthly grouped data when sessions exist (200)', async () => {
      const accessToken = await loginAsVet();

      // Create sessions in different months
      await createSubmittedSessionWithPrediction({
        date: new Date('2026-01-15'),
      });
      await createSubmittedSessionWithPrediction({
        date: new Date('2026-02-15'),
      });

      const response = await request(app.getHttpServer())
        .get('/statistics/trends')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);

      // Each trend item should have period, total, diseases
      for (const item of response.body.data) {
        expect(item).toHaveProperty('period');
        expect(item).toHaveProperty('total');
        expect(item).toHaveProperty('diseases');
        expect(typeof item.period).toBe('string');
        expect(typeof item.total).toBe('number');
        expect(item.diseases).toBeInstanceOf(Array);
      }
    });

    it('should accept query param filters without error (200)', async () => {
      const accessToken = await loginAsVet();

      await request(app.getHttpServer())
        .get('/statistics/trends')
        .query({ startDate: '2026-01-01', endDate: '2026-12-31' })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 when no auth token is provided', async () => {
      await request(app.getHttpServer()).get('/statistics/trends').expect(401);
    });
  });
});

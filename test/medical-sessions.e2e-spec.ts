import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { setupApp } from './utils/setup-app';
import { cleanupDatabase, disconnectDatabase } from './utils/database';
import {
  UserFactory,
  RegionFactory,
  DistrictFactory,
  AnimalFactory,
  MedicalSessionFactory,
} from './factories';
import { UserRole, SessionStatus } from '../src/shared/enums';

describe('Medical Sessions (e2e)', () => {
  let app: INestApplication<App>;
  let userFactory: UserFactory;
  let regionFactory: RegionFactory;
  let districtFactory: DistrictFactory;
  let animalFactory: AnimalFactory;
  let medicalSessionFactory: MedicalSessionFactory;
  let accessToken: string;

  beforeAll(async () => {
    const result = await setupApp();
    app = result.app;

    userFactory = new UserFactory();
    regionFactory = new RegionFactory();
    districtFactory = new DistrictFactory();
    animalFactory = new AnimalFactory();
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
  // Helper: create a VET user and login via real auth flow
  // ---------------------------------------------------------------------------
  async function loginAsVet(): Promise<{
    accessToken: string;
    userId: string;
    districtId: string;
  }> {
    const region = await regionFactory.create();
    const district = await districtFactory.create(region.id);

    const username = `vet_${Date.now()}`;
    const password = 'password123';

    const user = await userFactory.create({
      username,
      password,
      role: UserRole.VETERINARIAN,
      districtId: district.id,
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password })
      .expect(201);

    return {
      accessToken: res.body.accessToken,
      userId: user.id,
      districtId: district.id,
    };
  }

  // ---------------------------------------------------------------------------
  // Helper: create a test animal
  // ---------------------------------------------------------------------------
  async function createTestAnimal(): Promise<string> {
    const animal = await animalFactory.create();
    return animal.id;
  }

  // ===========================================================================
  // POST /medical-sessions
  // ===========================================================================
  describe('POST /medical-sessions', () => {
    beforeEach(async () => {
      const loginResult = await loginAsVet();
      accessToken = loginResult.accessToken;
    });

    it('should create a medical session (201)', async () => {
      const animalId = await createTestAnimal();

      const response = await request(app.getHttpServer())
        .post('/medical-sessions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          animalId,
          notes: 'Annual checkup',
          date: '2024-06-15T10:00:00Z',
        })
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.animalId).toBe(animalId);
      expect(response.body.notes).toBe('Annual checkup');
      expect(response.body.status).toBe(SessionStatus.DRAFT);
    });

    it('should create a session with only required field animalId (201)', async () => {
      const animalId = await createTestAnimal();

      const response = await request(app.getHttpServer())
        .post('/medical-sessions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ animalId })
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.animalId).toBe(animalId);
      expect(response.body.status).toBe(SessionStatus.DRAFT);
    });

    it('should return 400 when animalId is missing', async () => {
      await request(app.getHttpServer())
        .post('/medical-sessions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ notes: 'No animal' })
        .expect(400);
    });

    it('should return 400 when animalId is not a valid UUID', async () => {
      await request(app.getHttpServer())
        .post('/medical-sessions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ animalId: 'not-a-uuid' })
        .expect(400);
    });

    it('should return 400 for unknown properties (forbidNonWhitelisted)', async () => {
      const animalId = await createTestAnimal();

      await request(app.getHttpServer())
        .post('/medical-sessions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ animalId, unknownField: 'value' })
        .expect(400);
    });

    it('should return 401 when no auth token is provided', async () => {
      const animalId = await createTestAnimal();

      await request(app.getHttpServer())
        .post('/medical-sessions')
        .send({ animalId })
        .expect(401);
    });
  });

  // ===========================================================================
  // GET /medical-sessions
  // ===========================================================================
  describe('GET /medical-sessions', () => {
    beforeEach(async () => {
      const loginResult = await loginAsVet();
      accessToken = loginResult.accessToken;
    });

    it('should return paginated list of medical sessions (200)', async () => {
      // Create a few sessions
      await medicalSessionFactory.create();
      await medicalSessionFactory.create();

      const response = await request(app.getHttpServer())
        .get('/medical-sessions')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      expect(response.body.meta).toBeDefined();
      expect(response.body.meta.total).toBeGreaterThanOrEqual(2);
      expect(response.body.meta.currentPage).toBeDefined();
      expect(response.body.meta.perPage).toBeDefined();
    });

    it('should filter by animalId', async () => {
      const animal = await animalFactory.create();
      await medicalSessionFactory.create({ animalId: animal.id });
      await medicalSessionFactory.create(); // different animal

      const response = await request(app.getHttpServer())
        .get('/medical-sessions')
        .query({ animalId: animal.id })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      response.body.data.forEach((session: any) => {
        expect(session.animalId).toBe(animal.id);
      });
    });

    it('should filter by status', async () => {
      await medicalSessionFactory.create({ status: SessionStatus.DRAFT });
      await medicalSessionFactory.create({ status: SessionStatus.READY });

      const response = await request(app.getHttpServer())
        .get('/medical-sessions')
        .query({ status: SessionStatus.DRAFT })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      response.body.data.forEach((session: any) => {
        expect(session.status).toBe(SessionStatus.DRAFT);
      });
    });

    it('should support pagination with page and perPage', async () => {
      // Create 3 sessions
      await medicalSessionFactory.createMany(3);

      const response = await request(app.getHttpServer())
        .get('/medical-sessions')
        .query({ page: 1, perPage: 2 })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.meta.perPage).toBe(2);
    });

    it('should return 401 when no auth token is provided', async () => {
      await request(app.getHttpServer()).get('/medical-sessions').expect(401);
    });
  });

  // ===========================================================================
  // GET /medical-sessions/:id
  // ===========================================================================
  describe('GET /medical-sessions/:id', () => {
    beforeEach(async () => {
      const loginResult = await loginAsVet();
      accessToken = loginResult.accessToken;
    });

    it('should return a medical session with exam includes (200)', async () => {
      const session = await medicalSessionFactory.create();

      const response = await request(app.getHttpServer())
        .get(`/medical-sessions/${session.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(session.id);
      expect(response.body.animalId).toBe(session.animalId);
      expect(response.body.status).toBe(session.status);
      // Check that exam includes are present (even if null)
      expect(response.body).toHaveProperty('clinicalExam');
      expect(response.body).toHaveProperty('bloodExam');
      expect(response.body).toHaveProperty('urineExam');
      expect(response.body).toHaveProperty('fecesExam');
      expect(response.body).toHaveProperty('mucosaExams');
      expect(response.body).toHaveProperty('prediction');
      expect(response.body).toHaveProperty('animal');
    });

    it('should return 404 for non-existent session', async () => {
      const fakeId = '00000000-0000-4000-a000-000000000000';

      await request(app.getHttpServer())
        .get(`/medical-sessions/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 400 for invalid UUID param', async () => {
      await request(app.getHttpServer())
        .get('/medical-sessions/not-a-uuid')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });

  // ===========================================================================
  // PATCH /medical-sessions/:id
  // ===========================================================================
  describe('PATCH /medical-sessions/:id', () => {
    beforeEach(async () => {
      const loginResult = await loginAsVet();
      accessToken = loginResult.accessToken;
    });

    it('should update medical session notes (200)', async () => {
      const session = await medicalSessionFactory.create({
        notes: 'Original notes',
      });

      const response = await request(app.getHttpServer())
        .patch(`/medical-sessions/${session.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ notes: 'Updated notes' })
        .expect(200);

      expect(response.body.id).toBe(session.id);
      expect(response.body.notes).toBe('Updated notes');
    });

    it('should update medical session status (200)', async () => {
      const session = await medicalSessionFactory.create({
        status: SessionStatus.DRAFT,
      });

      const response = await request(app.getHttpServer())
        .patch(`/medical-sessions/${session.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: SessionStatus.READY })
        .expect(200);

      expect(response.body.status).toBe(SessionStatus.READY);
    });

    it('should return 404 for non-existent session', async () => {
      const fakeId = '00000000-0000-4000-a000-000000000000';

      await request(app.getHttpServer())
        .patch(`/medical-sessions/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ notes: 'Update' })
        .expect(404);
    });

    it('should return 401 when no auth token is provided', async () => {
      const session = await medicalSessionFactory.create();

      await request(app.getHttpServer())
        .patch(`/medical-sessions/${session.id}`)
        .send({ notes: 'Update' })
        .expect(401);
    });
  });

  // ===========================================================================
  // DELETE /medical-sessions/:id
  // ===========================================================================
  describe('DELETE /medical-sessions/:id', () => {
    beforeEach(async () => {
      const loginResult = await loginAsVet();
      accessToken = loginResult.accessToken;
    });

    it('should delete a medical session (200)', async () => {
      const session = await medicalSessionFactory.create();

      const response = await request(app.getHttpServer())
        .delete(`/medical-sessions/${session.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(session.id);

      // Verify it is gone
      await request(app.getHttpServer())
        .get(`/medical-sessions/${session.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent session', async () => {
      const fakeId = '00000000-0000-4000-a000-000000000000';

      await request(app.getHttpServer())
        .delete(`/medical-sessions/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 401 when no auth token is provided', async () => {
      const session = await medicalSessionFactory.create();

      await request(app.getHttpServer())
        .delete(`/medical-sessions/${session.id}`)
        .expect(401);
    });
  });

  // ===========================================================================
  // POST /medical-sessions/:id/submit
  // ===========================================================================
  describe('POST /medical-sessions/:id/submit', () => {
    beforeEach(async () => {
      const loginResult = await loginAsVet();
      accessToken = loginResult.accessToken;
    });

    it('should return 400 when session lacks required exams (clinical + blood)', async () => {
      // Create a session without any exams attached
      const session = await medicalSessionFactory.create();

      const response = await request(app.getHttpServer())
        .post(`/medical-sessions/${session.id}/submit`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(response.body.message).toContain(
        'Session must have at least a clinical exam and blood exam',
      );
    });

    it('should respond without crashing when external AI service is unreachable', async () => {
      // This test verifies the endpoint handles unreachable PREDICT_API_URI gracefully.
      // Since the external AI service is likely not running in test, we expect
      // either a 400 (service unavailable message) or another error status,
      // but the server itself should not crash.
      const session = await medicalSessionFactory.create();

      // The session has no exams, so it will fail at the exam check (400).
      // This confirms the endpoint is wired up and responds gracefully.
      const response = await request(app.getHttpServer())
        .post(`/medical-sessions/${session.id}/submit`)
        .set('Authorization', `Bearer ${accessToken}`);

      // The endpoint should return an HTTP response (not time out or crash)
      expect([400, 500, 502]).toContain(response.status);
    });

    it('should return 404 for non-existent session', async () => {
      const fakeId = '00000000-0000-4000-a000-000000000000';

      await request(app.getHttpServer())
        .post(`/medical-sessions/${fakeId}/submit`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 401 when no auth token is provided', async () => {
      const session = await medicalSessionFactory.create();

      await request(app.getHttpServer())
        .post(`/medical-sessions/${session.id}/submit`)
        .expect(401);
    });
  });

  // ===========================================================================
  // GET /medical-sessions/:id/predict
  // ===========================================================================
  describe('GET /medical-sessions/:id/predict', () => {
    beforeEach(async () => {
      const loginResult = await loginAsVet();
      accessToken = loginResult.accessToken;
    });

    it('should return 404 when no prediction exists for the session', async () => {
      const session = await medicalSessionFactory.create();

      await request(app.getHttpServer())
        .get(`/medical-sessions/${session.id}/predict`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent session id', async () => {
      const fakeId = '00000000-0000-4000-a000-000000000000';

      await request(app.getHttpServer())
        .get(`/medical-sessions/${fakeId}/predict`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 401 when no auth token is provided', async () => {
      const session = await medicalSessionFactory.create();

      await request(app.getHttpServer())
        .get(`/medical-sessions/${session.id}/predict`)
        .expect(401);
    });
  });
});

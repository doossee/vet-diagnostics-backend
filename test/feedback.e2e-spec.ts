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
  MedicalSessionFactory,
  DiseaseFactory,
} from './factories';
import { UserRole } from '../src/shared/enums';

describe('Feedback (e2e)', () => {
  let app: INestApplication<App>;
  let userFactory: UserFactory;
  let regionFactory: RegionFactory;
  let districtFactory: DistrictFactory;
  let medicalSessionFactory: MedicalSessionFactory;
  let diseaseFactory: DiseaseFactory;
  const prisma = getPrismaTestClient();

  beforeAll(async () => {
    const result = await setupApp();
    app = result.app;

    userFactory = new UserFactory();
    regionFactory = new RegionFactory();
    districtFactory = new DistrictFactory();
    medicalSessionFactory = new MedicalSessionFactory();
    diseaseFactory = new DiseaseFactory();
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
  async function loginAsVet(): Promise<{
    accessToken: string;
    userId: string;
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

    // Create VetProfile for this user
    await prisma.vetProfile.create({
      data: {
        id: user.id,
        licenseNumber: `LIC-${Date.now()}`,
        specialization: 'General',
        experience: 5,
      },
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password });

    return {
      accessToken: res.body.accessToken,
      userId: user.id,
    };
  }

  // ---------------------------------------------------------------------------
  // Helper: create an ADMIN user and login
  // ---------------------------------------------------------------------------
  async function loginAsAdmin(): Promise<{
    accessToken: string;
    userId: string;
  }> {
    const region = await regionFactory.create();
    const district = await districtFactory.create(region.id);
    const username = `admin_${Date.now()}`;
    const password = 'password123';

    const user = await userFactory.create({
      username,
      password,
      role: UserRole.ADMIN,
      districtId: district.id,
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password });

    return {
      accessToken: res.body.accessToken,
      userId: user.id,
    };
  }

  // ---------------------------------------------------------------------------
  // Helper: create a Prediction record (needed as FK for Feedback)
  // ---------------------------------------------------------------------------
  async function createPrediction(sessionId: string): Promise<string> {
    const prediction = await prisma.prediction.create({
      data: {
        sessionId,
        rawOutput: { '0': 0.85, '1': 0.1, '2': 0.05 },
        predictedClass: 1,
        confidence: 0.85,
      },
    });
    return prediction.id;
  }

  // ---------------------------------------------------------------------------
  // Helper: setup feedback test prerequisites (session + prediction)
  // ---------------------------------------------------------------------------
  async function createFeedbackPrerequisites(): Promise<{
    predictionId: string;
    sessionId: string;
  }> {
    const session = await medicalSessionFactory.create();
    const predictionId = await createPrediction(session.id);
    return { predictionId, sessionId: session.id };
  }

  // ===========================================================================
  // POST /feedbacks
  // ===========================================================================
  describe('POST /feedbacks', () => {
    it('should create feedback with veterinarianId (201)', async () => {
      const { accessToken, userId } = await loginAsVet();
      const { predictionId } = await createFeedbackPrerequisites();

      const response = await request(app.getHttpServer())
        .post('/feedbacks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          predictionId,
          veterinarianId: userId,
          rating: 4,
          comment: 'Good prediction accuracy',
        })
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.predictionId).toBe(predictionId);
      expect(response.body.veterinarianId).toBe(userId);
      expect(response.body.rating).toBe(4);
      expect(response.body.comment).toBe('Good prediction accuracy');
    });

    it('should create feedback with adminId (201)', async () => {
      const { accessToken, userId } = await loginAsAdmin();
      const { predictionId } = await createFeedbackPrerequisites();

      const response = await request(app.getHttpServer())
        .post('/feedbacks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          predictionId,
          adminId: userId,
          rating: 3,
          comment: 'Needs improvement',
        })
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.adminId).toBe(userId);
      expect(response.body.rating).toBe(3);
    });

    it('should create feedback with suggestedDiseaseId (201)', async () => {
      const { accessToken, userId } = await loginAsVet();
      const { predictionId } = await createFeedbackPrerequisites();
      const disease = await diseaseFactory.create();

      const response = await request(app.getHttpServer())
        .post('/feedbacks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          predictionId,
          veterinarianId: userId,
          rating: 2,
          comment: 'Wrong disease predicted',
          suggestedDiseaseId: disease.id,
        })
        .expect(201);

      expect(response.body.suggestedDiseaseId).toBe(disease.id);
      expect(response.body.suggestedDisease).toBeDefined();
    });

    it('should return 400 when predictionId is missing', async () => {
      const { accessToken, userId } = await loginAsVet();

      await request(app.getHttpServer())
        .post('/feedbacks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          veterinarianId: userId,
          rating: 4,
        })
        .expect(400);
    });

    it('should return 400 when rating is out of range', async () => {
      const { accessToken, userId } = await loginAsVet();
      const { predictionId } = await createFeedbackPrerequisites();

      await request(app.getHttpServer())
        .post('/feedbacks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          predictionId,
          veterinarianId: userId,
          rating: 6,
        })
        .expect(400);
    });

    it('should return 400 when rating is missing', async () => {
      const { accessToken, userId } = await loginAsVet();
      const { predictionId } = await createFeedbackPrerequisites();

      await request(app.getHttpServer())
        .post('/feedbacks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          predictionId,
          veterinarianId: userId,
        })
        .expect(400);
    });

    it('should return 401 when no auth token is provided', async () => {
      await request(app.getHttpServer())
        .post('/feedbacks')
        .send({
          predictionId: '00000000-0000-4000-a000-000000000000',
          veterinarianId: '00000000-0000-4000-a000-000000000000',
          rating: 4,
        })
        .expect(401);
    });
  });

  // ===========================================================================
  // GET /feedbacks
  // ===========================================================================
  describe('GET /feedbacks', () => {
    it('should return paginated list of feedbacks (200)', async () => {
      const { accessToken, userId } = await loginAsVet();
      const { predictionId: p1 } = await createFeedbackPrerequisites();
      const { predictionId: p2 } = await createFeedbackPrerequisites();

      // Create two feedbacks
      await prisma.feedback.create({
        data: {
          predictionId: p1,
          veterinarianId: userId,
          rating: 4,
          comment: 'First feedback',
        },
      });
      await prisma.feedback.create({
        data: {
          predictionId: p2,
          veterinarianId: userId,
          rating: 5,
          comment: 'Second feedback',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/feedbacks')
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

    it('should filter by predictionId', async () => {
      const { accessToken, userId } = await loginAsVet();
      const { predictionId: target } = await createFeedbackPrerequisites();
      const { predictionId: other } = await createFeedbackPrerequisites();

      await prisma.feedback.create({
        data: { predictionId: target, veterinarianId: userId, rating: 4 },
      });
      await prisma.feedback.create({
        data: { predictionId: other, veterinarianId: userId, rating: 3 },
      });

      const response = await request(app.getHttpServer())
        .get('/feedbacks')
        .query({ predictionId: target })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].predictionId).toBe(target);
    });

    it('should filter by veterinarianId', async () => {
      const { accessToken, userId } = await loginAsVet();
      const { predictionId } = await createFeedbackPrerequisites();

      await prisma.feedback.create({
        data: { predictionId, veterinarianId: userId, rating: 5 },
      });

      const response = await request(app.getHttpServer())
        .get('/feedbacks')
        .query({ veterinarianId: userId })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      response.body.data.forEach((fb: any) => {
        expect(fb.veterinarianId).toBe(userId);
      });
    });

    it('should support pagination', async () => {
      const { accessToken, userId } = await loginAsVet();

      // Create 3 feedbacks
      for (let i = 0; i < 3; i++) {
        const { predictionId } = await createFeedbackPrerequisites();
        await prisma.feedback.create({
          data: { predictionId, veterinarianId: userId, rating: 3 },
        });
      }

      const response = await request(app.getHttpServer())
        .get('/feedbacks')
        .query({ page: 1, perPage: 2 })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.meta.perPage).toBe(2);
    });

    it('should return 401 when no auth token is provided', async () => {
      await request(app.getHttpServer()).get('/feedbacks').expect(401);
    });
  });

  // ===========================================================================
  // GET /feedbacks/:id
  // ===========================================================================
  describe('GET /feedbacks/:id', () => {
    it('should return feedback by ID with includes (200)', async () => {
      const { accessToken, userId } = await loginAsVet();
      const { predictionId } = await createFeedbackPrerequisites();

      const feedback = await prisma.feedback.create({
        data: {
          predictionId,
          veterinarianId: userId,
          rating: 4,
          comment: 'Test feedback',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/feedbacks/${feedback.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(feedback.id);
      expect(response.body.rating).toBe(4);
      expect(response.body.comment).toBe('Test feedback');
      expect(response.body.prediction).toBeDefined();
      expect(response.body.veterinarian).toBeDefined();
    });

    it('should return 404 for non-existent feedback', async () => {
      const { accessToken } = await loginAsVet();
      const fakeId = '00000000-0000-4000-a000-000000000000';

      await request(app.getHttpServer())
        .get(`/feedbacks/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 400 for invalid UUID param', async () => {
      const { accessToken } = await loginAsVet();

      await request(app.getHttpServer())
        .get('/feedbacks/not-a-uuid')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });

  // ===========================================================================
  // PATCH /feedbacks/:id
  // ===========================================================================
  describe('PATCH /feedbacks/:id', () => {
    it('should update feedback rating and comment (200)', async () => {
      const { accessToken, userId } = await loginAsVet();
      const { predictionId } = await createFeedbackPrerequisites();

      const feedback = await prisma.feedback.create({
        data: {
          predictionId,
          veterinarianId: userId,
          rating: 3,
          comment: 'Original comment',
        },
      });

      const response = await request(app.getHttpServer())
        .patch(`/feedbacks/${feedback.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ rating: 5, comment: 'Updated comment' })
        .expect(200);

      expect(response.body.id).toBe(feedback.id);
      expect(response.body.rating).toBe(5);
      expect(response.body.comment).toBe('Updated comment');
    });

    it('should update only the comment (200)', async () => {
      const { accessToken, userId } = await loginAsVet();
      const { predictionId } = await createFeedbackPrerequisites();

      const feedback = await prisma.feedback.create({
        data: {
          predictionId,
          veterinarianId: userId,
          rating: 4,
        },
      });

      const response = await request(app.getHttpServer())
        .patch(`/feedbacks/${feedback.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ comment: 'New comment' })
        .expect(200);

      expect(response.body.comment).toBe('New comment');
      expect(response.body.rating).toBe(4); // unchanged
    });

    it('should return 404 for non-existent feedback', async () => {
      const { accessToken } = await loginAsVet();
      const fakeId = '00000000-0000-4000-a000-000000000000';

      await request(app.getHttpServer())
        .patch(`/feedbacks/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ rating: 5 })
        .expect(404);
    });

    it('should return 401 when no auth token is provided', async () => {
      await request(app.getHttpServer())
        .patch('/feedbacks/00000000-0000-4000-a000-000000000000')
        .send({ rating: 5 })
        .expect(401);
    });
  });

  // ===========================================================================
  // DELETE /feedbacks/:id
  // ===========================================================================
  describe('DELETE /feedbacks/:id', () => {
    it('should delete a feedback (200)', async () => {
      const { accessToken, userId } = await loginAsVet();
      const { predictionId } = await createFeedbackPrerequisites();

      const feedback = await prisma.feedback.create({
        data: {
          predictionId,
          veterinarianId: userId,
          rating: 3,
        },
      });

      const response = await request(app.getHttpServer())
        .delete(`/feedbacks/${feedback.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(feedback.id);

      // Verify it is gone
      await request(app.getHttpServer())
        .get(`/feedbacks/${feedback.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent feedback', async () => {
      const { accessToken } = await loginAsVet();
      const fakeId = '00000000-0000-4000-a000-000000000000';

      await request(app.getHttpServer())
        .delete(`/feedbacks/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 401 when no auth token is provided', async () => {
      await request(app.getHttpServer())
        .delete('/feedbacks/00000000-0000-4000-a000-000000000000')
        .expect(401);
    });
  });
});

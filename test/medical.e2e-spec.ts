import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { setupApp } from './utils/setup-app';
import { cleanupDatabase, disconnectDatabase } from './utils/database';
import { UserFactory } from './factories/user.factory';
import { RegionFactory, DistrictFactory } from './factories/region.factory';
import {
  DiseaseCategoryFactory,
  DiseaseFactory,
} from './factories/disease.factory';
import {
  ProphylaxisFactory,
  ProphylaxisItemFactory,
  ProphylaxisDetailFactory,
} from './factories/prophylaxis.factory';
import { AnimalFactory } from './factories/animal.factory';
import { UserRole, ProphylaxisType } from '../src/shared/enums';

describe('Medical (e2e)', () => {
  let app: INestApplication<App>;
  let userFactory: UserFactory;
  let regionFactory: RegionFactory;
  let districtFactory: DistrictFactory;
  let diseaseCategoryFactory: DiseaseCategoryFactory;
  let diseaseFactory: DiseaseFactory;
  let prophylaxisFactory: ProphylaxisFactory;
  let prophylaxisItemFactory: ProphylaxisItemFactory;
  let prophylaxisDetailFactory: ProphylaxisDetailFactory;
  let animalFactory: AnimalFactory;
  let accessToken: string;

  beforeAll(async () => {
    const result = await setupApp();
    app = result.app;

    userFactory = new UserFactory();
    regionFactory = new RegionFactory();
    districtFactory = new DistrictFactory();
    diseaseCategoryFactory = new DiseaseCategoryFactory();
    diseaseFactory = new DiseaseFactory();
    prophylaxisFactory = new ProphylaxisFactory();
    prophylaxisItemFactory = new ProphylaxisItemFactory();
    prophylaxisDetailFactory = new ProphylaxisDetailFactory();
    animalFactory = new AnimalFactory();
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
  // Helper: create an ADMIN user and login via real auth flow
  // ---------------------------------------------------------------------------
  async function loginAsAdmin(): Promise<string> {
    const region = await regionFactory.create();
    const district = await districtFactory.create(region.id);

    const username = `admin_${Date.now()}`;
    const password = 'password123';

    await userFactory.create({
      username,
      password,
      role: UserRole.ADMIN as any,
      districtId: district.id,
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password })
      .expect(201);

    return res.body.accessToken;
  }

  // ===========================================================================
  // DISEASE CATEGORIES (/disease-categories)
  // ===========================================================================
  describe('Disease Categories (/disease-categories)', () => {
    beforeEach(async () => {
      accessToken = await loginAsAdmin();
    });

    // -------------------------------------------------------------------------
    // POST /disease-categories
    // -------------------------------------------------------------------------
    describe('POST /disease-categories', () => {
      it('should create a new disease category (201)', async () => {
        const response = await request(app.getHttpServer())
          .post('/disease-categories')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Инфекционные болезни', uz: 'Yuqumli kasalliklar' },
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual({
          ru: 'Инфекционные болезни',
          uz: 'Yuqumli kasalliklar',
        });
      });

      it('should create a disease category with parentId (201)', async () => {
        const parent = await request(app.getHttpServer())
          .post('/disease-categories')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Родитель', uz: 'Parent' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .post('/disease-categories')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Подкатегория', uz: 'Subcategory' },
            parentId: parent.body.id,
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.parentId).toBe(parent.body.id);
      });

      it('should return 400 for missing name', async () => {
        await request(app.getHttpServer())
          .post('/disease-categories')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({})
          .expect(400);
      });

      it('should return 400 for invalid name shape', async () => {
        await request(app.getHttpServer())
          .post('/disease-categories')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: 'not an object' })
          .expect(400);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .post('/disease-categories')
          .send({ name: { ru: 'Test', uz: 'Test' } })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /disease-categories
    // -------------------------------------------------------------------------
    describe('GET /disease-categories', () => {
      it('should return paginated list (200)', async () => {
        await diseaseCategoryFactory.create();
        await diseaseCategoryFactory.create();

        const response = await request(app.getHttpServer())
          .get('/disease-categories')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      });

      it('should support pagination parameters', async () => {
        for (let i = 0; i < 5; i++) {
          await diseaseCategoryFactory.create();
        }

        const response = await request(app.getHttpServer())
          .get('/disease-categories')
          .query({ page: 1, limit: 2 })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeLessThanOrEqual(2);
        expect(response.body.meta).toHaveProperty('total');
      });

      it('should support search by Russian name', async () => {
        await request(app.getHttpServer())
          .post('/disease-categories')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Вирусные болезни', uz: 'Virusli kasalliklar' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/disease-categories')
          .query({ search: 'Вирусные' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(response.body.data[0].name.ru).toContain('Вирусные');
      });

      it('should support search by Uzbek name', async () => {
        await request(app.getHttpServer())
          .post('/disease-categories')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Бактериальные', uz: 'Bakterial kasalliklar' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/disease-categories')
          .query({ search: 'Bakterial' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(response.body.data[0].name.uz).toContain('Bakterial');
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .get('/disease-categories')
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /disease-categories/:id
    // -------------------------------------------------------------------------
    describe('GET /disease-categories/:id', () => {
      it('should return a single disease category (200)', async () => {
        const category = await diseaseCategoryFactory.create();

        const response = await request(app.getHttpServer())
          .get(`/disease-categories/${category.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(category.id);
        expect(response.body).toHaveProperty('name');
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .get('/disease-categories/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 400 for invalid UUID', async () => {
        await request(app.getHttpServer())
          .get('/disease-categories/not-a-uuid')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(400);
      });
    });

    // -------------------------------------------------------------------------
    // PATCH /disease-categories/:id
    // -------------------------------------------------------------------------
    describe('PATCH /disease-categories/:id', () => {
      it('should update a disease category (200)', async () => {
        const category = await diseaseCategoryFactory.create();

        const response = await request(app.getHttpServer())
          .patch(`/disease-categories/${category.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Обновлённая', uz: 'Yangilangan' } })
          .expect(200);

        expect(response.body.name).toEqual({
          ru: 'Обновлённая',
          uz: 'Yangilangan',
        });
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .patch('/disease-categories/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Test', uz: 'Test' } })
          .expect(404);
      });
    });

    // -------------------------------------------------------------------------
    // DELETE /disease-categories/:id
    // -------------------------------------------------------------------------
    describe('DELETE /disease-categories/:id', () => {
      it('should delete a disease category (200)', async () => {
        const category = await diseaseCategoryFactory.create();

        await request(app.getHttpServer())
          .delete(`/disease-categories/${category.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        // Verify it no longer exists
        await request(app.getHttpServer())
          .get(`/disease-categories/${category.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .delete('/disease-categories/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });
    });
  });

  // ===========================================================================
  // DISEASES (/diseases)
  // ===========================================================================
  describe('Diseases (/diseases)', () => {
    beforeEach(async () => {
      accessToken = await loginAsAdmin();
    });

    // -------------------------------------------------------------------------
    // POST /diseases
    // -------------------------------------------------------------------------
    describe('POST /diseases', () => {
      it('should create a new disease (201)', async () => {
        const category = await diseaseCategoryFactory.create();

        const response = await request(app.getHttpServer())
          .post('/diseases')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Ящур', uz: 'Tarvaqay' },
            diseaseCategoryId: category.id,
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual({ ru: 'Ящур', uz: 'Tarvaqay' });
        expect(response.body.diseaseCategoryId).toBe(category.id);
      });

      it('should return 400 for missing required fields', async () => {
        await request(app.getHttpServer())
          .post('/diseases')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Test', uz: 'Test' } })
          .expect(400);
      });

      it('should return 400 for missing name', async () => {
        const category = await diseaseCategoryFactory.create();

        await request(app.getHttpServer())
          .post('/diseases')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ diseaseCategoryId: category.id })
          .expect(400);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .post('/diseases')
          .send({ name: { ru: 'Test', uz: 'Test' }, diseaseCategoryId: 'any' })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /diseases
    // -------------------------------------------------------------------------
    describe('GET /diseases', () => {
      it('should return paginated list (200)', async () => {
        const category = await diseaseCategoryFactory.create();
        await diseaseFactory.create({ diseaseCategoryId: category.id });
        await diseaseFactory.create({ diseaseCategoryId: category.id });

        const response = await request(app.getHttpServer())
          .get('/diseases')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      });

      it('should filter by diseaseCategoryId', async () => {
        const category1 = await diseaseCategoryFactory.create();
        const category2 = await diseaseCategoryFactory.create();
        await diseaseFactory.create({ diseaseCategoryId: category1.id });
        await diseaseFactory.create({ diseaseCategoryId: category2.id });

        const response = await request(app.getHttpServer())
          .get('/diseases')
          .query({ diseaseCategoryId: category1.id })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].diseaseCategoryId).toBe(category1.id);
      });

      it('should support search by Russian name', async () => {
        const category = await diseaseCategoryFactory.create();

        await request(app.getHttpServer())
          .post('/diseases')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Бешенство', uz: 'Quturish' },
            diseaseCategoryId: category.id,
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/diseases')
          .query({ search: 'Бешенство' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(response.body.data[0].name.ru).toContain('Бешенство');
      });

      it('should support search by Uzbek name', async () => {
        const category = await diseaseCategoryFactory.create();

        await request(app.getHttpServer())
          .post('/diseases')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Бешенство', uz: 'Quturish kasalligi' },
            diseaseCategoryId: category.id,
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/diseases')
          .query({ search: 'Quturish' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(response.body.data[0].name.uz).toContain('Quturish');
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer()).get('/diseases').expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /diseases/:id
    // -------------------------------------------------------------------------
    describe('GET /diseases/:id', () => {
      it('should return a single disease (200)', async () => {
        const disease = await diseaseFactory.create();

        const response = await request(app.getHttpServer())
          .get(`/diseases/${disease.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(disease.id);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('diseaseCategory');
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .get('/diseases/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 400 for invalid UUID', async () => {
        await request(app.getHttpServer())
          .get('/diseases/not-a-uuid')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(400);
      });
    });

    // -------------------------------------------------------------------------
    // PATCH /diseases/:id
    // -------------------------------------------------------------------------
    describe('PATCH /diseases/:id', () => {
      it('should update a disease (200)', async () => {
        const disease = await diseaseFactory.create();

        const response = await request(app.getHttpServer())
          .patch(`/diseases/${disease.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Обновлённая болезнь', uz: 'Yangilangan kasallik' },
          })
          .expect(200);

        expect(response.body.name).toEqual({
          ru: 'Обновлённая болезнь',
          uz: 'Yangilangan kasallik',
        });
      });

      it('should update diseaseCategoryId (200)', async () => {
        const disease = await diseaseFactory.create();
        const newCategory = await diseaseCategoryFactory.create();

        const response = await request(app.getHttpServer())
          .patch(`/diseases/${disease.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ diseaseCategoryId: newCategory.id })
          .expect(200);

        expect(response.body.diseaseCategoryId).toBe(newCategory.id);
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .patch('/diseases/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Test', uz: 'Test' } })
          .expect(404);
      });
    });

    // -------------------------------------------------------------------------
    // DELETE /diseases/:id
    // -------------------------------------------------------------------------
    describe('DELETE /diseases/:id', () => {
      it('should delete a disease (200)', async () => {
        const disease = await diseaseFactory.create();

        await request(app.getHttpServer())
          .delete(`/diseases/${disease.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        // Verify it no longer exists
        await request(app.getHttpServer())
          .get(`/diseases/${disease.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .delete('/diseases/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });
    });
  });

  // ===========================================================================
  // PROPHYLAXIS ITEMS (/prophylaxis-items)
  // ===========================================================================
  describe('Prophylaxis Items (/prophylaxis-items)', () => {
    beforeEach(async () => {
      accessToken = await loginAsAdmin();
    });

    // -------------------------------------------------------------------------
    // POST /prophylaxis-items
    // -------------------------------------------------------------------------
    describe('POST /prophylaxis-items', () => {
      it('should create a new prophylaxis item (201)', async () => {
        const response = await request(app.getHttpServer())
          .post('/prophylaxis-items')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Вакцина ящура', uz: 'Tarvaqay vaktsinasi' },
            type: ProphylaxisType.VACCINE,
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual({
          ru: 'Вакцина ящура',
          uz: 'Tarvaqay vaktsinasi',
        });
        expect(response.body.type).toBe(ProphylaxisType.VACCINE);
      });

      it('should return 400 for missing name', async () => {
        await request(app.getHttpServer())
          .post('/prophylaxis-items')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ type: ProphylaxisType.VACCINE })
          .expect(400);
      });

      it('should return 400 for missing type', async () => {
        await request(app.getHttpServer())
          .post('/prophylaxis-items')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Test', uz: 'Test' } })
          .expect(400);
      });

      it('should return 400 for invalid type value', async () => {
        await request(app.getHttpServer())
          .post('/prophylaxis-items')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Test', uz: 'Test' },
            type: 'INVALID_TYPE',
          })
          .expect(400);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .post('/prophylaxis-items')
          .send({
            name: { ru: 'Test', uz: 'Test' },
            type: ProphylaxisType.VACCINE,
          })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /prophylaxis-items
    // -------------------------------------------------------------------------
    describe('GET /prophylaxis-items', () => {
      it('should return paginated list (200)', async () => {
        await prophylaxisItemFactory.create();
        await prophylaxisItemFactory.create();

        const response = await request(app.getHttpServer())
          .get('/prophylaxis-items')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      });

      it('should filter by type', async () => {
        await prophylaxisItemFactory.create({ type: 'VACCINE' as any });
        await prophylaxisItemFactory.create({ type: 'DEWORMING' as any });

        const response = await request(app.getHttpServer())
          .get('/prophylaxis-items')
          .query({ type: ProphylaxisType.VACCINE })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        for (const item of response.body.data) {
          expect(item.type).toBe(ProphylaxisType.VACCINE);
        }
      });

      it('should support search by name', async () => {
        await request(app.getHttpServer())
          .post('/prophylaxis-items')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Антигельминтик', uz: 'Antigelmintik' },
            type: ProphylaxisType.DEWORMING,
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/prophylaxis-items')
          .query({ search: 'Антигельминтик' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(response.body.data[0].name.ru).toContain('Антигельминтик');
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .get('/prophylaxis-items')
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /prophylaxis-items/:id
    // -------------------------------------------------------------------------
    describe('GET /prophylaxis-items/:id', () => {
      it('should return a single prophylaxis item (200)', async () => {
        const item = await prophylaxisItemFactory.create();

        const response = await request(app.getHttpServer())
          .get(`/prophylaxis-items/${item.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(item.id);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('type');
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .get('/prophylaxis-items/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 400 for invalid UUID', async () => {
        await request(app.getHttpServer())
          .get('/prophylaxis-items/not-a-uuid')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(400);
      });
    });

    // -------------------------------------------------------------------------
    // PATCH /prophylaxis-items/:id
    // -------------------------------------------------------------------------
    describe('PATCH /prophylaxis-items/:id', () => {
      it('should update a prophylaxis item name (200)', async () => {
        const item = await prophylaxisItemFactory.create();

        const response = await request(app.getHttpServer())
          .patch(`/prophylaxis-items/${item.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Обновлённый препарат', uz: 'Yangilangan preparat' },
          })
          .expect(200);

        expect(response.body.name).toEqual({
          ru: 'Обновлённый препарат',
          uz: 'Yangilangan preparat',
        });
      });

      it('should update a prophylaxis item type (200)', async () => {
        const item = await prophylaxisItemFactory.create({
          type: 'VACCINE' as any,
        });

        const response = await request(app.getHttpServer())
          .patch(`/prophylaxis-items/${item.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ type: ProphylaxisType.DEWORMING })
          .expect(200);

        expect(response.body.type).toBe(ProphylaxisType.DEWORMING);
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .patch('/prophylaxis-items/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Test', uz: 'Test' } })
          .expect(404);
      });
    });

    // -------------------------------------------------------------------------
    // DELETE /prophylaxis-items/:id
    // -------------------------------------------------------------------------
    describe('DELETE /prophylaxis-items/:id', () => {
      it('should delete a prophylaxis item (200)', async () => {
        const item = await prophylaxisItemFactory.create();

        await request(app.getHttpServer())
          .delete(`/prophylaxis-items/${item.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        // Verify it no longer exists
        await request(app.getHttpServer())
          .get(`/prophylaxis-items/${item.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .delete('/prophylaxis-items/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });
    });
  });

  // ===========================================================================
  // PROPHYLAXIS DETAILS (/prophylaxis-details)
  // ===========================================================================
  describe('Prophylaxis Details (/prophylaxis-details)', () => {
    beforeEach(async () => {
      accessToken = await loginAsAdmin();
    });

    // -------------------------------------------------------------------------
    // POST /prophylaxis-details
    // -------------------------------------------------------------------------
    describe('POST /prophylaxis-details', () => {
      it('should create a new prophylaxis detail (201)', async () => {
        const item = await prophylaxisItemFactory.create();

        const response = await request(app.getHttpServer())
          .post('/prophylaxis-details')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Доза 2мл', uz: '2ml doza' },
            itemId: item.id,
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual({ ru: 'Доза 2мл', uz: '2ml doza' });
        expect(response.body.itemId).toBe(item.id);
      });

      it('should return 400 for missing name', async () => {
        const item = await prophylaxisItemFactory.create();

        await request(app.getHttpServer())
          .post('/prophylaxis-details')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ itemId: item.id })
          .expect(400);
      });

      it('should return 400 for missing itemId', async () => {
        await request(app.getHttpServer())
          .post('/prophylaxis-details')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Test', uz: 'Test' } })
          .expect(400);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .post('/prophylaxis-details')
          .send({
            name: { ru: 'Test', uz: 'Test' },
            itemId: '00000000-0000-0000-0000-000000000000',
          })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /prophylaxis-details
    // -------------------------------------------------------------------------
    describe('GET /prophylaxis-details', () => {
      it('should return paginated list (200)', async () => {
        await prophylaxisDetailFactory.create();
        await prophylaxisDetailFactory.create();

        const response = await request(app.getHttpServer())
          .get('/prophylaxis-details')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      });

      it('should filter by itemId', async () => {
        const item1 = await prophylaxisItemFactory.create();
        const item2 = await prophylaxisItemFactory.create();
        await prophylaxisDetailFactory.create({ itemId: item1.id });
        await prophylaxisDetailFactory.create({ itemId: item2.id });

        const response = await request(app.getHttpServer())
          .get('/prophylaxis-details')
          .query({ itemId: item1.id })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].itemId).toBe(item1.id);
      });

      it('should support search by name', async () => {
        const item = await prophylaxisItemFactory.create();

        await request(app.getHttpServer())
          .post('/prophylaxis-details')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Внутримышечно', uz: 'Mushak ichiga' },
            itemId: item.id,
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/prophylaxis-details')
          .query({ search: 'Внутримышечно' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(response.body.data[0].name.ru).toContain('Внутримышечно');
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .get('/prophylaxis-details')
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /prophylaxis-details/:id
    // -------------------------------------------------------------------------
    describe('GET /prophylaxis-details/:id', () => {
      it('should return a single prophylaxis detail with item (200)', async () => {
        const detail = await prophylaxisDetailFactory.create();

        const response = await request(app.getHttpServer())
          .get(`/prophylaxis-details/${detail.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(detail.id);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('item');
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .get('/prophylaxis-details/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 400 for invalid UUID', async () => {
        await request(app.getHttpServer())
          .get('/prophylaxis-details/not-a-uuid')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(400);
      });
    });

    // -------------------------------------------------------------------------
    // PATCH /prophylaxis-details/:id
    // -------------------------------------------------------------------------
    describe('PATCH /prophylaxis-details/:id', () => {
      it('should update a prophylaxis detail name (200)', async () => {
        const detail = await prophylaxisDetailFactory.create();

        const response = await request(app.getHttpServer())
          .patch(`/prophylaxis-details/${detail.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Обновлённая деталь', uz: 'Yangilangan detal' } })
          .expect(200);

        expect(response.body.name).toEqual({
          ru: 'Обновлённая деталь',
          uz: 'Yangilangan detal',
        });
      });

      it('should update itemId (200)', async () => {
        const detail = await prophylaxisDetailFactory.create();
        const newItem = await prophylaxisItemFactory.create();

        const response = await request(app.getHttpServer())
          .patch(`/prophylaxis-details/${detail.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ itemId: newItem.id })
          .expect(200);

        expect(response.body.itemId).toBe(newItem.id);
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .patch('/prophylaxis-details/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Test', uz: 'Test' } })
          .expect(404);
      });
    });

    // -------------------------------------------------------------------------
    // DELETE /prophylaxis-details/:id
    // -------------------------------------------------------------------------
    describe('DELETE /prophylaxis-details/:id', () => {
      it('should delete a prophylaxis detail (200)', async () => {
        const detail = await prophylaxisDetailFactory.create();

        await request(app.getHttpServer())
          .delete(`/prophylaxis-details/${detail.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        // Verify it no longer exists
        await request(app.getHttpServer())
          .get(`/prophylaxis-details/${detail.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .delete('/prophylaxis-details/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });
    });
  });

  // ===========================================================================
  // PROPHYLAXIS (/prophylaxis)
  // ===========================================================================
  describe('Prophylaxis (/prophylaxis)', () => {
    beforeEach(async () => {
      accessToken = await loginAsAdmin();
    });

    // -------------------------------------------------------------------------
    // POST /prophylaxis
    // -------------------------------------------------------------------------
    describe('POST /prophylaxis', () => {
      it('should create a new prophylaxis record (201)', async () => {
        const animal = await animalFactory.create();
        const item = await prophylaxisItemFactory.create();

        const response = await request(app.getHttpServer())
          .post('/prophylaxis')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            type: ProphylaxisType.VACCINE,
            animalId: animal.id,
            itemId: item.id,
            date: '2024-03-15T00:00:00Z',
            notes: 'Vaccination completed successfully',
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.animalId).toBe(animal.id);
        expect(response.body.itemId).toBe(item.id);
        expect(response.body.type).toBe(ProphylaxisType.VACCINE);
        expect(response.body.notes).toBe('Vaccination completed successfully');
      });

      it('should create with optional detailId (201)', async () => {
        const animal = await animalFactory.create();
        const item = await prophylaxisItemFactory.create();
        const detail = await prophylaxisDetailFactory.create({
          itemId: item.id,
        });

        const response = await request(app.getHttpServer())
          .post('/prophylaxis')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            type: ProphylaxisType.VACCINE,
            animalId: animal.id,
            itemId: item.id,
            detailId: detail.id,
            date: '2024-03-15T00:00:00Z',
          })
          .expect(201);

        expect(response.body.detailId).toBe(detail.id);
      });

      it('should return 400 for missing required fields', async () => {
        await request(app.getHttpServer())
          .post('/prophylaxis')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({})
          .expect(400);
      });

      it('should return 400 for missing animalId', async () => {
        const item = await prophylaxisItemFactory.create();

        await request(app.getHttpServer())
          .post('/prophylaxis')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            type: ProphylaxisType.VACCINE,
            itemId: item.id,
            date: '2024-03-15T00:00:00Z',
          })
          .expect(400);
      });

      it('should return 400 for invalid type', async () => {
        const animal = await animalFactory.create();
        const item = await prophylaxisItemFactory.create();

        await request(app.getHttpServer())
          .post('/prophylaxis')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            type: 'INVALID_TYPE',
            animalId: animal.id,
            itemId: item.id,
            date: '2024-03-15T00:00:00Z',
          })
          .expect(400);
      });

      it('should return 400 for invalid date format', async () => {
        const animal = await animalFactory.create();
        const item = await prophylaxisItemFactory.create();

        await request(app.getHttpServer())
          .post('/prophylaxis')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            type: ProphylaxisType.VACCINE,
            animalId: animal.id,
            itemId: item.id,
            date: 'not-a-date',
          })
          .expect(400);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .post('/prophylaxis')
          .send({
            type: ProphylaxisType.VACCINE,
            animalId: '00000000-0000-0000-0000-000000000000',
            itemId: '00000000-0000-0000-0000-000000000000',
            date: '2024-03-15T00:00:00Z',
          })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /prophylaxis
    // -------------------------------------------------------------------------
    describe('GET /prophylaxis', () => {
      it('should return paginated list (200)', async () => {
        await prophylaxisFactory.create();
        await prophylaxisFactory.create();

        const response = await request(app.getHttpServer())
          .get('/prophylaxis')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      });

      it('should filter by animalId', async () => {
        const animal = await animalFactory.create();
        await prophylaxisFactory.create({ animalId: animal.id });
        await prophylaxisFactory.create();

        const response = await request(app.getHttpServer())
          .get('/prophylaxis')
          .query({ animalId: animal.id })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        for (const record of response.body.data) {
          expect(record.animalId).toBe(animal.id);
        }
      });

      it('should filter by type', async () => {
        await prophylaxisFactory.create({ type: 'VACCINE' as any });
        await prophylaxisFactory.create({ type: 'DEWORMING' as any });

        const response = await request(app.getHttpServer())
          .get('/prophylaxis')
          .query({ type: ProphylaxisType.VACCINE })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        for (const record of response.body.data) {
          expect(record.type).toBe(ProphylaxisType.VACCINE);
        }
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer()).get('/prophylaxis').expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /prophylaxis/animal/:animalId/last
    // -------------------------------------------------------------------------
    describe('GET /prophylaxis/animal/:animalId/last', () => {
      it('should return the last prophylaxis for an animal (200)', async () => {
        const animal = await animalFactory.create();
        const item = await prophylaxisItemFactory.create();

        await prophylaxisFactory.create({
          animalId: animal.id,
          itemId: item.id,
          date: new Date('2024-01-01'),
        });
        const latest = await prophylaxisFactory.create({
          animalId: animal.id,
          itemId: item.id,
          date: new Date('2024-06-01'),
        });

        const response = await request(app.getHttpServer())
          .get(`/prophylaxis/animal/${animal.id}/last`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(latest.id);
      });

      it('should return 200 with empty body for animal with no prophylaxis', async () => {
        const animal = await animalFactory.create();

        const response = await request(app.getHttpServer())
          .get(`/prophylaxis/animal/${animal.id}/last`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        // findFirst returns null when no record found
        expect(
          response.body === null ||
            response.body === '' ||
            Object.keys(response.body).length === 0,
        ).toBeTruthy();
      });

      it('should return 400 for invalid UUID', async () => {
        await request(app.getHttpServer())
          .get('/prophylaxis/animal/not-a-uuid/last')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(400);
      });
    });

    // -------------------------------------------------------------------------
    // GET /prophylaxis/:id
    // -------------------------------------------------------------------------
    describe('GET /prophylaxis/:id', () => {
      it('should return a single prophylaxis with relations (200)', async () => {
        const record = await prophylaxisFactory.create();

        const response = await request(app.getHttpServer())
          .get(`/prophylaxis/${record.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(record.id);
        expect(response.body).toHaveProperty('animal');
        expect(response.body).toHaveProperty('item');
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .get('/prophylaxis/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 400 for invalid UUID', async () => {
        await request(app.getHttpServer())
          .get('/prophylaxis/not-a-uuid')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(400);
      });
    });

    // -------------------------------------------------------------------------
    // PATCH /prophylaxis/:id
    // -------------------------------------------------------------------------
    describe('PATCH /prophylaxis/:id', () => {
      it('should update prophylaxis notes (200)', async () => {
        const record = await prophylaxisFactory.create();

        const response = await request(app.getHttpServer())
          .patch(`/prophylaxis/${record.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ notes: 'Updated notes' })
          .expect(200);

        expect(response.body.notes).toBe('Updated notes');
      });

      it('should update prophylaxis date (200)', async () => {
        const record = await prophylaxisFactory.create();

        const response = await request(app.getHttpServer())
          .patch(`/prophylaxis/${record.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ date: '2025-01-01T00:00:00Z' })
          .expect(200);

        expect(response.body).toHaveProperty('date');
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .patch('/prophylaxis/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ notes: 'Test' })
          .expect(404);
      });
    });

    // -------------------------------------------------------------------------
    // DELETE /prophylaxis/:id
    // -------------------------------------------------------------------------
    describe('DELETE /prophylaxis/:id', () => {
      it('should delete a prophylaxis record (200)', async () => {
        const record = await prophylaxisFactory.create();

        await request(app.getHttpServer())
          .delete(`/prophylaxis/${record.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        // Verify it no longer exists
        await request(app.getHttpServer())
          .get(`/prophylaxis/${record.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 404 for non-existent ID', async () => {
        await request(app.getHttpServer())
          .delete('/prophylaxis/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });
    });
  });
});

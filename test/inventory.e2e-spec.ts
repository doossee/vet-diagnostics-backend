import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { setupApp } from './utils/setup-app';
import { cleanupDatabase, disconnectDatabase } from './utils/database';
import { UserFactory } from './factories/user.factory';
import { RegionFactory, DistrictFactory } from './factories/region.factory';
import { AnimalFactory, AnimalTypeFactory } from './factories/animal.factory';
import { UserRole } from '../src/shared/enums';

describe('Inventory (e2e)', () => {
  let app: INestApplication<App>;
  let userFactory: UserFactory;
  let regionFactory: RegionFactory;
  let districtFactory: DistrictFactory;
  let animalFactory: AnimalFactory;
  let animalTypeFactory: AnimalTypeFactory;
  let accessToken: string;

  beforeAll(async () => {
    const result = await setupApp();
    app = result.app;

    userFactory = new UserFactory();
    regionFactory = new RegionFactory();
    districtFactory = new DistrictFactory();
    animalFactory = new AnimalFactory();
    animalTypeFactory = new AnimalTypeFactory();
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
      role: UserRole.ADMIN,
      districtId: district.id,
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password })
      .expect(201);

    return res.body.accessToken;
  }

  // ===========================================================================
  // ANIMAL TYPES (/animal-types)
  // ===========================================================================
  describe('Animal Types (/animal-types)', () => {
    beforeEach(async () => {
      accessToken = await loginAsAdmin();
    });

    // -------------------------------------------------------------------------
    // POST /animal-types
    // -------------------------------------------------------------------------
    describe('POST /animal-types', () => {
      it('should create a new animal type (201)', async () => {
        const response = await request(app.getHttpServer())
          .post('/animal-types')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Крупный рогатый скот', uz: 'Qoramol' } })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual({
          ru: 'Крупный рогатый скот',
          uz: 'Qoramol',
        });
      });

      it('should create an animal type with parentId (201)', async () => {
        const parent = await request(app.getHttpServer())
          .post('/animal-types')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Родитель', uz: 'Parent' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .post('/animal-types')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Дочерний', uz: 'Child' },
            parentId: parent.body.id,
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.parentId).toBe(parent.body.id);
      });

      it('should return 400 for validation error (invalid name type)', async () => {
        await request(app.getHttpServer())
          .post('/animal-types')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: 'not-an-object' })
          .expect(400);
      });

      it('should return 400 for validation error (empty ru field)', async () => {
        await request(app.getHttpServer())
          .post('/animal-types')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: '', uz: 'Qoramol' } })
          .expect(400);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .post('/animal-types')
          .send({ name: { ru: 'Крупный рогатый скот', uz: 'Qoramol' } })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /animal-types
    // -------------------------------------------------------------------------
    describe('GET /animal-types', () => {
      it('should return paginated animal types (200)', async () => {
        await animalTypeFactory.create();
        await animalTypeFactory.create();

        const response = await request(app.getHttpServer())
          .get('/animal-types')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
        expect(response.body.meta).toHaveProperty('total');
        expect(response.body.meta).toHaveProperty('lastPage');
        expect(response.body.meta).toHaveProperty('currentPage');
      });

      it('should support search by name', async () => {
        await request(app.getHttpServer())
          .post('/animal-types')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Уникальный тип', uz: 'Unique type' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/animal-types')
          .query({ search: 'Уникальный' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(
          response.body.data.some((r: any) => r.name.ru === 'Уникальный тип'),
        ).toBe(true);
      });

      it('should support pagination params', async () => {
        const response = await request(app.getHttpServer())
          .get('/animal-types')
          .query({ page: 1, perPage: 1 })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeLessThanOrEqual(1);
        expect(response.body.meta.currentPage).toBe(1);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer()).get('/animal-types').expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /animal-types/:id
    // -------------------------------------------------------------------------
    describe('GET /animal-types/:id', () => {
      it('should return an animal type by id (200)', async () => {
        const animalType = await animalTypeFactory.create();

        const response = await request(app.getHttpServer())
          .get(`/animal-types/${animalType.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(animalType.id);
        expect(response.body).toHaveProperty('name');
      });

      it('should return 404 for non-existent animal type', async () => {
        await request(app.getHttpServer())
          .get('/animal-types/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const animalType = await animalTypeFactory.create();
        await request(app.getHttpServer())
          .get(`/animal-types/${animalType.id}`)
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // PATCH /animal-types/:id
    // -------------------------------------------------------------------------
    describe('PATCH /animal-types/:id', () => {
      it('should update an animal type (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/animal-types')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Старое имя', uz: 'Old name' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .patch(`/animal-types/${createRes.body.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Новое имя', uz: 'New name' } })
          .expect(200);

        expect(response.body.id).toBe(createRes.body.id);
        expect(response.body.name).toEqual({
          ru: 'Новое имя',
          uz: 'New name',
        });
      });

      it('should return 404 for non-existent animal type', async () => {
        await request(app.getHttpServer())
          .patch('/animal-types/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Обновленный', uz: 'Updated' } })
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const animalType = await animalTypeFactory.create();
        await request(app.getHttpServer())
          .patch(`/animal-types/${animalType.id}`)
          .send({ name: { ru: 'Обновленный', uz: 'Updated' } })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // DELETE /animal-types/:id
    // -------------------------------------------------------------------------
    describe('DELETE /animal-types/:id', () => {
      it('should delete an animal type (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/animal-types')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Удаляемый', uz: 'To delete' } })
          .expect(201);

        const stationId = createRes.body.id;

        const response = await request(app.getHttpServer())
          .delete(`/animal-types/${stationId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(stationId);

        // Verify the animal type is gone
        await request(app.getHttpServer())
          .get(`/animal-types/${stationId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 404 for non-existent animal type', async () => {
        await request(app.getHttpServer())
          .delete('/animal-types/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const animalType = await animalTypeFactory.create();
        await request(app.getHttpServer())
          .delete(`/animal-types/${animalType.id}`)
          .expect(401);
      });
    });
  });

  // ===========================================================================
  // BREEDS (/breeds)
  // ===========================================================================
  describe('Breeds (/breeds)', () => {
    beforeEach(async () => {
      accessToken = await loginAsAdmin();
    });

    // -------------------------------------------------------------------------
    // POST /breeds
    // -------------------------------------------------------------------------
    describe('POST /breeds', () => {
      it('should create a new breed (201)', async () => {
        const response = await request(app.getHttpServer())
          .post('/breeds')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Голштинская', uz: 'Holstein' } })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual({
          ru: 'Голштинская',
          uz: 'Holstein',
        });
      });

      it('should return 400 for validation error (invalid name type)', async () => {
        await request(app.getHttpServer())
          .post('/breeds')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: 'not-an-object' })
          .expect(400);
      });

      it('should return 400 for validation error (empty ru field)', async () => {
        await request(app.getHttpServer())
          .post('/breeds')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: '', uz: 'Holstein' } })
          .expect(400);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .post('/breeds')
          .send({ name: { ru: 'Голштинская', uz: 'Holstein' } })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /breeds
    // -------------------------------------------------------------------------
    describe('GET /breeds', () => {
      it('should return paginated breeds (200)', async () => {
        await request(app.getHttpServer())
          .post('/breeds')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Порода А', uz: 'Breed A' } })
          .expect(201);

        await request(app.getHttpServer())
          .post('/breeds')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Порода Б', uz: 'Breed B' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/breeds')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
        expect(response.body.meta).toHaveProperty('total');
      });

      it('should support search by name', async () => {
        await request(app.getHttpServer())
          .post('/breeds')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Уникальная порода', uz: 'Unique breed' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/breeds')
          .query({ search: 'Уникальная' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(
          response.body.data.some(
            (r: any) => r.name.ru === 'Уникальная порода',
          ),
        ).toBe(true);
      });

      it('should support pagination params', async () => {
        const response = await request(app.getHttpServer())
          .get('/breeds')
          .query({ page: 1, perPage: 1 })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeLessThanOrEqual(1);
        expect(response.body.meta.currentPage).toBe(1);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer()).get('/breeds').expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /breeds/:id
    // -------------------------------------------------------------------------
    describe('GET /breeds/:id', () => {
      it('should return a breed by id (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/breeds')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Порода', uz: 'Breed' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get(`/breeds/${createRes.body.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(createRes.body.id);
        expect(response.body).toHaveProperty('name');
      });

      it('should return 404 for non-existent breed', async () => {
        await request(app.getHttpServer())
          .get('/breeds/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/breeds')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Порода', uz: 'Breed' } })
          .expect(201);

        await request(app.getHttpServer())
          .get(`/breeds/${createRes.body.id}`)
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // PATCH /breeds/:id
    // -------------------------------------------------------------------------
    describe('PATCH /breeds/:id', () => {
      it('should update a breed (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/breeds')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Старая порода', uz: 'Old breed' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .patch(`/breeds/${createRes.body.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Новая порода', uz: 'New breed' } })
          .expect(200);

        expect(response.body.id).toBe(createRes.body.id);
        expect(response.body.name).toEqual({
          ru: 'Новая порода',
          uz: 'New breed',
        });
      });

      it('should return 404 for non-existent breed', async () => {
        await request(app.getHttpServer())
          .patch('/breeds/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Обновленная', uz: 'Updated' } })
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/breeds')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Порода', uz: 'Breed' } })
          .expect(201);

        await request(app.getHttpServer())
          .patch(`/breeds/${createRes.body.id}`)
          .send({ name: { ru: 'Обновленная', uz: 'Updated' } })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // DELETE /breeds/:id
    // -------------------------------------------------------------------------
    describe('DELETE /breeds/:id', () => {
      it('should delete a breed (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/breeds')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Удаляемая порода', uz: 'To delete' } })
          .expect(201);

        const breedId = createRes.body.id;

        const response = await request(app.getHttpServer())
          .delete(`/breeds/${breedId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(breedId);

        // Verify the breed is gone
        await request(app.getHttpServer())
          .get(`/breeds/${breedId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 404 for non-existent breed', async () => {
        await request(app.getHttpServer())
          .delete('/breeds/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/breeds')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Порода', uz: 'Breed' } })
          .expect(201);

        await request(app.getHttpServer())
          .delete(`/breeds/${createRes.body.id}`)
          .expect(401);
      });
    });
  });

  // ===========================================================================
  // COLORS (/colors)
  // ===========================================================================
  describe('Colors (/colors)', () => {
    beforeEach(async () => {
      accessToken = await loginAsAdmin();
    });

    // -------------------------------------------------------------------------
    // POST /colors
    // -------------------------------------------------------------------------
    describe('POST /colors', () => {
      it('should create a new color (201)', async () => {
        const response = await request(app.getHttpServer())
          .post('/colors')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Чёрно-белая', uz: 'Qora-oq' } })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual({
          ru: 'Чёрно-белая',
          uz: 'Qora-oq',
        });
      });

      it('should return 400 for validation error (invalid name type)', async () => {
        await request(app.getHttpServer())
          .post('/colors')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: 'not-an-object' })
          .expect(400);
      });

      it('should return 400 for validation error (empty uz field)', async () => {
        await request(app.getHttpServer())
          .post('/colors')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Чёрная', uz: '' } })
          .expect(400);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .post('/colors')
          .send({ name: { ru: 'Чёрно-белая', uz: 'Qora-oq' } })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /colors
    // -------------------------------------------------------------------------
    describe('GET /colors', () => {
      it('should return paginated colors (200)', async () => {
        await request(app.getHttpServer())
          .post('/colors')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Цвет А', uz: 'Color A' } })
          .expect(201);

        await request(app.getHttpServer())
          .post('/colors')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Цвет Б', uz: 'Color B' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/colors')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
        expect(response.body.meta).toHaveProperty('total');
      });

      it('should support search by name', async () => {
        await request(app.getHttpServer())
          .post('/colors')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Уникальная масть', uz: 'Unique color' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/colors')
          .query({ search: 'Уникальная' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(
          response.body.data.some((r: any) => r.name.ru === 'Уникальная масть'),
        ).toBe(true);
      });

      it('should support pagination params', async () => {
        const response = await request(app.getHttpServer())
          .get('/colors')
          .query({ page: 1, perPage: 1 })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeLessThanOrEqual(1);
        expect(response.body.meta.currentPage).toBe(1);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer()).get('/colors').expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /colors/:id
    // -------------------------------------------------------------------------
    describe('GET /colors/:id', () => {
      it('should return a color by id (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/colors')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Масть', uz: 'Color' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get(`/colors/${createRes.body.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(createRes.body.id);
        expect(response.body).toHaveProperty('name');
      });

      it('should return 404 for non-existent color', async () => {
        await request(app.getHttpServer())
          .get('/colors/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/colors')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Масть', uz: 'Color' } })
          .expect(201);

        await request(app.getHttpServer())
          .get(`/colors/${createRes.body.id}`)
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // PATCH /colors/:id
    // -------------------------------------------------------------------------
    describe('PATCH /colors/:id', () => {
      it('should update a color (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/colors')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Старая масть', uz: 'Old color' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .patch(`/colors/${createRes.body.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Новая масть', uz: 'New color' } })
          .expect(200);

        expect(response.body.id).toBe(createRes.body.id);
        expect(response.body.name).toEqual({
          ru: 'Новая масть',
          uz: 'New color',
        });
      });

      it('should return 404 for non-existent color', async () => {
        await request(app.getHttpServer())
          .patch('/colors/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Обновленная', uz: 'Updated' } })
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/colors')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Масть', uz: 'Color' } })
          .expect(201);

        await request(app.getHttpServer())
          .patch(`/colors/${createRes.body.id}`)
          .send({ name: { ru: 'Обновленная', uz: 'Updated' } })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // DELETE /colors/:id
    // -------------------------------------------------------------------------
    describe('DELETE /colors/:id', () => {
      it('should delete a color (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/colors')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Удаляемая масть', uz: 'To delete' } })
          .expect(201);

        const colorId = createRes.body.id;

        const response = await request(app.getHttpServer())
          .delete(`/colors/${colorId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(colorId);

        // Verify the color is gone
        await request(app.getHttpServer())
          .get(`/colors/${colorId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 404 for non-existent color', async () => {
        await request(app.getHttpServer())
          .delete('/colors/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/colors')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Масть', uz: 'Color' } })
          .expect(201);

        await request(app.getHttpServer())
          .delete(`/colors/${createRes.body.id}`)
          .expect(401);
      });
    });
  });

  // ===========================================================================
  // ANIMAL SEXES (/animal-sexes)
  // ===========================================================================
  describe('Animal Sexes (/animal-sexes)', () => {
    beforeEach(async () => {
      accessToken = await loginAsAdmin();
    });

    // -------------------------------------------------------------------------
    // POST /animal-sexes
    // -------------------------------------------------------------------------
    describe('POST /animal-sexes', () => {
      it('should create a new animal sex (201)', async () => {
        const response = await request(app.getHttpServer())
          .post('/animal-sexes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Самец', uz: 'Erkak' },
            numericValue: 1,
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual({ ru: 'Самец', uz: 'Erkak' });
        expect(response.body.numericValue).toBe(1);
      });

      it('should return 400 for validation error (invalid name type)', async () => {
        await request(app.getHttpServer())
          .post('/animal-sexes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: 'not-an-object', numericValue: 1 })
          .expect(400);
      });

      it('should return 400 for validation error (missing numericValue)', async () => {
        await request(app.getHttpServer())
          .post('/animal-sexes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Самец', uz: 'Erkak' } })
          .expect(400);
      });

      it('should return 400 for validation error (empty ru field)', async () => {
        await request(app.getHttpServer())
          .post('/animal-sexes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: '', uz: 'Erkak' }, numericValue: 1 })
          .expect(400);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .post('/animal-sexes')
          .send({ name: { ru: 'Самец', uz: 'Erkak' }, numericValue: 1 })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /animal-sexes
    // -------------------------------------------------------------------------
    describe('GET /animal-sexes', () => {
      it('should return paginated animal sexes (200)', async () => {
        await request(app.getHttpServer())
          .post('/animal-sexes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Самец', uz: 'Erkak' }, numericValue: 1 })
          .expect(201);

        await request(app.getHttpServer())
          .post('/animal-sexes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Самка', uz: "Urg'ochi" }, numericValue: 2 })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/animal-sexes')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
        expect(response.body.meta).toHaveProperty('total');
      });

      it('should support search by name', async () => {
        await request(app.getHttpServer())
          .post('/animal-sexes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Уникальный пол', uz: 'Unique sex' },
            numericValue: 99,
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/animal-sexes')
          .query({ search: 'Уникальный' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(
          response.body.data.some((r: any) => r.name.ru === 'Уникальный пол'),
        ).toBe(true);
      });

      it('should support pagination params', async () => {
        const response = await request(app.getHttpServer())
          .get('/animal-sexes')
          .query({ page: 1, perPage: 1 })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeLessThanOrEqual(1);
        expect(response.body.meta.currentPage).toBe(1);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer()).get('/animal-sexes').expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /animal-sexes/:id
    // -------------------------------------------------------------------------
    describe('GET /animal-sexes/:id', () => {
      it('should return an animal sex by id (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/animal-sexes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Самец', uz: 'Erkak' }, numericValue: 1 })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get(`/animal-sexes/${createRes.body.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(createRes.body.id);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('numericValue');
      });

      it('should return 404 for non-existent animal sex', async () => {
        await request(app.getHttpServer())
          .get('/animal-sexes/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/animal-sexes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Самец', uz: 'Erkak' }, numericValue: 1 })
          .expect(201);

        await request(app.getHttpServer())
          .get(`/animal-sexes/${createRes.body.id}`)
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // PATCH /animal-sexes/:id
    // -------------------------------------------------------------------------
    describe('PATCH /animal-sexes/:id', () => {
      it('should update an animal sex (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/animal-sexes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Старый пол', uz: 'Old sex' }, numericValue: 1 })
          .expect(201);

        const response = await request(app.getHttpServer())
          .patch(`/animal-sexes/${createRes.body.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Новый пол', uz: 'New sex' }, numericValue: 3 })
          .expect(200);

        expect(response.body.id).toBe(createRes.body.id);
        expect(response.body.name).toEqual({
          ru: 'Новый пол',
          uz: 'New sex',
        });
        expect(response.body.numericValue).toBe(3);
      });

      it('should return 404 for non-existent animal sex', async () => {
        await request(app.getHttpServer())
          .patch('/animal-sexes/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Обновленный', uz: 'Updated' } })
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/animal-sexes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Самец', uz: 'Erkak' }, numericValue: 1 })
          .expect(201);

        await request(app.getHttpServer())
          .patch(`/animal-sexes/${createRes.body.id}`)
          .send({ name: { ru: 'Обновленный', uz: 'Updated' } })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // DELETE /animal-sexes/:id
    // -------------------------------------------------------------------------
    describe('DELETE /animal-sexes/:id', () => {
      it('should delete an animal sex (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/animal-sexes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Удаляемый пол', uz: 'To delete' },
            numericValue: 99,
          })
          .expect(201);

        const sexId = createRes.body.id;

        const response = await request(app.getHttpServer())
          .delete(`/animal-sexes/${sexId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(sexId);

        // Verify the animal sex is gone
        await request(app.getHttpServer())
          .get(`/animal-sexes/${sexId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 404 for non-existent animal sex', async () => {
        await request(app.getHttpServer())
          .delete('/animal-sexes/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/animal-sexes')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Самец', uz: 'Erkak' }, numericValue: 1 })
          .expect(201);

        await request(app.getHttpServer())
          .delete(`/animal-sexes/${createRes.body.id}`)
          .expect(401);
      });
    });
  });

  // ===========================================================================
  // ANIMALS (/animals)
  // ===========================================================================
  describe('Animals (/animals)', () => {
    let testAnimalTypeId: string;
    let testBreedId: string;
    let testColorId: string;

    beforeEach(async () => {
      accessToken = await loginAsAdmin();

      // Create required FK dependencies via the API
      const typeRes = await request(app.getHttpServer())
        .post('/animal-types')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: { ru: 'КРС', uz: 'QRS' } })
        .expect(201);
      testAnimalTypeId = typeRes.body.id;

      const breedRes = await request(app.getHttpServer())
        .post('/breeds')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: { ru: 'Голштинская', uz: 'Holstein' } })
        .expect(201);
      testBreedId = breedRes.body.id;

      const colorRes = await request(app.getHttpServer())
        .post('/colors')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: { ru: 'Белая', uz: 'Oq' } })
        .expect(201);
      testColorId = colorRes.body.id;
    });

    // -------------------------------------------------------------------------
    // POST /animals
    // -------------------------------------------------------------------------
    describe('POST /animals', () => {
      it('should create a new animal (201)', async () => {
        const response = await request(app.getHttpServer())
          .post('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            arrivalDate: '2024-01-15T00:00:00Z',
            animalNameCode: `TEST-${Date.now()}`,
            birthYear: 2022,
            birthMonth: 6,
            animalTypeId: testAnimalTypeId,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('animalNameCode');
        expect(response.body).toHaveProperty('animalType');
        expect(response.body).toHaveProperty('animalBreed');
        expect(response.body).toHaveProperty('animalColor');
      });

      it('should return 400 for validation error (missing animalNameCode)', async () => {
        await request(app.getHttpServer())
          .post('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            arrivalDate: '2024-01-15T00:00:00Z',
            birthYear: 2022,
            birthMonth: 6,
            animalTypeId: testAnimalTypeId,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(400);
      });

      it('should return 400 for validation error (missing arrivalDate)', async () => {
        await request(app.getHttpServer())
          .post('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            animalNameCode: `TEST-${Date.now()}`,
            birthYear: 2022,
            birthMonth: 6,
            animalTypeId: testAnimalTypeId,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(400);
      });

      it('should return 400 for validation error (missing animalTypeId)', async () => {
        await request(app.getHttpServer())
          .post('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            arrivalDate: '2024-01-15T00:00:00Z',
            animalNameCode: `TEST-${Date.now()}`,
            birthYear: 2022,
            birthMonth: 6,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(400);
      });

      it('should return 400 for validation error (invalid birthMonth)', async () => {
        await request(app.getHttpServer())
          .post('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            arrivalDate: '2024-01-15T00:00:00Z',
            animalNameCode: `TEST-${Date.now()}`,
            birthYear: 2022,
            birthMonth: 13,
            animalTypeId: testAnimalTypeId,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(400);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .post('/animals')
          .send({
            arrivalDate: '2024-01-15T00:00:00Z',
            animalNameCode: `TEST-${Date.now()}`,
            birthYear: 2022,
            birthMonth: 6,
            animalTypeId: testAnimalTypeId,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /animals
    // -------------------------------------------------------------------------
    describe('GET /animals', () => {
      it('should return paginated animals (200)', async () => {
        await request(app.getHttpServer())
          .post('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            arrivalDate: '2024-01-15T00:00:00Z',
            animalNameCode: `ANIMAL-A-${Date.now()}`,
            birthYear: 2022,
            birthMonth: 1,
            animalTypeId: testAnimalTypeId,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(201);

        await request(app.getHttpServer())
          .post('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            arrivalDate: '2024-02-15T00:00:00Z',
            animalNameCode: `ANIMAL-B-${Date.now()}`,
            birthYear: 2021,
            birthMonth: 3,
            animalTypeId: testAnimalTypeId,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
        expect(response.body.meta).toHaveProperty('total');
        expect(response.body.meta).toHaveProperty('lastPage');
        expect(response.body.meta).toHaveProperty('currentPage');
      });

      it('should support search by animalNameCode', async () => {
        const uniqueCode = `UNIQUE-SEARCH-${Date.now()}`;
        await request(app.getHttpServer())
          .post('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            arrivalDate: '2024-01-15T00:00:00Z',
            animalNameCode: uniqueCode,
            birthYear: 2022,
            birthMonth: 6,
            animalTypeId: testAnimalTypeId,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/animals')
          .query({ search: uniqueCode })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(
          response.body.data.some((a: any) => a.animalNameCode === uniqueCode),
        ).toBe(true);
      });

      it('should support pagination params', async () => {
        const response = await request(app.getHttpServer())
          .get('/animals')
          .query({ page: 1, perPage: 1 })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeLessThanOrEqual(1);
        expect(response.body.meta.currentPage).toBe(1);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer()).get('/animals').expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /animals/:id
    // -------------------------------------------------------------------------
    describe('GET /animals/:id', () => {
      it('should return an animal by id (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            arrivalDate: '2024-01-15T00:00:00Z',
            animalNameCode: `TEST-GET-${Date.now()}`,
            birthYear: 2022,
            birthMonth: 6,
            animalTypeId: testAnimalTypeId,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get(`/animals/${createRes.body.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(createRes.body.id);
        expect(response.body).toHaveProperty('animalNameCode');
        expect(response.body).toHaveProperty('animalType');
        expect(response.body).toHaveProperty('animalBreed');
        expect(response.body).toHaveProperty('animalColor');
      });

      it('should return 404 for non-existent animal', async () => {
        await request(app.getHttpServer())
          .get('/animals/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            arrivalDate: '2024-01-15T00:00:00Z',
            animalNameCode: `TEST-AUTH-${Date.now()}`,
            birthYear: 2022,
            birthMonth: 6,
            animalTypeId: testAnimalTypeId,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(201);

        await request(app.getHttpServer())
          .get(`/animals/${createRes.body.id}`)
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // PATCH /animals/:id
    // -------------------------------------------------------------------------
    describe('PATCH /animals/:id', () => {
      it('should update an animal (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            arrivalDate: '2024-01-15T00:00:00Z',
            animalNameCode: `TEST-PATCH-${Date.now()}`,
            birthYear: 2022,
            birthMonth: 6,
            animalTypeId: testAnimalTypeId,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(201);

        const newCode = `UPDATED-${Date.now()}`;
        const response = await request(app.getHttpServer())
          .patch(`/animals/${createRes.body.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ animalNameCode: newCode })
          .expect(200);

        expect(response.body.id).toBe(createRes.body.id);
        expect(response.body.animalNameCode).toBe(newCode);
      });

      it('should return 404 for non-existent animal', async () => {
        await request(app.getHttpServer())
          .patch('/animals/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ animalNameCode: 'UPDATED' })
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            arrivalDate: '2024-01-15T00:00:00Z',
            animalNameCode: `TEST-NOAUTH-${Date.now()}`,
            birthYear: 2022,
            birthMonth: 6,
            animalTypeId: testAnimalTypeId,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(201);

        await request(app.getHttpServer())
          .patch(`/animals/${createRes.body.id}`)
          .send({ animalNameCode: 'UPDATED' })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // DELETE /animals/:id
    // -------------------------------------------------------------------------
    describe('DELETE /animals/:id', () => {
      it('should delete an animal (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            arrivalDate: '2024-01-15T00:00:00Z',
            animalNameCode: `TEST-DELETE-${Date.now()}`,
            birthYear: 2022,
            birthMonth: 6,
            animalTypeId: testAnimalTypeId,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(201);

        const animalId = createRes.body.id;

        const response = await request(app.getHttpServer())
          .delete(`/animals/${animalId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(animalId);

        // Verify the animal is gone
        await request(app.getHttpServer())
          .get(`/animals/${animalId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 404 for non-existent animal', async () => {
        await request(app.getHttpServer())
          .delete('/animals/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/animals')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            arrivalDate: '2024-01-15T00:00:00Z',
            animalNameCode: `TEST-DELAUTH-${Date.now()}`,
            birthYear: 2022,
            birthMonth: 6,
            animalTypeId: testAnimalTypeId,
            animalBreedId: testBreedId,
            animalColorId: testColorId,
          })
          .expect(201);

        await request(app.getHttpServer())
          .delete(`/animals/${createRes.body.id}`)
          .expect(401);
      });
    });
  });
});

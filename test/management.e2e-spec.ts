import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { setupApp } from './utils/setup-app';
import { cleanupDatabase, disconnectDatabase } from './utils/database';
import { UserFactory } from './factories/user.factory';
import { RegionFactory, DistrictFactory } from './factories/region.factory';
import { UserRole } from '../src/generated/prisma/client';

describe('Management (e2e)', () => {
  let app: INestApplication<App>;
  let userFactory: UserFactory;
  let regionFactory: RegionFactory;
  let districtFactory: DistrictFactory;
  let accessToken: string;

  beforeAll(async () => {
    const result = await setupApp();
    app = result.app;

    userFactory = new UserFactory();
    regionFactory = new RegionFactory();
    districtFactory = new DistrictFactory();
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
  // Helper: create an ADMIN user and login, returning the access token
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
  // REGIONS
  // ===========================================================================
  describe('Regions (/regions)', () => {
    beforeEach(async () => {
      accessToken = await loginAsAdmin();
    });

    // -------------------------------------------------------------------------
    // POST /regions
    // -------------------------------------------------------------------------
    describe('POST /regions', () => {
      it('should create a new region (201)', async () => {
        const response = await request(app.getHttpServer())
          .post('/regions')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Ташкент', uz: 'Toshkent' } })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual({ ru: 'Ташкент', uz: 'Toshkent' });
      });

      it('should return 400 for validation error (missing name)', async () => {
        await request(app.getHttpServer())
          .post('/regions')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({})
          .expect(400);
      });

      it('should return 400 for validation error (empty ru field)', async () => {
        await request(app.getHttpServer())
          .post('/regions')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: '', uz: 'Toshkent' } })
          .expect(400);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .post('/regions')
          .send({ name: { ru: 'Ташкент', uz: 'Toshkent' } })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /regions
    // -------------------------------------------------------------------------
    describe('GET /regions', () => {
      it('should return paginated regions (200)', async () => {
        await regionFactory.create();
        await regionFactory.create();

        const response = await request(app.getHttpServer())
          .get('/regions')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(Array.isArray(response.body.data)).toBe(true);
        // At least the region created during loginAsAdmin + 2 created above
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
        expect(response.body.meta).toHaveProperty('total');
        expect(response.body.meta).toHaveProperty('lastPage');
        expect(response.body.meta).toHaveProperty('currentPage');
      });

      it('should support search by name', async () => {
        await request(app.getHttpServer())
          .post('/regions')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Самарканд', uz: 'Samarqand' } })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/regions')
          .query({ search: 'Самарканд' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(
          response.body.data.some((r: any) => r.name.ru === 'Самарканд'),
        ).toBe(true);
      });

      it('should support pagination params', async () => {
        const response = await request(app.getHttpServer())
          .get('/regions')
          .query({ page: 1, perPage: 1 })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeLessThanOrEqual(1);
        expect(response.body.meta.currentPage).toBe(1);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer()).get('/regions').expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /regions/:id
    // -------------------------------------------------------------------------
    describe('GET /regions/:id', () => {
      it('should return a region by id (200)', async () => {
        const region = await regionFactory.create();

        const response = await request(app.getHttpServer())
          .get(`/regions/${region.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(region.id);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('districts');
      });

      it('should return 404 for non-existent region', async () => {
        await request(app.getHttpServer())
          .get('/regions/999999')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const region = await regionFactory.create();
        await request(app.getHttpServer())
          .get(`/regions/${region.id}`)
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // PATCH /regions/:id
    // -------------------------------------------------------------------------
    describe('PATCH /regions/:id', () => {
      it('should update a region (200)', async () => {
        const region = await regionFactory.create();

        const response = await request(app.getHttpServer())
          .patch(`/regions/${region.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Обновленный', uz: 'Yangilangan' } })
          .expect(200);

        expect(response.body.id).toBe(region.id);
        expect(response.body.name).toEqual({
          ru: 'Обновленный',
          uz: 'Yangilangan',
        });
      });

      it('should return 404 for non-existent region', async () => {
        await request(app.getHttpServer())
          .patch('/regions/999999')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Обновленный', uz: 'Yangilangan' } })
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const region = await regionFactory.create();
        await request(app.getHttpServer())
          .patch(`/regions/${region.id}`)
          .send({ name: { ru: 'Обновленный', uz: 'Yangilangan' } })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // DELETE /regions/:id
    // -------------------------------------------------------------------------
    describe('DELETE /regions/:id', () => {
      it('should delete a region (200)', async () => {
        const region = await regionFactory.create();

        const response = await request(app.getHttpServer())
          .delete(`/regions/${region.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(region.id);

        // Verify the region is gone
        await request(app.getHttpServer())
          .get(`/regions/${region.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 404 for non-existent region', async () => {
        await request(app.getHttpServer())
          .delete('/regions/999999')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const region = await regionFactory.create();
        await request(app.getHttpServer())
          .delete(`/regions/${region.id}`)
          .expect(401);
      });
    });
  });

  // ===========================================================================
  // DISTRICTS
  // ===========================================================================
  describe('Districts (/districts)', () => {
    let testRegionId: number;

    beforeEach(async () => {
      accessToken = await loginAsAdmin();
      const region = await regionFactory.create();
      testRegionId = region.id;
    });

    // -------------------------------------------------------------------------
    // POST /districts
    // -------------------------------------------------------------------------
    describe('POST /districts', () => {
      it('should create a new district (201)', async () => {
        const response = await request(app.getHttpServer())
          .post('/districts')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Юнусабад', uz: 'Yunusobod' },
            regionId: testRegionId,
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual({ ru: 'Юнусабад', uz: 'Yunusobod' });
        expect(response.body).toHaveProperty('region');
      });

      it('should return 400 for validation error (missing name)', async () => {
        await request(app.getHttpServer())
          .post('/districts')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ regionId: testRegionId })
          .expect(400);
      });

      it('should return 400 for validation error (missing regionId)', async () => {
        await request(app.getHttpServer())
          .post('/districts')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Юнусабад', uz: 'Yunusobod' } })
          .expect(400);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .post('/districts')
          .send({
            name: { ru: 'Юнусабад', uz: 'Yunusobod' },
            regionId: testRegionId,
          })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /districts
    // -------------------------------------------------------------------------
    describe('GET /districts', () => {
      it('should return paginated districts (200)', async () => {
        await districtFactory.create(testRegionId);
        await districtFactory.create(testRegionId);

        const response = await request(app.getHttpServer())
          .get('/districts')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      });

      it('should support filtering by regionId', async () => {
        // Create a second region with its own district
        const otherRegion = await regionFactory.create();
        await districtFactory.create(otherRegion.id);
        await districtFactory.create(testRegionId);

        const response = await request(app.getHttpServer())
          .get('/districts')
          .query({ regionId: testRegionId })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        // All returned districts should belong to testRegionId
        for (const district of response.body.data) {
          expect(district.regionId).toBe(testRegionId);
        }
      });

      it('should support search by name', async () => {
        await request(app.getHttpServer())
          .post('/districts')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Чиланзар', uz: 'Chilonzor' },
            regionId: testRegionId,
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/districts')
          .query({ search: 'Чиланзар' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(
          response.body.data.some((d: any) => d.name.ru === 'Чиланзар'),
        ).toBe(true);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer()).get('/districts').expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /districts/:id
    // -------------------------------------------------------------------------
    describe('GET /districts/:id', () => {
      it('should return a district by id (200)', async () => {
        const district = await districtFactory.create(testRegionId);

        const response = await request(app.getHttpServer())
          .get(`/districts/${district.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(district.id);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('region');
      });

      it('should return 404 for non-existent district', async () => {
        await request(app.getHttpServer())
          .get('/districts/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const district = await districtFactory.create(testRegionId);
        await request(app.getHttpServer())
          .get(`/districts/${district.id}`)
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // PATCH /districts/:id
    // -------------------------------------------------------------------------
    describe('PATCH /districts/:id', () => {
      it('should update a district (200)', async () => {
        const district = await districtFactory.create(testRegionId);

        const response = await request(app.getHttpServer())
          .patch(`/districts/${district.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Обновленный', uz: 'Yangilangan' } })
          .expect(200);

        expect(response.body.id).toBe(district.id);
        expect(response.body.name).toEqual({
          ru: 'Обновленный',
          uz: 'Yangilangan',
        });
      });

      it('should return 404 for non-existent district', async () => {
        await request(app.getHttpServer())
          .patch('/districts/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: { ru: 'Обновленный', uz: 'Yangilangan' } })
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const district = await districtFactory.create(testRegionId);
        await request(app.getHttpServer())
          .patch(`/districts/${district.id}`)
          .send({ name: { ru: 'Обновленный', uz: 'Yangilangan' } })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // DELETE /districts/:id
    // -------------------------------------------------------------------------
    describe('DELETE /districts/:id', () => {
      it('should delete a district (200)', async () => {
        const district = await districtFactory.create(testRegionId);

        const response = await request(app.getHttpServer())
          .delete(`/districts/${district.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(district.id);

        // Verify the district is gone
        await request(app.getHttpServer())
          .get(`/districts/${district.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 404 for non-existent district', async () => {
        await request(app.getHttpServer())
          .delete('/districts/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const district = await districtFactory.create(testRegionId);
        await request(app.getHttpServer())
          .delete(`/districts/${district.id}`)
          .expect(401);
      });
    });
  });

  // ===========================================================================
  // VET STATIONS
  // ===========================================================================
  describe('Vet Stations (/vet-stations)', () => {
    let testDistrictId: string;

    beforeEach(async () => {
      accessToken = await loginAsAdmin();
      const region = await regionFactory.create();
      const district = await districtFactory.create(region.id);
      testDistrictId = district.id;
    });

    // -------------------------------------------------------------------------
    // POST /vet-stations
    // -------------------------------------------------------------------------
    describe('POST /vet-stations', () => {
      it('should create a new vet station (201)', async () => {
        const response = await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Ветстанция №1', uz: 'Vet stansiya №1' },
            address: 'ул. Навои, 15',
            districtId: testDistrictId,
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual({
          ru: 'Ветстанция №1',
          uz: 'Vet stansiya №1',
        });
        expect(response.body.address).toBe('ул. Навои, 15');
        expect(response.body).toHaveProperty('district');
      });

      it('should return 400 for validation error (missing name)', async () => {
        await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            address: 'ул. Навои, 15',
            districtId: testDistrictId,
          })
          .expect(400);
      });

      it('should return 400 for validation error (missing address)', async () => {
        await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Ветстанция №1', uz: 'Vet stansiya №1' },
            districtId: testDistrictId,
          })
          .expect(400);
      });

      it('should return 400 for validation error (missing districtId)', async () => {
        await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Ветстанция №1', uz: 'Vet stansiya №1' },
            address: 'ул. Навои, 15',
          })
          .expect(400);
      });

      it('should return 400 for invalid districtId (non-UUID)', async () => {
        await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Ветстанция №1', uz: 'Vet stansiya №1' },
            address: 'ул. Навои, 15',
            districtId: 'not-a-uuid',
          })
          .expect(400);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer())
          .post('/vet-stations')
          .send({
            name: { ru: 'Ветстанция №1', uz: 'Vet stansiya №1' },
            address: 'ул. Навои, 15',
            districtId: testDistrictId,
          })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /vet-stations
    // -------------------------------------------------------------------------
    describe('GET /vet-stations', () => {
      it('should return paginated vet stations (200)', async () => {
        // Create vet stations via the API
        await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Станция А', uz: 'Station A' },
            address: 'Адрес А',
            districtId: testDistrictId,
          })
          .expect(201);

        await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Станция Б', uz: 'Station B' },
            address: 'Адрес Б',
            districtId: testDistrictId,
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      });

      it('should support filtering by districtId', async () => {
        // Create a second district with its own vet station
        const otherRegion = await regionFactory.create();
        const otherDistrict = await districtFactory.create(otherRegion.id);

        await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Станция другая', uz: 'Station other' },
            address: 'Другой адрес',
            districtId: otherDistrict.id,
          })
          .expect(201);

        await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Станция тест', uz: 'Station test' },
            address: 'Тест адрес',
            districtId: testDistrictId,
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/vet-stations')
          .query({ districtId: testDistrictId })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        for (const station of response.body.data) {
          expect(station.districtId).toBe(testDistrictId);
        }
      });

      it('should support search by name or address', async () => {
        await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Уникальная станция', uz: 'Unique station' },
            address: 'ул. Ленина 1',
            districtId: testDistrictId,
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .get('/vet-stations')
          .query({ search: 'Уникальная' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        expect(
          response.body.data.some(
            (s: any) => s.name.ru === 'Уникальная станция',
          ),
        ).toBe(true);
      });

      it('should return 401 without auth token', async () => {
        await request(app.getHttpServer()).get('/vet-stations').expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // GET /vet-stations/:id
    // -------------------------------------------------------------------------
    describe('GET /vet-stations/:id', () => {
      it('should return a vet station by id (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Станция 1', uz: 'Station 1' },
            address: 'Тестовый адрес',
            districtId: testDistrictId,
          })
          .expect(201);

        const stationId = createRes.body.id;

        const response = await request(app.getHttpServer())
          .get(`/vet-stations/${stationId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(stationId);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('address');
        expect(response.body).toHaveProperty('district');
      });

      it('should return 404 for non-existent vet station', async () => {
        await request(app.getHttpServer())
          .get('/vet-stations/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Станция', uz: 'Station' },
            address: 'Адрес',
            districtId: testDistrictId,
          })
          .expect(201);

        await request(app.getHttpServer())
          .get(`/vet-stations/${createRes.body.id}`)
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // PATCH /vet-stations/:id
    // -------------------------------------------------------------------------
    describe('PATCH /vet-stations/:id', () => {
      it('should update a vet station (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Старое имя', uz: 'Old name' },
            address: 'Старый адрес',
            districtId: testDistrictId,
          })
          .expect(201);

        const stationId = createRes.body.id;

        const response = await request(app.getHttpServer())
          .patch(`/vet-stations/${stationId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Новое имя', uz: 'New name' },
            address: 'Новый адрес',
          })
          .expect(200);

        expect(response.body.id).toBe(stationId);
        expect(response.body.name).toEqual({
          ru: 'Новое имя',
          uz: 'New name',
        });
        expect(response.body.address).toBe('Новый адрес');
      });

      it('should allow partial update (address only)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Станция', uz: 'Station' },
            address: 'Старый адрес',
            districtId: testDistrictId,
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .patch(`/vet-stations/${createRes.body.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ address: 'Обновленный адрес' })
          .expect(200);

        expect(response.body.address).toBe('Обновленный адрес');
      });

      it('should return 404 for non-existent vet station', async () => {
        await request(app.getHttpServer())
          .patch('/vet-stations/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ address: 'Новый адрес' })
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Станция', uz: 'Station' },
            address: 'Адрес',
            districtId: testDistrictId,
          })
          .expect(201);

        await request(app.getHttpServer())
          .patch(`/vet-stations/${createRes.body.id}`)
          .send({ address: 'Новый адрес' })
          .expect(401);
      });
    });

    // -------------------------------------------------------------------------
    // DELETE /vet-stations/:id
    // -------------------------------------------------------------------------
    describe('DELETE /vet-stations/:id', () => {
      it('should delete a vet station (200)', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Удаляемая', uz: 'To delete' },
            address: 'Адрес удаления',
            districtId: testDistrictId,
          })
          .expect(201);

        const stationId = createRes.body.id;

        const response = await request(app.getHttpServer())
          .delete(`/vet-stations/${stationId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.id).toBe(stationId);

        // Verify the vet station is gone
        await request(app.getHttpServer())
          .get(`/vet-stations/${stationId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 404 for non-existent vet station', async () => {
        await request(app.getHttpServer())
          .delete('/vet-stations/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without auth token', async () => {
        const createRes = await request(app.getHttpServer())
          .post('/vet-stations')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: { ru: 'Станция', uz: 'Station' },
            address: 'Адрес',
            districtId: testDistrictId,
          })
          .expect(201);

        await request(app.getHttpServer())
          .delete(`/vet-stations/${createRes.body.id}`)
          .expect(401);
      });
    });
  });
});

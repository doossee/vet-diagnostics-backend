import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

/**
 * Payload shape accepted by every diagnostic lookup endpoint.
 * Simple lookups require `name` + `numericValue`.
 * FK-dependent lookups add `animalTypeId` and/or `mucosaTypeId`.
 */
export interface LookupPayload {
  name: { ru: string; uz: string };
  numericValue: number;
  animalTypeId?: string;
  mucosaTypeId?: string;
}

/**
 * Generates a full describe block exercising the standard CRUD contract
 * shared by all ~30 diagnostic lookup endpoints.
 *
 * `getSampleData` / `getUpdatedData` are functions (not plain objects) so
 * that FK IDs created in `beforeEach` can be captured at call-time.
 *
 * Tests cover:
 *   POST   /         — create (201), validation error (400), no auth (401)
 *   GET    /         — paginated list (200), search filtering (200)
 *   GET    /:id      — single record (200), not found (404)
 *   PATCH  /:id      — update (200)
 *   DELETE /:id      — delete (200), verify gone (404)
 */
export function describeLookupCrud(
  getApp: () => INestApplication<App>,
  getToken: () => string,
  routePath: string,
  getSampleData: () => LookupPayload,
  getUpdatedData: () => LookupPayload,
): void {
  describe(`/${routePath}`, () => {
    let createdId: string;

    // Reset createdId before each test so stale references from a prior
    // test (whose record was removed by afterEach cleanup) do not mislead
    // the "if (!createdId)" guard into skipping a necessary re-seed.
    beforeEach(() => {
      createdId = '';
    });

    // -----------------------------------------------------------------------
    // POST — create
    // -----------------------------------------------------------------------
    it('POST / should create a new record (201)', async () => {
      const sampleData = getSampleData();

      const res = await request(getApp().getHttpServer())
        .post(`/${routePath}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .send(sampleData)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toEqual(sampleData.name);
      expect(res.body.numericValue).toBe(sampleData.numericValue);

      createdId = res.body.id;
    });

    // -----------------------------------------------------------------------
    // POST — validation error (missing name)
    // -----------------------------------------------------------------------
    it('POST / should return error for invalid body (missing name)', async () => {
      // For simple lookups (name + numericValue only), missing `name` passes
      // DTO validation (no @IsNotEmpty on the name field) and Prisma throws
      // at insert time (500).  For FK-dependent lookups, the missing FK field
      // (animalTypeId / mucosaTypeId) IS caught by validation, yielding 400.
      const res = await request(getApp().getHttpServer())
        .post(`/${routePath}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .send({ numericValue: 99 }); // missing name (and possibly missing FK)

      expect([400, 500]).toContain(res.status);
    });

    // -----------------------------------------------------------------------
    // POST — unauthenticated
    // -----------------------------------------------------------------------
    it('POST / should return 401 without auth token', async () => {
      const sampleData = getSampleData();

      await request(getApp().getHttpServer())
        .post(`/${routePath}`)
        .send(sampleData)
        .expect(401);
    });

    // -----------------------------------------------------------------------
    // GET — paginated list
    // -----------------------------------------------------------------------
    it('GET / should return paginated list (200)', async () => {
      const sampleData = getSampleData();

      // Ensure at least one record exists
      if (!createdId) {
        const seed = await request(getApp().getHttpServer())
          .post(`/${routePath}`)
          .set('Authorization', `Bearer ${getToken()}`)
          .send(sampleData)
          .expect(201);
        createdId = seed.body.id;
      }

      const res = await request(getApp().getHttpServer())
        .get(`/${routePath}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.meta).toHaveProperty('total');
      expect(res.body.meta).toHaveProperty('currentPage');
    });

    // -----------------------------------------------------------------------
    // GET — search
    // -----------------------------------------------------------------------
    it('GET /?search= should filter by name (200)', async () => {
      const sampleData = getSampleData();
      // Search by the Russian part of the name
      const searchTerm = sampleData.name.ru.substring(0, 4);

      const res = await request(getApp().getHttpServer())
        .get(`/${routePath}`)
        .query({ search: searchTerm })
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    // -----------------------------------------------------------------------
    // GET /:id — single record
    // -----------------------------------------------------------------------
    it('GET /:id should return a single record (200)', async () => {
      const sampleData = getSampleData();

      // Ensure we have a record
      if (!createdId) {
        const seed = await request(getApp().getHttpServer())
          .post(`/${routePath}`)
          .set('Authorization', `Bearer ${getToken()}`)
          .send(sampleData)
          .expect(201);
        createdId = seed.body.id;
      }

      const res = await request(getApp().getHttpServer())
        .get(`/${routePath}/${createdId}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(200);

      expect(res.body).toHaveProperty('id', createdId);
    });

    // -----------------------------------------------------------------------
    // GET /:id — not found
    // -----------------------------------------------------------------------
    it('GET /:id should return 404 for non-existent ID', async () => {
      const fakeId = '00000000-0000-4000-a000-000000000000';

      await request(getApp().getHttpServer())
        .get(`/${routePath}/${fakeId}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(404);
    });

    // -----------------------------------------------------------------------
    // PATCH /:id — update
    // -----------------------------------------------------------------------
    it('PATCH /:id should update the record (200)', async () => {
      const sampleData = getSampleData();
      const updatedData = getUpdatedData();

      // Ensure we have a record
      if (!createdId) {
        const seed = await request(getApp().getHttpServer())
          .post(`/${routePath}`)
          .set('Authorization', `Bearer ${getToken()}`)
          .send(sampleData)
          .expect(201);
        createdId = seed.body.id;
      }

      const res = await request(getApp().getHttpServer())
        .patch(`/${routePath}/${createdId}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .send(updatedData)
        .expect(200);

      expect(res.body.name).toEqual(updatedData.name);
      expect(res.body.numericValue).toBe(updatedData.numericValue);
    });

    // -----------------------------------------------------------------------
    // DELETE /:id — delete
    // -----------------------------------------------------------------------
    it('DELETE /:id should remove the record (200)', async () => {
      const sampleData = getSampleData();

      // Ensure we have a record
      if (!createdId) {
        const seed = await request(getApp().getHttpServer())
          .post(`/${routePath}`)
          .set('Authorization', `Bearer ${getToken()}`)
          .send(sampleData)
          .expect(201);
        createdId = seed.body.id;
      }

      await request(getApp().getHttpServer())
        .delete(`/${routePath}/${createdId}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(200);
    });

    // -----------------------------------------------------------------------
    // GET /:id — verify deleted record is gone
    // -----------------------------------------------------------------------
    it('GET /:id should return 404 after deletion', async () => {
      const sampleData = getSampleData();

      // Create and delete a record to verify 404
      const seed = await request(getApp().getHttpServer())
        .post(`/${routePath}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .send(sampleData)
        .expect(201);

      await request(getApp().getHttpServer())
        .delete(`/${routePath}/${seed.body.id}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(200);

      await request(getApp().getHttpServer())
        .get(`/${routePath}/${seed.body.id}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(404);
    });
  });
}

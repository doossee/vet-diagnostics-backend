import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { setupApp } from './utils/setup-app';
import { cleanupDatabase, disconnectDatabase } from './utils/database';
import { UserFactory } from './factories/user.factory';
import { RegionFactory, DistrictFactory } from './factories/region.factory';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let userFactory: UserFactory;
  let regionFactory: RegionFactory;
  let districtFactory: DistrictFactory;
  let testDistrictId: string;

  beforeAll(async () => {
    const result = await setupApp();
    app = result.app;

    userFactory = new UserFactory();
    regionFactory = new RegionFactory();
    districtFactory = new DistrictFactory();

    // Create test region and district
    const region = await regionFactory.create();
    const district = await districtFactory.create(region.id);
    testDistrictId = district.id;
  });

  afterAll(async () => {
    await cleanupDatabase();
    await disconnectDatabase();
    await app.close();
  });

  afterEach(async () => {
    await cleanupDatabase();

    // Recreate region + district for subsequent tests
    const region = await regionFactory.create();
    const district = await districtFactory.create(region.id);
    testDistrictId = district.id;
  });

  // ---------------------------------------------------------------------------
  // Helper: create a user and login, returning tokens
  // ---------------------------------------------------------------------------
  async function loginUser(
    username = 'testuser',
    password = 'password123',
  ): Promise<{ accessToken: string; refreshToken: string; userId: string }> {
    await userFactory.create({
      username,
      password,
      districtId: testDistrictId,
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password })
      .expect(200);

    return res.body;
  }

  // ===========================================================================
  // POST /auth/login
  // ===========================================================================
  describe('POST /auth/login', () => {
    it('should return tokens and user info for valid credentials', async () => {
      await userFactory.create({
        username: 'testuser',
        password: 'password123',
        districtId: testDistrictId,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser', password: 'password123' })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('role');
      expect(response.body.accessToken).toBeTruthy();
      expect(response.body.refreshToken).toBeTruthy();
      expect(response.body.userId).toBeTruthy();
    });

    it('should return 401 for non-existent username', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'nonexistent', password: 'password123' })
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it('should return 401 for wrong password', async () => {
      await userFactory.create({
        username: 'testuser',
        password: 'correctpassword',
        districtId: testDistrictId,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' })
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it('should return 400 when password is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser' })
        .expect(400);
    });

    it('should return 400 when username is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: 'password123' })
        .expect(400);
    });

    it('should return 400 when body is empty', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });

    it('should return 401 for inactive user', async () => {
      await userFactory.create({
        username: 'inactiveuser',
        password: 'password123',
        districtId: testDistrictId,
        isActive: false,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'inactiveuser', password: 'password123' })
        .expect(401);

      expect(response.body.message).toBeDefined();
    });
  });

  // ===========================================================================
  // POST /auth/refresh
  // ===========================================================================
  describe('POST /auth/refresh', () => {
    it('should return new tokens for a valid refresh token', async () => {
      const { refreshToken } = await loginUser();

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.accessToken).toBeTruthy();
      expect(response.body.refreshToken).toBeTruthy();
    });

    it('should return new tokens that differ from the originals (token rotation)', async () => {
      const { refreshToken: originalRefresh } = await loginUser();

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${originalRefresh}`)
        .expect(200);

      expect(response.body.refreshToken).not.toBe(originalRefresh);
    });

    it('should return 401 for an invalid refresh token', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 401 when no Authorization header is provided', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .expect(401);
    });

    it('should return 401 when using the old refresh token after rotation', async () => {
      const { refreshToken: originalRefresh } = await loginUser();

      // First refresh — rotates the token
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${originalRefresh}`)
        .expect(200);

      // Second attempt with the same (now stale) token should fail
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${originalRefresh}`)
        .expect(401);
    });
  });

  // ===========================================================================
  // POST /auth/logout
  // ===========================================================================
  describe('POST /auth/logout', () => {
    it('should return success with a valid refresh token', async () => {
      const { refreshToken } = await loginUser();

      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(200);

      expect(response.body).toEqual({ message: 'Successfully logged out' });
    });

    it('should return success even without an Authorization header', async () => {
      // The controller returns 200 with a success message regardless
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(200);

      expect(response.body).toEqual({ message: 'Successfully logged out' });
    });

    it('should invalidate the refresh token after logout', async () => {
      const { refreshToken } = await loginUser();

      // Logout
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(200);

      // Attempting to refresh with the same token should fail
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(401);
    });
  });

  // ===========================================================================
  // POST /auth/logout-all
  // ===========================================================================
  describe('POST /auth/logout-all', () => {
    it('should return success with a valid access token', async () => {
      const { accessToken } = await loginUser();

      const response = await request(app.getHttpServer())
        .post('/auth/logout-all')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toEqual({
        message: 'Successfully logged out from all devices',
      });
    });

    it('should return 401 without an access token', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout-all')
        .expect(401);
    });

    it('should return 401 with an invalid access token', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout-all')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should invalidate refresh tokens after logout-all', async () => {
      const { accessToken, refreshToken } = await loginUser();

      // Logout from all devices
      await request(app.getHttpServer())
        .post('/auth/logout-all')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // The refresh token should now be invalid
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(401);
    });
  });
});

import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { setupApp } from './utils/setup-app';
import { cleanupDatabase, disconnectDatabase } from './utils/database';
import { UserFactory } from './factories/user.factory';
import { RegionFactory, DistrictFactory } from './factories/region.factory';
import { UserRole } from '../src/shared/enums';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let userFactory: UserFactory;
  let regionFactory: RegionFactory;
  let districtFactory: DistrictFactory;

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
  // Helper: create a user with a given role and return user + accessToken
  // ---------------------------------------------------------------------------
  async function loginAs(role: UserRole) {
    const region = await regionFactory.create();
    const district = await districtFactory.create(region.id);
    const username = `${role.toLowerCase()}_${Date.now()}`;
    const password = 'password123';

    const user = await userFactory.create({
      username,
      password,
      role: role as any,
      districtId: district.id,
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password })
      .expect(201);

    return {
      user,
      accessToken: res.body.accessToken,
      districtId: district.id,
      regionId: region.id,
    };
  }

  // ===========================================================================
  // POST /users — Create user
  // ===========================================================================
  describe('POST /users', () => {
    it('should create a new VETERINARIAN user (201)', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'new_vet_user',
          password: 'password123',
          firstName: 'Vet',
          lastName: 'Doctor',
          email: 'vet@example.com',
          phone: '+998901111111',
          districtId,
          role: UserRole.VETERINARIAN,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe('new_vet_user');
      expect(response.body.firstName).toBe('Vet');
      expect(response.body.lastName).toBe('Doctor');
      expect(response.body.role).toBe(UserRole.VETERINARIAN);
      // ClassSerializerInterceptor is now globally enabled, so @Exclude()
      // fields (password, refreshTokenHash, tokenExpiresAt) are excluded.
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('refreshTokenHash');
      expect(response.body).not.toHaveProperty('tokenExpiresAt');
    });

    it('should create a new ADMIN user (201)', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'new_admin_user',
          password: 'password123',
          firstName: 'Admin',
          email: 'admin@example.com',
          districtId,
          role: UserRole.ADMIN,
        })
        .expect(201);

      expect(response.body.role).toBe(UserRole.ADMIN);
    });

    it('should create a FARMER user with veterinarianId (201)', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      // Create a vet user via the API (which also creates VetProfile)
      const vetRes = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: `vet_for_farmer_${Date.now()}`,
          password: 'password123',
          firstName: 'VetDoc',
          email: `vet_farmer_${Date.now()}@example.com`,
          districtId,
          role: UserRole.VETERINARIAN,
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: `new_farmer_user_${Date.now()}`,
          password: 'password123',
          firstName: 'Farmer',
          phone: `+99890${Math.floor(1000000 + Math.random() * 9000000)}`,
          districtId,
          role: UserRole.FARMER,
          veterinarianId: vetRes.body.id,
        })
        .expect(201);

      expect(response.body.role).toBe(UserRole.FARMER);
    });

    it('should default role to FARMER when not provided (201)', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      // Create a vet via API (which also creates VetProfile)
      const vetRes = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: `vet_default_${Date.now()}`,
          password: 'password123',
          firstName: 'VetDefault',
          email: `vet_default_${Date.now()}@example.com`,
          districtId,
          role: UserRole.VETERINARIAN,
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: `default_role_user_${Date.now()}`,
          password: 'password123',
          firstName: 'Default',
          phone: `+99890${Math.floor(1000000 + Math.random() * 9000000)}`,
          districtId,
          veterinarianId: vetRes.body.id,
        })
        .expect(201);

      expect(response.body.role).toBe(UserRole.FARMER);
    });

    it('should return 400 when username is missing', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          password: 'password123',
          firstName: 'Test',
          email: 'test@example.com',
          districtId,
        })
        .expect(400);
    });

    it('should return 400 when password is missing', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'no_password_user',
          firstName: 'Test',
          email: 'test@example.com',
          districtId,
        })
        .expect(400);
    });

    it('should return 400 when password is too short', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'short_pass_user',
          password: '12345',
          firstName: 'Test',
          email: 'test@example.com',
          districtId,
        })
        .expect(400);
    });

    it('should return 400 when firstName is missing', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'no_firstname_user',
          password: 'password123',
          email: 'test@example.com',
          districtId,
        })
        .expect(400);
    });

    it('should return 400 when districtId is missing', async () => {
      const { accessToken } = await loginAs(UserRole.ADMIN);

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'no_district_user',
          password: 'password123',
          firstName: 'Test',
          email: 'test@example.com',
        })
        .expect(400);
    });

    it('should return 400 when neither phone nor email is provided', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'no_contact_user',
          password: 'password123',
          firstName: 'Test',
          districtId,
          role: UserRole.VETERINARIAN,
        })
        .expect(400);
    });

    it('should return 400 for duplicate username', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      // Create the first user
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'duplicate_user',
          password: 'password123',
          firstName: 'First',
          email: 'first@example.com',
          districtId,
          role: UserRole.VETERINARIAN,
        })
        .expect(201);

      // Try to create another with the same username
      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'duplicate_user',
          password: 'password123',
          firstName: 'Second',
          email: 'second@example.com',
          districtId,
          role: UserRole.VETERINARIAN,
        })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should return 400 for invalid role (SUPER_ADMIN)', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'super_admin_attempt',
          password: 'password123',
          firstName: 'Test',
          email: 'super@example.com',
          districtId,
          role: UserRole.SUPER_ADMIN,
        })
        .expect(400);
    });

    it('should return 400 for invalid districtId (non-UUID)', async () => {
      const { accessToken } = await loginAs(UserRole.ADMIN);

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'invalid_district_user',
          password: 'password123',
          firstName: 'Test',
          email: 'test@example.com',
          districtId: 'not-a-uuid',
          role: UserRole.VETERINARIAN,
        })
        .expect(400);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          username: 'no_auth_user',
          password: 'password123',
          firstName: 'Test',
          email: 'test@example.com',
          districtId: '00000000-0000-0000-0000-000000000000',
          role: UserRole.VETERINARIAN,
        })
        .expect(401);
    });

    it('should return 403 as VETERINARIAN (admin-only endpoint)', async () => {
      const { accessToken } = await loginAs(UserRole.VETERINARIAN);

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'vet_create_attempt',
          password: 'password123',
          firstName: 'Test',
          email: 'test@example.com',
          districtId: '00000000-0000-0000-0000-000000000000',
          role: UserRole.VETERINARIAN,
        })
        .expect(403);
    });
  });

  // ===========================================================================
  // GET /users — List users
  // ===========================================================================
  describe('GET /users', () => {
    it('should return paginated list of users (200)', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      // Create additional users
      await userFactory.create({
        username: `extra_user_1_${Date.now()}`,
        districtId,
      });
      await userFactory.create({
        username: `extra_user_2_${Date.now()}`,
        districtId,
      });

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
      // At least the admin + 2 extra users
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta).toHaveProperty('lastPage');
      expect(response.body.meta).toHaveProperty('currentPage');
    });

    it('should support pagination params', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      await userFactory.createMany(3, { districtId });

      const response = await request(app.getHttpServer())
        .get('/users')
        .query({ page: 1, perPage: 2 })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.meta.currentPage).toBe(1);
    });

    it('should support search by firstName or lastName', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      await userFactory.create({
        username: `searchable_${Date.now()}`,
        firstName: 'Searchable',
        lastName: 'Person',
        districtId,
      });

      const response = await request(app.getHttpServer())
        .get('/users')
        .query({ search: 'Searchable' })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      expect(
        response.body.data.some((u: any) => u.firstName === 'Searchable'),
      ).toBe(true);
    });

    it('should support filter by role', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      await userFactory.create({
        username: `vet_filter_${Date.now()}`,
        role: UserRole.VETERINARIAN as any,
        districtId,
      });

      const response = await request(app.getHttpServer())
        .get('/users')
        .query({ role: UserRole.VETERINARIAN })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      for (const user of response.body.data) {
        expect(user.role).toBe(UserRole.VETERINARIAN);
      }
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer()).get('/users').expect(401);
    });

    it('should return 403 as VETERINARIAN (admin-only endpoint)', async () => {
      const { accessToken } = await loginAs(UserRole.VETERINARIAN);

      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });

    it('should exclude sensitive fields from user list (ClassSerializerInterceptor active)', async () => {
      const { accessToken } = await loginAs(UserRole.ADMIN);

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // ClassSerializerInterceptor is globally enabled, so @Exclude()
      // fields (password, refreshTokenHash, tokenExpiresAt) are excluded.
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      for (const user of response.body.data) {
        expect(user).not.toHaveProperty('password');
        expect(user).not.toHaveProperty('refreshTokenHash');
        expect(user).not.toHaveProperty('tokenExpiresAt');
      }
    });
  });

  // ===========================================================================
  // GET /users/me — Current user profile
  // ===========================================================================
  describe('GET /users/me', () => {
    it('should return the current user profile (200)', async () => {
      const { user, accessToken } = await loginAs(UserRole.VETERINARIAN);

      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(user.id);
      expect(response.body.username).toBe(user.username);
      expect(response.body.firstName).toBe(user.firstName);
      expect(response.body.role).toBe(UserRole.VETERINARIAN);
    });

    it('should work for any authenticated role (ADMIN)', async () => {
      const { user, accessToken } = await loginAs(UserRole.ADMIN);

      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(user.id);
      expect(response.body.role).toBe(UserRole.ADMIN);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer()).get('/users/me').expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  // ===========================================================================
  // PATCH /users/me — Update own profile
  // ===========================================================================
  describe('PATCH /users/me', () => {
    it('should update the current user firstName (200)', async () => {
      const { accessToken } = await loginAs(UserRole.VETERINARIAN);

      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ firstName: 'UpdatedFirst' })
        .expect(200);

      expect(response.body.firstName).toBe('UpdatedFirst');
    });

    it('should update multiple fields at once (200)', async () => {
      const { accessToken } = await loginAs(UserRole.VETERINARIAN);

      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          firstName: 'NewFirst',
          lastName: 'NewLast',
          email: 'newemail@example.com',
        })
        .expect(200);

      expect(response.body.firstName).toBe('NewFirst');
      expect(response.body.lastName).toBe('NewLast');
      expect(response.body.email).toBe('newemail@example.com');
    });

    it('should not allow updating password via this endpoint', async () => {
      const { accessToken } = await loginAs(UserRole.VETERINARIAN);

      // UpdateUserDto omits password, so it should be stripped by whitelist
      await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ password: 'newpassword123' })
        .expect(400);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .patch('/users/me')
        .send({ firstName: 'Updated' })
        .expect(401);
    });
  });

  // ===========================================================================
  // PATCH /users/me/change-password — Change own password
  // ===========================================================================
  describe('PATCH /users/me/change-password', () => {
    it('should change password with correct current password (200)', async () => {
      const { accessToken } = await loginAs(UserRole.VETERINARIAN);

      const response = await request(app.getHttpServer())
        .patch('/users/me/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456',
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
    });

    it('should allow login with the new password after change', async () => {
      const { user, accessToken } = await loginAs(UserRole.VETERINARIAN);

      // Change the password
      await request(app.getHttpServer())
        .patch('/users/me/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456',
        })
        .expect(200);

      // Login with the new password
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: user.username, password: 'newpassword456' })
        .expect(201);
    });

    it('should reject login with the old password after change', async () => {
      const { user, accessToken } = await loginAs(UserRole.VETERINARIAN);

      // Change the password
      await request(app.getHttpServer())
        .patch('/users/me/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456',
        })
        .expect(200);

      // Old password should fail
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: user.username, password: 'password123' })
        .expect(401);
    });

    it('should return 401 when current password is incorrect', async () => {
      const { accessToken } = await loginAs(UserRole.VETERINARIAN);

      await request(app.getHttpServer())
        .patch('/users/me/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword456',
        })
        .expect(401);
    });

    it('should return 400 when newPassword is too short', async () => {
      const { accessToken } = await loginAs(UserRole.VETERINARIAN);

      await request(app.getHttpServer())
        .patch('/users/me/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: '12345',
        })
        .expect(400);
    });

    it('should return 400 when currentPassword is missing', async () => {
      const { accessToken } = await loginAs(UserRole.VETERINARIAN);

      await request(app.getHttpServer())
        .patch('/users/me/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          newPassword: 'newpassword456',
        })
        .expect(400);
    });

    it('should return 400 when newPassword is missing', async () => {
      const { accessToken } = await loginAs(UserRole.VETERINARIAN);

      await request(app.getHttpServer())
        .patch('/users/me/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'password123',
        })
        .expect(400);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .patch('/users/me/change-password')
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456',
        })
        .expect(401);
    });
  });

  // ===========================================================================
  // GET /users/:id — Get user by ID (admin only)
  // ===========================================================================
  describe('GET /users/:id', () => {
    it('should return a user by id for admin (200)', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      const target = await userFactory.create({
        username: `target_user_${Date.now()}`,
        districtId,
      });

      const response = await request(app.getHttpServer())
        .get(`/users/${target.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(target.id);
      expect(response.body.username).toBe(target.username);
    });

    it('should return 400 for non-existent user', async () => {
      const { accessToken } = await loginAs(UserRole.ADMIN);

      await request(app.getHttpServer())
        .get('/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should return 400 for invalid UUID format', async () => {
      const { accessToken } = await loginAs(UserRole.ADMIN);

      await request(app.getHttpServer())
        .get('/users/not-a-uuid')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should return 403 for non-admin user (VETERINARIAN)', async () => {
      const { accessToken: vetToken, districtId } = await loginAs(
        UserRole.VETERINARIAN,
      );

      const target = await userFactory.create({
        username: `target_for_vet_${Date.now()}`,
        districtId,
      });

      await request(app.getHttpServer())
        .get(`/users/${target.id}`)
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(403);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .get('/users/00000000-0000-0000-0000-000000000000')
        .expect(401);
    });
  });

  // ===========================================================================
  // PATCH /users/:id — Update user by ID (admin only)
  // ===========================================================================
  describe('PATCH /users/:id', () => {
    it('should update a user by id for admin (200)', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      const target = await userFactory.create({
        username: `update_target_${Date.now()}`,
        districtId,
      });

      const response = await request(app.getHttpServer())
        .patch(`/users/${target.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ firstName: 'AdminUpdated', lastName: 'ByAdmin' })
        .expect(200);

      expect(response.body.id).toBe(target.id);
      expect(response.body.firstName).toBe('AdminUpdated');
      expect(response.body.lastName).toBe('ByAdmin');
    });

    it('should allow partial update (only firstName)', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      const target = await userFactory.create({
        username: `partial_update_${Date.now()}`,
        districtId,
      });

      const response = await request(app.getHttpServer())
        .patch(`/users/${target.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ firstName: 'PartiallyUpdated' })
        .expect(200);

      expect(response.body.firstName).toBe('PartiallyUpdated');
    });

    it('should return 403 for non-admin user (VETERINARIAN)', async () => {
      const { accessToken: vetToken, districtId } = await loginAs(
        UserRole.VETERINARIAN,
      );

      const target = await userFactory.create({
        username: `vet_update_target_${Date.now()}`,
        districtId,
      });

      await request(app.getHttpServer())
        .patch(`/users/${target.id}`)
        .set('Authorization', `Bearer ${vetToken}`)
        .send({ firstName: 'ShouldFail' })
        .expect(403);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .patch('/users/00000000-0000-0000-0000-000000000000')
        .send({ firstName: 'ShouldFail' })
        .expect(401);
    });
  });

  // ===========================================================================
  // DELETE /users/:id — Delete user (admin only)
  // ===========================================================================
  describe('DELETE /users/:id', () => {
    it('should delete a user for admin (200)', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      const target = await userFactory.create({
        username: `delete_target_${Date.now()}`,
        districtId,
      });

      const response = await request(app.getHttpServer())
        .delete(`/users/${target.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(target.id);

      // Verify user is gone (findOne throws BadRequestException => 400)
      await request(app.getHttpServer())
        .get(`/users/${target.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should return 403 for non-admin user (VETERINARIAN)', async () => {
      const { accessToken: vetToken, districtId } = await loginAs(
        UserRole.VETERINARIAN,
      );

      const target = await userFactory.create({
        username: `vet_delete_target_${Date.now()}`,
        districtId,
      });

      await request(app.getHttpServer())
        .delete(`/users/${target.id}`)
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(403);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .delete('/users/00000000-0000-0000-0000-000000000000')
        .expect(401);
    });
  });

  // ===========================================================================
  // PATCH /users/:id/change-password — Admin changes user password
  // ===========================================================================
  describe('PATCH /users/:id/change-password', () => {
    it('should change another user password for admin (200)', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      const target = await userFactory.create({
        username: `admin_pwd_target_${Date.now()}`,
        password: 'password123',
        districtId,
      });

      const response = await request(app.getHttpServer())
        .patch(`/users/${target.id}/change-password`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'adminsetpassword',
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(target.id);
    });

    it('should allow the target user to login with the new password', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      const targetUsername = `login_after_change_${Date.now()}`;
      const target = await userFactory.create({
        username: targetUsername,
        password: 'password123',
        districtId,
      });

      await request(app.getHttpServer())
        .patch(`/users/${target.id}/change-password`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'changedbyAdmin1',
        })
        .expect(200);

      // Login with new password should succeed
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: targetUsername, password: 'changedbyAdmin1' })
        .expect(201);
    });

    it('should return 401 when currentPassword is incorrect', async () => {
      const { accessToken, districtId } = await loginAs(UserRole.ADMIN);

      const target = await userFactory.create({
        username: `wrong_current_pwd_${Date.now()}`,
        password: 'password123',
        districtId,
      });

      await request(app.getHttpServer())
        .patch(`/users/${target.id}/change-password`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword456',
        })
        .expect(401);
    });

    it('should return 400 for non-existent user', async () => {
      const { accessToken } = await loginAs(UserRole.ADMIN);

      await request(app.getHttpServer())
        .patch('/users/00000000-0000-0000-0000-000000000000/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456',
        })
        .expect(400);
    });

    it('should return 403 for non-admin user (VETERINARIAN)', async () => {
      const { accessToken: vetToken, districtId } = await loginAs(
        UserRole.VETERINARIAN,
      );

      const target = await userFactory.create({
        username: `vet_pwd_change_target_${Date.now()}`,
        districtId,
      });

      await request(app.getHttpServer())
        .patch(`/users/${target.id}/change-password`)
        .set('Authorization', `Bearer ${vetToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456',
        })
        .expect(403);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .patch('/users/00000000-0000-0000-0000-000000000000/change-password')
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456',
        })
        .expect(401);
    });
  });

  // ===========================================================================
  // Role-based access control — comprehensive checks
  // ===========================================================================
  describe('Role-based access control', () => {
    it('VETERINARIAN should not access admin-only GET /users/:id', async () => {
      const { accessToken: vetToken, user } = await loginAs(
        UserRole.VETERINARIAN,
      );

      await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(403);
    });

    it('VETERINARIAN should not access admin-only PATCH /users/:id', async () => {
      const { accessToken: vetToken, user } = await loginAs(
        UserRole.VETERINARIAN,
      );

      await request(app.getHttpServer())
        .patch(`/users/${user.id}`)
        .set('Authorization', `Bearer ${vetToken}`)
        .send({ firstName: 'Blocked' })
        .expect(403);
    });

    it('VETERINARIAN should not access admin-only DELETE /users/:id', async () => {
      const { accessToken: vetToken, user } = await loginAs(
        UserRole.VETERINARIAN,
      );

      await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(403);
    });

    it('VETERINARIAN should still access GET /users/me', async () => {
      const { accessToken } = await loginAs(UserRole.VETERINARIAN);

      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('VETERINARIAN should still access PATCH /users/me', async () => {
      const { accessToken } = await loginAs(UserRole.VETERINARIAN);

      await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ firstName: 'Allowed' })
        .expect(200);
    });

    it('VETERINARIAN should still access PATCH /users/me/change-password', async () => {
      const { accessToken } = await loginAs(UserRole.VETERINARIAN);

      await request(app.getHttpServer())
        .patch('/users/me/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456',
        })
        .expect(200);
    });

    it('unauthenticated requests should return 401 for all protected endpoints', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          username: 'unauth_user',
          password: 'password123',
          firstName: 'Test',
          email: 'test@example.com',
          districtId: '00000000-0000-0000-0000-000000000000',
        })
        .expect(401);

      await request(app.getHttpServer()).get('/users').expect(401);

      await request(app.getHttpServer()).get('/users/me').expect(401);

      await request(app.getHttpServer())
        .patch('/users/me')
        .send({ firstName: 'Test' })
        .expect(401);

      await request(app.getHttpServer())
        .patch('/users/me/change-password')
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456',
        })
        .expect(401);

      await request(app.getHttpServer())
        .get('/users/00000000-0000-0000-0000-000000000000')
        .expect(401);

      await request(app.getHttpServer())
        .patch('/users/00000000-0000-0000-0000-000000000000')
        .send({ firstName: 'Test' })
        .expect(401);

      await request(app.getHttpServer())
        .delete('/users/00000000-0000-0000-0000-000000000000')
        .expect(401);

      await request(app.getHttpServer())
        .patch('/users/00000000-0000-0000-0000-000000000000/change-password')
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456',
        })
        .expect(401);
    });
  });
});

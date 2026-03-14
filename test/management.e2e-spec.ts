import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { CoreModule } from '../src/core/core.module';
import { cleanupDatabase, disconnectDatabase } from './utils/database';
import { RegionFactory, DistrictFactory } from './factories/region.factory';
import { AuthTestHelper } from './helpers/auth.helper';
import { UserFactory } from './factories/user.factory';

describe('Management (e2e)', () => {
  let app: INestApplication<App>;
  let regionFactory: RegionFactory;
  let districtFactory: DistrictFactory;
  let userFactory: UserFactory;
  let authHelper: AuthTestHelper;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    regionFactory = new RegionFactory();
    districtFactory = new DistrictFactory();
    userFactory = new UserFactory();
    authHelper = new AuthTestHelper();

    // Create test region and district for user
    const region = await regionFactory.create();
    const district = await districtFactory.create(region.id);

    // Create and authenticate test user
    const user = await userFactory.create({ districtId: district.id });
    accessToken = authHelper.generateAccessToken(user);
  });

  afterAll(async () => {
    await cleanupDatabase();
    await disconnectDatabase();
    await app.close();
  });

  describe('/regions (POST)', () => {
    it('should create a new region', async () => {
      const response = await request(app.getHttpServer())
        .post('/regions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nameRu: 'Ташкент',
          nameUz: 'Toshkent',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.nameRu).toBe('Ташкент');
    });
  });

  describe('/regions (GET)', () => {
    it('should return paginated regions', async () => {
      const response = await request(app.getHttpServer())
        .get('/regions')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('/districts (POST)', () => {
    it('should create a new district', async () => {
      const region = await regionFactory.create();

      const response = await request(app.getHttpServer())
        .post('/districts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nameRu: 'Юнусабад',
          nameUz: 'Yunusabad',
          regionId: region.id,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.nameRu).toBe('Юнусабад');
    });
  });

  describe('/vet-stations (POST)', () => {
    it('should create a new vet station', async () => {
      const region = await regionFactory.create();
      const district = await districtFactory.create(region.id);

      const response = await request(app.getHttpServer())
        .post('/vet-stations')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nameRu: 'Станция №1',
          nameUz: 'Station #1',
          address: 'Test Address',
          districtId: district.id,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.nameRu).toBe('Станция №1');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { CoreModule } from '../src/core/core.module';
import { cleanupDatabase, disconnectDatabase } from './utils/database';
import { AnimalFactory } from './factories/animal.factory';
import { AuthTestHelper } from './helpers/auth.helper';
import { UserFactory } from './factories/user.factory';
import { RegionFactory, DistrictFactory } from './factories/region.factory';
import { AnimalSex } from '@prisma/client';

describe('Inventory (e2e)', () => {
  let app: INestApplication<App>;
  let animalFactory: AnimalFactory;
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

    animalFactory = new AnimalFactory();
    userFactory = new UserFactory();
    authHelper = new AuthTestHelper();

    const regionFactory = new RegionFactory();
    const districtFactory = new DistrictFactory();
    const region = await regionFactory.create();
    const district = await districtFactory.create(region.id);

    const user = await userFactory.create({ districtId: district.id });
    accessToken = authHelper.generateAccessToken(user);
  });

  afterAll(async () => {
    await cleanupDatabase();
    await disconnectDatabase();
    await app.close();
  });

  describe('/animals (POST)', () => {
    it('should create a new animal', async () => {
      const animal = await animalFactory.create();

      const response = await request(app.getHttpServer())
        .post('/animals')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          arrivalDate: new Date().toISOString(),
          age: 12,
          sex: AnimalSex.FEMALE,
          farmerId: 'farmer-id',
          animalTypeId: animal.animalTypeId,
          animalBreedId: animal.animalBreedId,
          animalColorId: animal.animalColorId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.age).toBe(12);
    });
  });

  describe('/animals (GET)', () => {
    it('should return paginated animals', async () => {
      const response = await request(app.getHttpServer())
        .get('/animals')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
    });
  });

  describe('/animal-types (POST)', () => {
    it('should create a new animal type', async () => {
      const response = await request(app.getHttpServer())
        .post('/animal-types')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nameRu: 'Крупный рогатый скот',
          nameUz: 'Qoramol',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.nameRu).toBe('Крупный рогатый скот');
    });
  });
});

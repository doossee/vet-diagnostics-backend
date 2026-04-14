import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { setupApp } from './utils/setup-app';
import { cleanupDatabase, disconnectDatabase } from './utils/database';
import { UserFactory } from './factories/user.factory';
import { RegionFactory, DistrictFactory } from './factories/region.factory';
import { AnimalTypeFactory } from './factories/animal.factory';
import { LookupFactory } from './factories/lookup.factory';
import { UserRole } from '../src/shared/enums';
import { describeLookupCrud, LookupPayload } from './utils/lookup-e2e-tests';

// =============================================================================
// Diagnostic Lookup Tables — E2E Tests
//
// All ~30 diagnostic lookup endpoints share an identical CRUD contract.
// This file uses `describeLookupCrud()` to exercise every endpoint while
// keeping the test source compact.
//
// Lookups fall into three categories:
//   1. Simple     — { name, numericValue }
//   2. AnimalType — { name, numericValue, animalTypeId }
//   3. Mucosa     — { name, numericValue, mucosaTypeId, animalTypeId }
// =============================================================================

describe('Diagnostics Lookups (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;

  // Factories
  const userFactory = new UserFactory();
  const regionFactory = new RegionFactory();
  const districtFactory = new DistrictFactory();
  const animalTypeFactory = new AnimalTypeFactory();
  const lookupFactory = new LookupFactory();

  // Shared FK IDs populated in beforeEach via ensurePrerequisites()
  let animalTypeId: string;
  let mucosaTypeId: string;

  // ---------------------------------------------------------------------------
  // Setup / teardown
  // ---------------------------------------------------------------------------
  beforeAll(async () => {
    const result = await setupApp();
    app = result.app;
  }, 30_000);

  afterAll(async () => {
    await cleanupDatabase();
    await disconnectDatabase();
    await app.close();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  // ---------------------------------------------------------------------------
  // Helper: login as ADMIN — returns access token
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res.body.accessToken;
  }

  // ---------------------------------------------------------------------------
  // Helper: create shared FK prerequisite records + login
  // ---------------------------------------------------------------------------
  async function ensurePrerequisites(): Promise<void> {
    accessToken = await loginAsAdmin();

    // AnimalType — needed by urine/feces/mucosa lookups
    const at = await animalTypeFactory.create();
    animalTypeId = at.id;

    // MucosaType — needed by mucosa-appearances
    const mt = await lookupFactory.create('mucosaType', {
      name: { ru: 'Глазная', uz: "Ko'z" },
      numericValue: 1,
    });
    mucosaTypeId = mt.id;
  }

  // ---------------------------------------------------------------------------
  // Convenience builders for sample payloads.
  // Returned as functions so FK IDs are captured at call-time (inside tests),
  // not at describe-time (when they are still undefined).
  // ---------------------------------------------------------------------------
  function simple(ru: string, uz: string, n: number): () => LookupPayload {
    return () => ({ name: { ru, uz }, numericValue: n });
  }

  function withAnimalType(
    ru: string,
    uz: string,
    n: number,
  ): () => LookupPayload {
    return () => ({ name: { ru, uz }, numericValue: n, animalTypeId });
  }

  function withMucosaAndAnimalType(
    ru: string,
    uz: string,
    n: number,
  ): () => LookupPayload {
    return () => ({
      name: { ru, uz },
      numericValue: n,
      mucosaTypeId,
      animalTypeId,
    });
  }

  // =========================================================================
  // 1. SIMPLE LOOKUPS — { name, numericValue }
  // =========================================================================
  describe('Simple lookups (name + numericValue)', () => {
    beforeEach(async () => {
      await ensurePrerequisites();
    });

    // --- Habitus ---
    describeLookupCrud(
      () => app,
      () => accessToken,
      'body-types',
      simple('Нормальный', 'Normal', 1),
      simple('Обновлённый', 'Yangilangan', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'body-positions',
      simple('Стоячее', 'Tik turish', 1),
      simple('Лежачее', 'Yotish', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'constitutions',
      simple('Крепкая', 'Mustahkam', 1),
      simple('Нежная', 'Nozik', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'temperaments',
      simple('Спокойный', 'Tinch', 1),
      simple('Возбуждённый', 'Hayajonli', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'obesity-types',
      simple('Нормальная', 'Normal', 1),
      simple('Ожирение', 'Semirish', 2),
    );

    // --- Skin ---
    describeLookupCrud(
      () => app,
      () => accessToken,
      'skin-colors',
      simple('Розовый', 'Pushti', 1),
      simple('Бледный', 'Oqish', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'skin-elasticities',
      simple('Эластичная', 'Elastik', 1),
      simple('Снижена', 'Kamaygan', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'skin-humidities',
      simple('Нормальная', 'Normal', 1),
      simple('Повышенная', 'Ortiqcha', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'skin-pains',
      simple('Отсутствует', "Yo'q", 1),
      simple('Умеренная', "O'rtacha", 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'skin-sensitivities',
      simple('Нормальная', 'Normal', 1),
      simple('Повышенная', 'Yuqori', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'skin-smells',
      simple('Нормальный', 'Normal', 1),
      simple('Неприятный', 'Yoqimsiz', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'skin-surfaces',
      simple('Гладкая', 'Silliq', 1),
      simple('Шероховатая', "G'adir-budir", 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'skin-temps',
      simple('Тёплая', 'Iliq', 1),
      simple('Холодная', 'Sovuq', 2),
    );

    // --- Skin cover ---
    describeLookupCrud(
      () => app,
      () => accessToken,
      'hair-types',
      simple('Гладкий', 'Silliq', 1),
      simple('Ломкий', "Mo'rt", 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'wool-types',
      simple('Густая', 'Qalin', 1),
      simple('Редкая', 'Siyrak', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'down-types',
      simple('Пуховой', 'Patli', 1),
      simple('Матовый', 'Xira', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'feather-types',
      simple('Блестящее', 'Yaltiroq', 1),
      simple('Ломкое', "Mo'rt", 2),
    );

    // --- Lymph nodes ---
    describeLookupCrud(
      () => app,
      () => accessToken,
      'lymph-consistencies',
      simple('Плотная', 'Zich', 1),
      simple('Мягкая', 'Yumshoq', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'lymph-mobilities',
      simple('Подвижный', 'Harakatchan', 1),
      simple('Неподвижный', 'Harakatsiz', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'lymph-pains',
      simple('Безболезненный', "Og'riqsiz", 1),
      simple('Болезненный', "Og'riqli", 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'lymph-shapes',
      simple('Овальный', 'Oval', 1),
      simple('Круглый', 'Dumaloq', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'lymph-sizes',
      simple('Нормальный', 'Normal', 1),
      simple('Увеличенный', 'Kattalashgan', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'lymph-surfaces',
      simple('Гладкая', 'Silliq', 1),
      simple('Бугристая', "G'adir-budir", 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'lymph-temps',
      simple('Нормальная', 'Normal', 1),
      simple('Повышенная', 'Yuqori', 2),
    );

    // --- Rumen ---
    describeLookupCrud(
      () => app,
      () => accessToken,
      'rumen-fluid-states',
      simple('Нормальный', 'Normal', 1),
      simple('Патологический', 'Patologik', 2),
    );

    // --- Mucosa types (simple — no FK) ---
    describeLookupCrud(
      () => app,
      () => accessToken,
      'mucosa-types',
      simple('Глазная', "Ko'z", 1),
      simple('Ротовая', "Og'iz", 2),
    );
  });

  // =========================================================================
  // 2. FK-DEPENDENT LOOKUPS — { name, numericValue, animalTypeId }
  // =========================================================================
  describe('AnimalType-dependent lookups', () => {
    beforeEach(async () => {
      await ensurePrerequisites();
    });

    // --- Feces ---
    describeLookupCrud(
      () => app,
      () => accessToken,
      'feces-colors',
      withAnimalType('Коричневый', 'Jigarrang', 1),
      withAnimalType('Тёмный', 'Qora', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'feces-consistencies',
      withAnimalType('Плотная', 'Zich', 1),
      withAnimalType('Жидкая', 'Suyuq', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'feces-forms',
      withAnimalType('Оформленный', 'Shakllangan', 1),
      withAnimalType('Неоформленный', 'Shakllanmagan', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'feces-smells',
      withAnimalType('Нормальный', 'Normal', 1),
      withAnimalType('Зловонный', "Badbo'y", 2),
    );

    // --- Urine ---
    describeLookupCrud(
      () => app,
      () => accessToken,
      'urine-colors',
      withAnimalType('Соломенный', 'Somonrang', 1),
      withAnimalType('Тёмный', 'Qora', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'urine-clarities',
      withAnimalType('Прозрачная', 'Tiniq', 1),
      withAnimalType('Мутная', 'Loyqa', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'urine-consistencies',
      withAnimalType('Водянистая', 'Suvsimon', 1),
      withAnimalType('Густая', 'Qalin', 2),
    );

    describeLookupCrud(
      () => app,
      () => accessToken,
      'urine-smells',
      withAnimalType('Нормальный', 'Normal', 1),
      withAnimalType('Аммиачный', 'Ammiak', 2),
    );
  });

  // =========================================================================
  // 3. MUCOSA APPEARANCES — { name, numericValue, mucosaTypeId, animalTypeId }
  // =========================================================================
  describe('Mucosa-appearance lookup (mucosaTypeId + animalTypeId)', () => {
    beforeEach(async () => {
      await ensurePrerequisites();
    });

    describeLookupCrud(
      () => app,
      () => accessToken,
      'mucosa-appearances',
      withMucosaAndAnimalType('Бледная', 'Oqish', 1),
      withMucosaAndAnimalType('Розовая', 'Pushti', 2),
    );
  });
});

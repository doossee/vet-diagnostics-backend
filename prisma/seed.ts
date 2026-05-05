import 'dotenv/config';
import { PrismaClient, ProphylaxisType, UserRole, UserGender } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import axios from 'axios';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Create/update .env and try again.');
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

/** Build a bilingual JSONB name value */
const n = (ru: string, uz: string) => ({ ru, uz });

async function main() {
  console.log('Start seeding ...');

  // --- 0. Clinical Exam Lookup Tables ---

  const bodyTypes = [
    { ru: 'Крепкое телосложение', uz: 'Kuchli jussali', nv: 0 },
    { ru: 'Среднее телосложение', uz: "O'rtacha jussali", nv: 1 },
    { ru: 'Слабое телосложение', uz: 'Kuchsiz jussali', nv: 2 },
  ];
  for (const item of bodyTypes) {
    await prisma.bodyType.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const obesityTypes = [
    { ru: 'Хорошая упитанность', uz: 'Yaxshi, yuqori semiz', nv: 0 },
    { ru: 'Средняя упитанность', uz: "O'rtacha semiz", nv: 1 },
    { ru: 'Ниже средней упитанности', uz: "O'rtadan past semiz", nv: 2 },
    { ru: 'Кахексия', uz: 'Kaxeksiya', nv: 3 },
  ];
  for (const item of obesityTypes) {
    await prisma.obesityType.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const bodyPositions = [
    { ru: 'Естественное', uz: 'Tabiiy', nv: 0 },
    { ru: 'Вынужденное стоячее', uz: 'Majburiy tik turgan', nv: 1 },
    { ru: 'Вынужденное лежачее', uz: 'Majburiy yotgan', nv: 2 },
    { ru: 'Вынужденное сидячее', uz: "Majburiy o'tirgan", nv: 3 },
    { ru: 'Неестественное положение', uz: "Tabiiy bo'lmagan holat", nv: 4 },
    { ru: 'Непроизвольные движения', uz: 'Ixtiyorsiz harakatlar', nv: 5 },
    { ru: 'Манежное движение', uz: 'Monejli harakat', nv: 6 },
    { ru: 'Круговое движение', uz: 'Aylanma harakat', nv: 7 },
    { ru: 'Движение вперёд', uz: 'Oldinga qarab harakat', nv: 8 },
    { ru: 'Движение назад', uz: 'Orqaga qarab harakat', nv: 9 },
    { ru: 'Движение в положении лёжа', uz: "Ag'anab yotgan joyidagi harakat", nv: 10 },
  ];
  for (const item of bodyPositions) {
    await prisma.bodyPosition.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const constitutions = [
    { ru: 'Рыхлая (нежная)', uz: 'Yumshoq', nv: 0 },
    { ru: 'Плотная (грубая)', uz: 'Mustahkam', nv: 1 },
    { ru: 'У лошадей', uz: 'Otlarda', nv: 2 },
    { ru: 'У птиц', uz: 'Parranda', nv: 3 },
  ];
  for (const item of constitutions) {
    await prisma.constitution.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const temperaments = [
    { ru: 'Меланхолик', uz: 'Melanxolik', nv: 0 },
    { ru: 'Флегматик', uz: 'Flegmatik', nv: 1 },
  ];
  for (const item of temperaments) {
    await prisma.temperament.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const woolTypes = [
    { ru: 'Равномерная', uz: 'Bir tekis', nv: 0 },
    { ru: 'Неравномерная', uz: 'Bir tekis emas', nv: 1 },
    { ru: 'Прилегает к коже', uz: 'Teriga yotib turadi', nv: 2 },
    { ru: 'Блестящая', uz: 'Yaltiroq', nv: 3 },
    { ru: 'Тусклая', uz: 'Xira', nv: 4 },
    { ru: 'Не выпадает', uz: 'Tushmaydi', nv: 5 },
    { ru: 'Взъерошенная', uz: 'Hurpaygan', nv: 6 },
    { ru: 'Свалявшаяся', uz: 'Bir-biriga yopishgan', nv: 7 },
    { ru: 'Очаговое выпадение шерсти', uz: 'Terining ayrim joylarida junlar tushgan', nv: 8 },
    { ru: 'Густая', uz: 'Qalin', nv: 9 },
    { ru: 'Редкая', uz: 'Siyrak', nv: 10 },
    { ru: 'Физиологическая линька', uz: 'Fiziologik tullash', nv: 11 },
    { ru: 'Патологическая линька', uz: 'Patologik tullash', nv: 12 },
    { ru: 'Шерсть выпадает', uz: 'Jun tushayapti', nv: 13 },
    { ru: 'Шерсть не выпадает', uz: 'Jun tushmayapti', nv: 14 },
  ];
  for (const item of woolTypes) {
    await prisma.woolType.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const downTypes = [
    { ru: 'Густой', uz: 'Zich', nv: 0 },
    { ru: 'Редкий', uz: 'Siyrak', nv: 1 },
    { ru: 'Отсутствует', uz: "Yo'q", nv: 2 },
    { ru: 'Мягкий', uz: 'Yumshoq', nv: 3 },
    { ru: 'Гладкий', uz: 'Silliq', nv: 4 },
    { ru: 'Тусклый', uz: 'Xira', nv: 5 },
    { ru: 'Блестящий', uz: 'Yaltiroq', nv: 6 },
    { ru: 'Сухой', uz: 'Quruq', nv: 7 },
    { ru: 'Запылённый', uz: 'Chang bosgan', nv: 8 },
    { ru: 'Равномерный', uz: 'Bir tekis', nv: 9 },
    { ru: 'Белого цвета', uz: 'Oq rangli', nv: 10 },
    { ru: 'Серый', uz: 'Kulrang', nv: 11 },
    { ru: 'Желтоватый', uz: "Sarg'aygan", nv: 12 },
    { ru: 'Тёмный', uz: 'Qoramtir', nv: 13 },
    { ru: 'Влажный', uz: 'Nam', nv: 14 },
  ];
  for (const item of downTypes) {
    await prisma.downType.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const hairTypes = [
    { ru: 'Жёсткий', uz: "Dag'al", nv: 0 },
    { ru: 'Редкий', uz: 'Siyrak', nv: 1 },
  ];
  for (const item of hairTypes) {
    await prisma.hairType.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const featherTypes = [
    { ru: 'Блестящие', uz: 'Yaltiroq', nv: 0 },
    { ru: 'Тусклые', uz: 'Xira', nv: 1 },
    { ru: 'Полные', uz: "To'liq", nv: 2 },
    { ru: 'Выпавшие', uz: "To'kilgan", nv: 3 },
    { ru: 'Сломанные', uz: 'Siniq', nv: 4 },
  ];
  for (const item of featherTypes) {
    await prisma.featherType.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const skinColors = [
    { ru: 'Бледно-розовый', uz: 'Och binafsha', nv: 0 },
    { ru: 'Бледный', uz: 'Oqargan', nv: 1 },
    { ru: 'Покрасневший', uz: 'Qizargan', nv: 2 },
    { ru: 'Синюшный', uz: "Ko'kargan", nv: 3 },
    { ru: 'Желтушный', uz: "Sarg'aygan", nv: 4 },
  ];
  for (const item of skinColors) {
    await prisma.skinColor.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const skinHumidities = [
    { ru: 'Умеренно влажная', uz: "O'rtacha nam", nv: 0 },
    { ru: 'Гипергидроз', uz: 'Gipergidroz', nv: 1 },
    { ru: 'Местное потоотделение', uz: 'Mahalliy terlagan', nv: 2 },
    { ru: 'Сухая — ангидроз', uz: 'Quruq – angidoz', nv: 3 },
  ];
  for (const item of skinHumidities) {
    await prisma.skinHumidity.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const skinTemps = [
    { ru: 'Температура кожи общая повышена', uz: "Teri harorati umumiy ko'tarilgan", nv: 0 },
    { ru: 'Температура кожи местная повышена', uz: "Teri harorati mahalliy ko'tarilgan", nv: 1 },
    { ru: 'Температура кожи общая понижена', uz: 'Teri harorati umumiy pasaygan', nv: 2 },
    { ru: 'Температура кожи местная понижена', uz: 'Teri harorati mahalliy pasaygan', nv: 3 },
    { ru: 'Температура кожи разная', uz: 'Teri harorati har xil', nv: 4 },
  ];
  for (const item of skinTemps) {
    await prisma.skinTemp.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const skinElasticities = [
    { ru: 'Эластичная', uz: 'Elastik', nv: 0 },
    { ru: 'Эластичность кожи снижена', uz: 'Teri elastikgi kamaygan', nv: 1 },
    { ru: 'Эластичность кожи отсутствует', uz: "Teri elastikligi umuman yo'q", nv: 2 },
  ];
  for (const item of skinElasticities) {
    await prisma.skinElasticity.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const skinSmells = [
    { ru: 'Без запаха', uz: 'Hidsiz', nv: 0 },
    { ru: 'Нормальный запах', uz: 'Normal hid', nv: 1 },
    { ru: 'Ацетоновый запах', uz: 'Atsetonli hid', nv: 2 },
    { ru: 'Гнилостный запах', uz: 'Sepgan hid', nv: 3 },
  ];
  for (const item of skinSmells) {
    await prisma.skinSmell.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const skinSurfaces = [
    { ru: 'Гладкая', uz: 'Silliq', nv: 0 },
    { ru: 'Шершавая', uz: 'Qo\'ng\'ir', nv: 1 },
    { ru: 'Влажная', uz: 'Nam', nv: 2 },
    { ru: 'Чешуйчатая', uz: 'Qavatlar bilan', nv: 3 },
  ];
  for (const item of skinSurfaces) {
    await prisma.skinSurface.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const skinSensitivities = [
    { ru: 'Нормальная', uz: 'Normal', nv: 0 },
    { ru: 'Повышенная', uz: 'Ko\'tarilgan', nv: 1 },
    { ru: 'Пониженная', uz: 'Pasaygan', nv: 2 },
  ];
  for (const item of skinSensitivities) {
    await prisma.skinSensitivity.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const skinPains = [
    { ru: 'Безболезненная', uz: "Og'riqsiz", nv: 0 },
    { ru: 'Болезненная', uz: "Og'riqli", nv: 1 },
    { ru: 'Сильно болезненная', uz: "Juda og'riqli", nv: 2 },
  ];
  for (const item of skinPains) {
    await prisma.skinPain.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const lymphSizes = [
    { ru: 'Не увеличены', uz: 'Kattarmagan', nv: 0 },
    { ru: 'Увеличены', uz: 'Kattargan', nv: 1 },
  ];
  for (const item of lymphSizes) {
    await prisma.lymphSize.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const lymphShapes = [
    { ru: 'Плоская', uz: 'Yassi', nv: 0 },
    { ru: 'Круглая', uz: 'Dumaloq', nv: 1 },
    { ru: 'Увеличенная', uz: 'Kattargan', nv: 2 },
    { ru: 'Распухшая', uz: 'Shishgan', nv: 3 },
  ];
  for (const item of lymphShapes) {
    await prisma.lymphShape.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const lymphSurfaces = [
    { ru: 'Гладкая', uz: 'Silliq', nv: 0 },
    { ru: 'Бугристая', uz: "G'adir-budir", nv: 1 },
  ];
  for (const item of lymphSurfaces) {
    await prisma.lymphSurface.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const lymphConsistencies = [
    { ru: 'Плотная', uz: 'Zich', nv: 0 },
    { ru: 'Дряблая', uz: 'Bilqillagan', nv: 1 },
    { ru: 'Своеобразная', uz: "O'ziga xos", nv: 2 },
  ];
  for (const item of lymphConsistencies) {
    await prisma.lymphConsistency.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const lymphTemps = [
    { ru: 'Умеренная', uz: "O'rtacha", nv: 0 },
    { ru: 'Повышенная', uz: 'Oshgan', nv: 1 },
  ];
  for (const item of lymphTemps) {
    await prisma.lymphTemp.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const lymphPains = [
    { ru: 'Безболезненные', uz: "Og'riqsiz", nv: 0 },
    { ru: 'Болезненные', uz: "Og'riqli", nv: 1 },
  ];
  for (const item of lymphPains) {
    await prisma.lymphPain.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const lymphMobilities = [
    { ru: 'Подвижные', uz: 'Harakatchan', nv: 0 },
    { ru: 'Малоподвижные', uz: 'Kam harakatchan', nv: 1 },
  ];
  for (const item of lymphMobilities) {
    await prisma.lymphMobility.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const rumenFluidStates = [
    { ru: 'Нормальное', uz: 'Normal', nv: 0 },
    { ru: 'Вздутие', uz: 'Bulanganlik', nv: 1 },
    { ru: 'Закупорка', uz: 'Tiqilib qolgan', nv: 2 },
    { ru: 'Гранулярное', uz: 'Zarnali', nv: 3 },
    { ru: 'Слизистое', uz: 'Limfali', nv: 4 },
  ];
  for (const item of rumenFluidStates) {
    await prisma.rumenFluidState.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const mucosaTypes = [
    { ru: 'Ротовая', uz: "Og'iz", nv: 0 },
    { ru: 'Носовая', uz: 'Burun', nv: 1 },
    { ru: 'Глазная', uz: "Ko'z", nv: 2 },
    { ru: 'Репродуктивная', uz: 'Reproduktiv organ', nv: 3 },
  ];
  for (const item of mucosaTypes) {
    await prisma.mucosaType.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const animalSexes = [
    { ru: 'Самец', uz: 'Erkak', nv: 0 },                                           // MALE
    { ru: 'Самка', uz: 'Ayol', nv: 1 },                                            // FEMALE
    { ru: 'Кастрированный самец', uz: 'Kastratsiya qilingan erkak', nv: 2 },        // NEUTERED
    { ru: 'Стерилизованная самка', uz: 'Sterilizatsiya qilingan ayol', nv: 3 },     // SPAYED
    { ru: 'Неизвестно', uz: "Noma'lum", nv: 4 },                                   // UNKNOWN
  ];
  for (const item of animalSexes) {
    await prisma.animalSex.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  console.log('Clinical exam lookup tables seeded.');

  // Resolve sex IDs for cattle subtype constraints
  const maleSex = await prisma.animalSex.findUnique({ where: { numericValue: 0 } });
  const femaleSex = await prisma.animalSex.findUnique({ where: { numericValue: 1 } });

  // --- 1. Regions and Districts ---
  const regionCount = await prisma.region.count();
  if (regionCount === 0) {
    const regionsWithDistricts = [
      { name: 'Tashkent', districts: ['Yunusabad', 'Chilanzar', 'Bektemir'] },
      { name: 'Samarkand', districts: ['Samarkand City', 'Pastdargom', 'Urgut'] },
      { name: 'Andijan', districts: ['Andijan City', 'Asaka', 'Buloqboshi'] },
    ];
    for (const region of regionsWithDistricts) {
      await prisma.region.create({
        data: {
          name: n(region.name, region.name),
          districts: {
            create: region.districts.map((d) => ({ name: n(d, d) })),
          },
        },
      });
    }
  }
  console.log('Regions and Districts seeded.');

  // --- 2. Users ---
  const district = await prisma.district.findFirst();
  if (district) {
    const adminPhone = '+998679050005';
    const adminUsername = 'admin';
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [{ username: adminUsername }, { phone: adminPhone }],
      },
    });

    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          phone: adminPhone,
          username: adminUsername,
          password: await bcrypt.hash('123qazwsx', 10),
          firstName: 'John',
          lastName: 'Doe',
          address: 'Дагбитская улица, 168а',
          districtId: district.id,
          role: UserRole.ADMIN,
          gender: UserGender.MALE,
        },
      });
      console.log('Admin user seeded.');
    } else {
      console.log('Admin user already exists. Skipping create.');
    }
  }

  // --- 3. Animal Types Hierarchy ---
  //
  // Cattle (Qoramol) has 4 leaf subtypes that map to the current AI models.
  // Each subtype has an optional sexId, minAgeMonths, maxAgeMonths, and modelKey.
  // These constraints describe which animals the AI model was trained on.
  //
  //   Буқа   (Bull)    — male, ≥ 36 months       → modelKey: "buqa"
  //   Гунажин (Heifer) — female, 12–35 months     → modelKey: "gunojin"
  //   Сигир  (Cow)     — female, ≥ 24 months      → modelKey: "sigir"
  //   Бузоқ  (Calf)    — any sex, 0–11 months     → modelKey: "buzoq"
  //
  // Future animal types (horses, cats, etc.) simply add a new entry with a modelKey.

  const animalTypes = [
    {
      ru: 'Сельскохозяйственные животные',
      uz: "Qishloq xo'jalik hayvonlari",
      children: [
        {
          ru: 'Крупный рогатый скот',
          uz: 'Qoramol',
          children: [
            {
              ru: 'Бык',
              uz: 'Buqa',
              modelKey: 'bull',
              sexId: maleSex?.id ?? null,
              minAgeMonths: 36,
              maxAgeMonths: null,
            },
            {
              ru: 'Тёлка',
              uz: "G'unojin",
              modelKey: 'heifer',
              sexId: femaleSex?.id ?? null,
              minAgeMonths: 12,
              maxAgeMonths: 35,
            },
            {
              ru: 'Корова',
              uz: 'Sigir',
              modelKey: 'cow',
              sexId: femaleSex?.id ?? null,
              minAgeMonths: 24,
              maxAgeMonths: null,
            },
            {
              ru: 'Телёнок',
              uz: 'Buzoq',
              modelKey: 'calf',
              sexId: null,
              minAgeMonths: 0,
              maxAgeMonths: 11,
            },
          ],
          breeds: [
            { ru: 'Голштинская порода', uz: 'Holstein' },
            { ru: 'Эрширская порода', uz: 'Ayrshire' },
            { ru: 'Джерсейская порода', uz: 'Jersey' },
            { ru: 'Гернсейская порода', uz: 'Guernsey' },
            { ru: 'Браун швиц', uz: 'Brown Swiss' },
            { ru: 'Симментальская порода', uz: 'Simmental' },
            { ru: 'Герефордская порода', uz: 'Hereford' },
            { ru: 'Ангусская порода', uz: 'Angus' },
            { ru: 'Лимузинская порода', uz: 'Limousin' },
            { ru: 'Шаролезская порода', uz: 'Charolais' },
            { ru: 'Брахманская порода', uz: 'Brahman' },
            { ru: 'Ред Синдхи', uz: 'Red Sindhi' },
            { ru: 'Харианская порода', uz: 'Hariana' },
            { ru: 'Холмогорская порода', uz: 'Kholmogor' },
            { ru: 'Ярославская порода', uz: 'Yaroslavl' },
          ],
          colors: [
            { ru: 'Белый', uz: 'Oq' },
            { ru: 'Черный', uz: 'Qora' },
            { ru: 'Пестрый', uz: 'Ola-bula' },
            { ru: 'Рыжеватый', uz: "Qizg'ish" },
            { ru: 'Серый', uz: 'Sur' },
            { ru: 'Серо-бурый', uz: 'Kulrang' },
            { ru: 'Коричневый', uz: 'Jigarrang' },
          ],
        },
      ],
    },
  ];

  async function seedAnimalType(typeData: any, parentId: string | null = null) {
    // Find or create the animal type (idempotent by Russian name)
    let type = await prisma.animalType.findFirst({
      where: { name: { path: ['ru'], equals: typeData.ru } },
    });

    // Fallback for records that already exist under the same unique modelKey.
    if (!type && typeData.modelKey) {
      type = await prisma.animalType.findUnique({
        where: { modelKey: typeData.modelKey },
      });
    }

    if (!type) {
      type = await prisma.animalType.create({
        data: {
          name: n(typeData.ru, typeData.uz),
          parentId,
          ...(typeData.modelKey !== undefined && { modelKey: typeData.modelKey }),
          ...(typeData.sexId !== undefined && typeData.sexId !== null && { sexId: typeData.sexId }),
          ...(typeData.minAgeMonths !== undefined && typeData.minAgeMonths !== null && { minAgeMonths: typeData.minAgeMonths }),
          ...(typeData.maxAgeMonths !== undefined && typeData.maxAgeMonths !== null && { maxAgeMonths: typeData.maxAgeMonths }),
        },
      });

      if (typeData.breeds) {
        for (const breed of typeData.breeds) {
          await prisma.breed.create({
            data: { name: n(breed.ru, breed.uz) },
          });
        }
      }

      if (typeData.colors) {
        for (const color of typeData.colors) {
          await prisma.color.create({
            data: { name: n(color.ru, color.uz) },
          });
        }
      }
    }

    if (typeData.children) {
      for (const child of typeData.children) {
        await seedAnimalType(child, type.id);
      }
    }

    return type;
  }

  for (const type of animalTypes) {
    await seedAnimalType(type);
  }
  console.log('Animal Types, Breeds, and Colors seeded.');

  // --- 4. Diseases ---
  const diseaseCount = await prisma.diseaseCategory.count();
  if (diseaseCount === 0) {
    const diseaseCategories = [
      {
        ru: 'Болезни пищеварительной системы',
        uz: 'Hazm qilish tizimi kasalliklari',
        diseases: [
          { ru: 'Стоматит', uz: 'Stomatit' },
          { ru: 'Фарингит', uz: 'Faringit' },
          { ru: 'Гипотония преджелудков', uz: 'Oshqozon Oldi gipotoniyasi' },
          { ru: 'Атония преджелудков', uz: 'Oshqozon Oldi atoniyasi' },
          { ru: 'Парез рубца', uz: 'Rubets parezi' },
          { ru: 'Ацидоз', uz: 'Atsidoz' },
          { ru: 'Алкалоз', uz: 'Alkaloz' },
          { ru: 'Тимпания', uz: 'Timpaniya' },
          { ru: 'Паракератоз', uz: 'Parakeratoz' },
          { ru: 'Травматический ретикулит', uz: 'Travmatik retikulit' },
          { ru: 'Ретикулоперитонит', uz: 'Retikuloperitonit' },
          { ru: 'Гастрит', uz: 'Gastrit' },
          { ru: 'Язва желудка', uz: 'Oshqozon yarasi' },
          { ru: 'Гастроэнтерит', uz: 'Gastroenterit' },
          { ru: 'Энтероколит', uz: 'Enterokolit' },
          { ru: 'Метеоризм кишечника', uz: 'Ichak meteorismi' },
        ],
      },
      {
        ru: 'Болезни мочевыделительной системы',
        uz: 'Siydik chiqarish tizimi kasalliklari',
        diseases: [
          { ru: 'Нефрит', uz: 'Nefrit' },
          { ru: 'Нефроз', uz: 'Nefroz' },
          { ru: 'Нефросклероз', uz: 'Nefroskleroz' },
          { ru: 'Пиелонефрит', uz: 'Pielonefrit' },
          { ru: 'Уроцистит', uz: 'Urotsistit' },
          { ru: 'Мочекаменная болезнь', uz: 'Buyrak tosh kasalligi' },
          { ru: 'Хроническая гематурия', uz: 'Xronik gematuriya' },
        ],
      },
    ];

    for (const category of diseaseCategories) {
      await prisma.diseaseCategory.create({
        data: {
          name: n(category.ru, category.uz),
          diseases: {
            create: category.diseases.map((d) => ({ name: n(d.ru, d.uz) })),
          },
        },
      });
    }
  }
  console.log('Diseases seeded.');

  // --- 5. Prophylaxis (Vaccines) ---
  const prophylaxisCount = await prisma.prophylaxisItem.count();
  if (prophylaxisCount === 0) {
    const vaccines = [
      { ru: 'Вакцина против бруцеллёза', uz: 'Brucella vaksina' },
      { ru: 'Вакцина против пастереллёза', uz: 'Pasteurella vaksina' },
    ];
    const vaccineStrains = ['S19', 'P52', 'Oregon C24V', 'Nigeria 75/1', 'A, B, C', 'K88, K99', 'Typhimurium', 'S-6'];

    for (const v of vaccines) {
      await prisma.prophylaxisItem.create({
        data: {
          name: n(v.ru, v.uz),
          type: ProphylaxisType.VACCINE,
          details: {
            create: vaccineStrains.map((s) => ({ name: n(s, s) })),
          },
        },
      });
    }
  }
  console.log('Prophylaxis seeded.');

  // --- 6. Reference Data (Urine, Feces, Mucosa lookup options per animal type) ---
  const findTypeByRu = async (ru: string) =>
    prisma.animalType.findFirst({ where: { name: { path: ['ru'], equals: ru } } });

  const targetTypes = [
    { ru: 'Крупный рогатый скот' },
  ];

  const urineColorsData = [
    // Cattle
    [
      { ru: "Тёмно-жёлтый", uz: "To'q sariq", nv: 0 },
      { ru: 'Жёлтый', uz: 'Sariq', nv: 1 },
      { ru: 'Светло-жёлтый', uz: 'Och sariq', nv: 2 },
      { ru: 'Коричневый', uz: 'Jigarrang', nv: 3 },
      { ru: 'Красный', uz: 'Qizil', nv: 4 },
      { ru: 'Почти чёрный', uz: 'Qoramtir', nv: 5 },
      { ru: 'Молочный', uz: 'Sut rang', nv: 6 },
    ],
  ];

  for (let i = 0; i < targetTypes.length; i++) {
    const type = await findTypeByRu(targetTypes[i].ru);
    if (type && urineColorsData[i]) {
      const existingCount = await prisma.urineColor.count({ where: { animalTypeId: type.id } });
      if (existingCount === 0) {
        for (const color of urineColorsData[i]) {
          await prisma.urineColor.create({
            data: {
              name: n(color.ru, color.uz),
              numericValue: color.nv,
              animalTypeId: type.id,
            },
          });
        }
      }
    }
  }

  console.log('Reference Data seeded.');

  // ==========================================================================
  // DEMO DATA — Animals, Sessions, Exams, Predictions
  // ==========================================================================

  const demoAnimalCount = await prisma.animal.count();
  if (demoAnimalCount === 0) {
    console.log('Seeding demo data ...');

    // --- Resolve references ---
    const cattleType = await prisma.animalType.findFirst({
      where: { name: { path: ['ru'], equals: 'Крупный рогатый скот' } },
    });
    if (!cattleType) throw new Error('Cattle type not found — seed lookup tables first');

    const breeds = await prisma.breed.findMany();
    const colors = await prisma.color.findMany();
    const maleSexRef = await prisma.animalSex.findUnique({ where: { numericValue: 0 } });
    const femaleSexRef = await prisma.animalSex.findUnique({ where: { numericValue: 1 } });
    if (!maleSexRef || !femaleSexRef) throw new Error('Animal sexes not found');
    if (breeds.length === 0 || colors.length === 0) throw new Error('Breeds/colors not found');

    const admin = await prisma.user.findFirst({ where: { username: 'admin' } });
    if (!admin) throw new Error('Admin user not found');

    // Create VetProfile for admin so it can be used as veterinarian on sessions
    await prisma.vetProfile.upsert({
      where: { id: admin.id },
      update: {},
      create: {
        id: admin.id,
        licenseNumber: 'VET-DEMO-001',
        specialization: 'General Veterinary',
        experience: 10,
      },
    });

    // --- Seed missing urine/feces lookup tables for cattle ---

    // Urine smells
    const urineSmellsData = [
      { ru: 'Слабый', uz: 'Kuchsiz', nv: 0 },
      { ru: 'Резкий', uz: "O'tkir", nv: 1 },
      { ru: 'Аммиачный', uz: 'Ammiak hidli', nv: 2 },
      { ru: 'Отсутствует', uz: "Yo'q", nv: 3 },
    ];
    const existingUrineSmells = await prisma.urineSmell.count({ where: { animalTypeId: cattleType.id } });
    if (existingUrineSmells === 0) {
      for (const item of urineSmellsData) {
        await prisma.urineSmell.create({
          data: { name: n(item.ru, item.uz), numericValue: item.nv, animalTypeId: cattleType.id },
        });
      }
    }

    // Urine clarities
    const urineClaritiesData = [
      { ru: 'Прозрачная', uz: 'Tiniq', nv: 0 },
      { ru: 'Слабо мутная', uz: 'Biroz loyqa', nv: 1 },
      { ru: 'Мутная', uz: 'Loyqa', nv: 2 },
      { ru: 'Сильно мутная', uz: 'Juda loyqa', nv: 3 },
      { ru: 'С осадком', uz: "Cho'kma bilan", nv: 4 },
    ];
    const existingUrineClarities = await prisma.urineClarity.count({ where: { animalTypeId: cattleType.id } });
    if (existingUrineClarities === 0) {
      for (const item of urineClaritiesData) {
        await prisma.urineClarity.create({
          data: { name: n(item.ru, item.uz), numericValue: item.nv, animalTypeId: cattleType.id },
        });
      }
    }

    // Urine consistencies
    const urineConsistenciesData = [
      { ru: 'Нормальная', uz: 'Normal', nv: 0 },
      { ru: 'Густая', uz: 'Quyuq', nv: 1 },
      { ru: 'Жидкая', uz: 'Suyuq', nv: 2 },
      { ru: 'С осадком', uz: "Cho'kma bilan", nv: 3 },
      { ru: 'С хлопьями', uz: "Bo'lakchali", nv: 4 },
    ];
    const existingUrineConsistencies = await prisma.urineConsistency.count({ where: { animalTypeId: cattleType.id } });
    if (existingUrineConsistencies === 0) {
      for (const item of urineConsistenciesData) {
        await prisma.urineConsistency.create({
          data: { name: n(item.ru, item.uz), numericValue: item.nv, animalTypeId: cattleType.id },
        });
      }
    }

    // Feces colors
    const fecesColorsData = [
      { ru: 'Коричневый', uz: 'Jigarrang', nv: 0 },
      { ru: 'Тёмно-коричневый', uz: "To'q jigarrang", nv: 1 },
      { ru: 'Светлый', uz: 'Och rang', nv: 2 },
      { ru: 'Чёрный', uz: 'Qora', nv: 3 },
    ];
    const existingFecesColors = await prisma.fecesColor.count({ where: { animalTypeId: cattleType.id } });
    if (existingFecesColors === 0) {
      for (const item of fecesColorsData) {
        await prisma.fecesColor.create({
          data: { name: n(item.ru, item.uz), numericValue: item.nv, animalTypeId: cattleType.id },
        });
      }
    }

    // Feces smells
    const fecesSmellsData = [
      { ru: 'Слабый', uz: 'Kuchsiz', nv: 0 },
      { ru: 'Резкий', uz: "O'tkir", nv: 1 },
      { ru: 'Отсутствует', uz: "Yo'q", nv: 2 },
      { ru: 'Гнилостный', uz: 'Chirigan hid', nv: 3 },
    ];
    const existingFecesSmells = await prisma.fecesSmell.count({ where: { animalTypeId: cattleType.id } });
    if (existingFecesSmells === 0) {
      for (const item of fecesSmellsData) {
        await prisma.fecesSmell.create({
          data: { name: n(item.ru, item.uz), numericValue: item.nv, animalTypeId: cattleType.id },
        });
      }
    }

    // Feces consistencies
    const fecesConsistenciesData = [
      { ru: 'Нормальная', uz: 'Normal', nv: 0 },
      { ru: 'Мягкая', uz: 'Yumshoq', nv: 1 },
      { ru: 'Плотная', uz: 'Qattiq', nv: 2 },
      { ru: 'Кашицеобразная', uz: "Bo'tqasimon", nv: 3 },
      { ru: 'Водянистая', uz: 'Suvli', nv: 4 },
    ];
    const existingFecesConsistencies = await prisma.fecesConsistency.count({ where: { animalTypeId: cattleType.id } });
    if (existingFecesConsistencies === 0) {
      for (const item of fecesConsistenciesData) {
        await prisma.fecesConsistency.create({
          data: { name: n(item.ru, item.uz), numericValue: item.nv, animalTypeId: cattleType.id },
        });
      }
    }

    // Feces forms
    const fecesFormsData = [
      { ru: 'Оформленный', uz: 'Shakllangan', nv: 0 },
      { ru: 'Слизистый', uz: 'Shilliqli', nv: 1 },
      { ru: 'Пенистый', uz: "Ko'pikli", nv: 2 },
      { ru: 'Кашицеобразный', uz: "Bo'tqasimon", nv: 3 },
      { ru: 'С примесью крови', uz: 'Qon aralash', nv: 4 },
      { ru: 'Жидкий', uz: 'Suyuq', nv: 5 },
    ];
    const existingFecesForms = await prisma.fecesForm.count({ where: { animalTypeId: cattleType.id } });
    if (existingFecesForms === 0) {
      for (const item of fecesFormsData) {
        await prisma.fecesForm.create({
          data: { name: n(item.ru, item.uz), numericValue: item.nv, animalTypeId: cattleType.id },
        });
      }
    }

    // Mucosa appearances for cattle (per mucosa type)
    const mucosaTypesAll = await prisma.mucosaType.findMany({ orderBy: { numericValue: 'asc' } });
    const existingMucosaAppearances = await prisma.mucosaAppearance.count({ where: { animalTypeId: cattleType.id } });
    if (existingMucosaAppearances === 0 && mucosaTypesAll.length > 0) {
      const mucosaAppearancesPerType = [
        // Mouth (nv=0): pink, pale, red, cyanotic, icteric
        [
          { ru: 'Розовая', uz: 'Pushti', nv: 0 },
          { ru: 'Бледная', uz: 'Rangsiz', nv: 1 },
          { ru: 'Гиперемированная', uz: 'Qizargan', nv: 2 },
          { ru: 'Цианотичная', uz: 'Kўkargan', nv: 3 },
          { ru: 'Иктеричная', uz: "Sarg'aygan", nv: 4 },
        ],
        // Nose (nv=1)
        [
          { ru: 'Розовая', uz: 'Pushti', nv: 0 },
          { ru: 'Бледная', uz: 'Rangsiz', nv: 1 },
          { ru: 'Гиперемированная', uz: 'Qizargan', nv: 2 },
          { ru: 'Отёчная', uz: 'Shishgan', nv: 3 },
        ],
        // Eye (nv=2)
        [
          { ru: 'Розовая', uz: 'Pushti', nv: 0 },
          { ru: 'Бледная', uz: 'Rangsiz', nv: 1 },
          { ru: 'Гиперемированная', uz: 'Qizargan', nv: 2 },
          { ru: 'Иктеричная', uz: "Sarg'aygan", nv: 3 },
        ],
        // Reproductive (nv=3)
        [
          { ru: 'Розовая', uz: 'Pushti', nv: 0 },
          { ru: 'Бледная', uz: 'Rangsiz', nv: 1 },
          { ru: 'Гиперемированная', uz: 'Qizargan', nv: 2 },
        ],
      ];

      for (let ti = 0; ti < mucosaTypesAll.length && ti < mucosaAppearancesPerType.length; ti++) {
        const mt = mucosaTypesAll[ti];
        for (const app of mucosaAppearancesPerType[ti]) {
          await prisma.mucosaAppearance.create({
            data: {
              name: n(app.ru, app.uz),
              numericValue: app.nv,
              mucosaTypeId: mt.id,
              animalTypeId: cattleType.id,
            },
          });
        }
      }
    }

    console.log('Feces/urine/mucosa lookups for cattle seeded.');

    // --- Reload lookup IDs for exams ---
    const urineColors = await prisma.urineColor.findMany({ where: { animalTypeId: cattleType.id }, orderBy: { numericValue: 'asc' } });
    const urineSmells = await prisma.urineSmell.findMany({ where: { animalTypeId: cattleType.id }, orderBy: { numericValue: 'asc' } });
    const urineClarities = await prisma.urineClarity.findMany({ where: { animalTypeId: cattleType.id }, orderBy: { numericValue: 'asc' } });
    const urineConsistencies = await prisma.urineConsistency.findMany({ where: { animalTypeId: cattleType.id }, orderBy: { numericValue: 'asc' } });

    const fecesColors = await prisma.fecesColor.findMany({ where: { animalTypeId: cattleType.id }, orderBy: { numericValue: 'asc' } });
    const fecesSmells = await prisma.fecesSmell.findMany({ where: { animalTypeId: cattleType.id }, orderBy: { numericValue: 'asc' } });
    const fecesConsistencies = await prisma.fecesConsistency.findMany({ where: { animalTypeId: cattleType.id }, orderBy: { numericValue: 'asc' } });
    const fecesForms = await prisma.fecesForm.findMany({ where: { animalTypeId: cattleType.id }, orderBy: { numericValue: 'asc' } });

    const mucosaAppearances = await prisma.mucosaAppearance.findMany({
      where: { animalTypeId: cattleType.id },
      orderBy: { numericValue: 'asc' },
    });

    // Clinical lookups (global, not per-type)
    const bodyTypeNormal = await prisma.bodyType.findUnique({ where: { numericValue: 1 } });
    const bodyTypeStrong = await prisma.bodyType.findUnique({ where: { numericValue: 0 } });
    const bodyTypeWeak = await prisma.bodyType.findUnique({ where: { numericValue: 2 } });
    const obesityMedium = await prisma.obesityType.findUnique({ where: { numericValue: 1 } });
    const obesityGood = await prisma.obesityType.findUnique({ where: { numericValue: 0 } });
    const obesityLow = await prisma.obesityType.findUnique({ where: { numericValue: 2 } });
    const obesityCachexia = await prisma.obesityType.findUnique({ where: { numericValue: 3 } });
    const bodyPosNatural = await prisma.bodyPosition.findUnique({ where: { numericValue: 0 } });
    const bodyPosForced = await prisma.bodyPosition.findUnique({ where: { numericValue: 1 } });
    const constitutionSoft = await prisma.constitution.findUnique({ where: { numericValue: 0 } });
    const constitutionStrong = await prisma.constitution.findUnique({ where: { numericValue: 1 } });
    const temperamentMelanch = await prisma.temperament.findUnique({ where: { numericValue: 0 } });
    const temperamentPhlegm = await prisma.temperament.findUnique({ where: { numericValue: 1 } });
    const woolEven = await prisma.woolType.findUnique({ where: { numericValue: 0 } });
    const woolUneven = await prisma.woolType.findUnique({ where: { numericValue: 1 } });
    const woolBristled = await prisma.woolType.findUnique({ where: { numericValue: 6 } });
    const skinColorPale = await prisma.skinColor.findUnique({ where: { numericValue: 0 } });
    const skinColorWhite = await prisma.skinColor.findUnique({ where: { numericValue: 1 } });
    const skinColorRed = await prisma.skinColor.findUnique({ where: { numericValue: 2 } });
    const skinColorYellow = await prisma.skinColor.findUnique({ where: { numericValue: 4 } });
    const skinHumidityNormal = await prisma.skinHumidity.findUnique({ where: { numericValue: 0 } });
    const skinHumidityHyper = await prisma.skinHumidity.findUnique({ where: { numericValue: 1 } });
    const skinSmellNone = await prisma.skinSmell.findUnique({ where: { numericValue: 0 } });
    const skinSmellNormal = await prisma.skinSmell.findUnique({ where: { numericValue: 1 } });
    const skinTempRaisedAll = await prisma.skinTemp.findUnique({ where: { numericValue: 0 } });
    const skinTempVaries = await prisma.skinTemp.findUnique({ where: { numericValue: 4 } });
    const skinSurfaceSmooth = await prisma.skinSurface.findUnique({ where: { numericValue: 0 } });
    const skinSurfaceRough = await prisma.skinSurface.findUnique({ where: { numericValue: 1 } });
    const skinElasticNormal = await prisma.skinElasticity.findUnique({ where: { numericValue: 0 } });
    const skinElasticReduced = await prisma.skinElasticity.findUnique({ where: { numericValue: 1 } });
    const skinSensNormal = await prisma.skinSensitivity.findUnique({ where: { numericValue: 0 } });
    const skinSensHigh = await prisma.skinSensitivity.findUnique({ where: { numericValue: 1 } });
    const skinPainNone = await prisma.skinPain.findUnique({ where: { numericValue: 0 } });
    const skinPainYes = await prisma.skinPain.findUnique({ where: { numericValue: 1 } });
    const lymphSizeNormal = await prisma.lymphSize.findUnique({ where: { numericValue: 0 } });
    const lymphSizeEnlarged = await prisma.lymphSize.findUnique({ where: { numericValue: 1 } });
    const lymphShapeFlat = await prisma.lymphShape.findUnique({ where: { numericValue: 0 } });
    const lymphShapeRound = await prisma.lymphShape.findUnique({ where: { numericValue: 1 } });
    const lymphShapeSwollen = await prisma.lymphShape.findUnique({ where: { numericValue: 3 } });
    const lymphSurfaceSmooth = await prisma.lymphSurface.findUnique({ where: { numericValue: 0 } });
    const lymphSurfaceRough = await prisma.lymphSurface.findUnique({ where: { numericValue: 1 } });
    const lymphConsDense = await prisma.lymphConsistency.findUnique({ where: { numericValue: 0 } });
    const lymphConsSoft = await prisma.lymphConsistency.findUnique({ where: { numericValue: 1 } });
    const lymphTempNormal = await prisma.lymphTemp.findUnique({ where: { numericValue: 0 } });
    const lymphTempRaised = await prisma.lymphTemp.findUnique({ where: { numericValue: 1 } });
    const lymphPainNo = await prisma.lymphPain.findUnique({ where: { numericValue: 0 } });
    const lymphPainYes = await prisma.lymphPain.findUnique({ where: { numericValue: 1 } });
    const lymphMobMobile = await prisma.lymphMobility.findUnique({ where: { numericValue: 0 } });
    const lymphMobReduced = await prisma.lymphMobility.findUnique({ where: { numericValue: 1 } });
    const rumenFluidNormal = await prisma.rumenFluidState.findUnique({ where: { numericValue: 0 } });
    const rumenFluidBloated = await prisma.rumenFluidState.findUnique({ where: { numericValue: 1 } });
    const rumenFluidBlocked = await prisma.rumenFluidState.findUnique({ where: { numericValue: 2 } });

    // --- Helper: pick from array by index (wraps around) ---
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
    const pick = <T extends unknown>(arr: T[], idx: number): T => arr[idx % arr.length];

    // --- Animal definitions (18 cattle) ---
    interface AnimalDef {
      code: string;
      birthDate: string;
      sexNv: number;    // 0=male, 1=female
      breedIdx: number;
      colorIdx: number;
      profile: 'healthy' | 'mild' | 'moderate' | 'severe' | 'urinary';
    }

    const animalDefs: AnimalDef[] = [
      // Healthy cows (mature females)
      { code: 'KRS-001', birthDate: '2020-03-15', sexNv: 1, breedIdx: 0, colorIdx: 0, profile: 'healthy' },
      { code: 'KRS-002', birthDate: '2019-08-22', sexNv: 1, breedIdx: 1, colorIdx: 1, profile: 'healthy' },
      { code: 'KRS-003', birthDate: '2021-01-10', sexNv: 1, breedIdx: 2, colorIdx: 2, profile: 'healthy' },
      { code: 'KRS-004', birthDate: '2018-05-05', sexNv: 1, breedIdx: 3, colorIdx: 3, profile: 'healthy' },
      // Mild GI issues
      { code: 'KRS-005', birthDate: '2020-11-20', sexNv: 1, breedIdx: 4, colorIdx: 4, profile: 'mild' },
      { code: 'KRS-006', birthDate: '2019-06-18', sexNv: 0, breedIdx: 5, colorIdx: 5, profile: 'mild' },
      { code: 'KRS-007', birthDate: '2021-04-02', sexNv: 1, breedIdx: 6, colorIdx: 6, profile: 'mild' },
      // Moderate digestive disease
      { code: 'KRS-008', birthDate: '2020-07-14', sexNv: 1, breedIdx: 7, colorIdx: 0, profile: 'moderate' },
      { code: 'KRS-009', birthDate: '2022-02-28', sexNv: 0, breedIdx: 8, colorIdx: 1, profile: 'moderate' },
      { code: 'KRS-010', birthDate: '2019-12-01', sexNv: 1, breedIdx: 9, colorIdx: 2, profile: 'moderate' },
      { code: 'KRS-011', birthDate: '2021-09-15', sexNv: 1, breedIdx: 10, colorIdx: 3, profile: 'moderate' },
      // Severe disease indicators
      { code: 'KRS-012', birthDate: '2020-04-10', sexNv: 1, breedIdx: 11, colorIdx: 4, profile: 'severe' },
      { code: 'KRS-013', birthDate: '2018-10-30', sexNv: 0, breedIdx: 12, colorIdx: 5, profile: 'severe' },
      { code: 'KRS-014', birthDate: '2022-06-25', sexNv: 1, breedIdx: 13, colorIdx: 6, profile: 'severe' },
      // Urinary system issues
      { code: 'KRS-015', birthDate: '2019-03-08', sexNv: 1, breedIdx: 14, colorIdx: 0, profile: 'urinary' },
      { code: 'KRS-016', birthDate: '2021-07-19', sexNv: 0, breedIdx: 0, colorIdx: 1, profile: 'urinary' },
      // Young calves
      { code: 'KRS-017', birthDate: '2025-09-01', sexNv: 1, breedIdx: 1, colorIdx: 2, profile: 'healthy' },
      { code: 'KRS-018', birthDate: '2025-10-15', sexNv: 0, breedIdx: 2, colorIdx: 3, profile: 'mild' },
    ];

    // --- Session dates for variety ---
    const sessionDates = [
      '2026-02-10', '2026-02-15', '2026-02-20', '2026-03-01', '2026-03-05',
      '2026-03-10', '2026-03-12', '2026-03-15', '2026-03-18', '2026-03-20',
    ];

    // --- Clinical profiles per disease class ---
    type ClinicalProfile = {
      pulse: number; temperature: number; respiratoryRate: number; rumination: number;
      bodyType: string; obesity: string; bodyPos: string; constitution: string; temperament: string;
      wool: string; skinColor: string; skinHumidity: string; skinSmell: string; skinTemp: string;
      skinSurface: string; skinElasticity: string; skinSens: string; skinPain: string;
      lymphSize: string; lymphShape: string; lymphSurface: string; lymphCons: string;
      lymphTemp: string; lymphPain: string; lymphMob: string;
      rumenFluid: string; infusoria: number;
    };

    // Build lookup maps for clinical IDs
    const clinLookup: Record<string, Record<string, string | undefined>> = {
      bodyType: { normal: bodyTypeNormal?.id, strong: bodyTypeStrong?.id, weak: bodyTypeWeak?.id },
      obesity: { good: obesityGood?.id, medium: obesityMedium?.id, low: obesityLow?.id, cachexia: obesityCachexia?.id },
      bodyPos: { natural: bodyPosNatural?.id, forced: bodyPosForced?.id },
      constitution: { soft: constitutionSoft?.id, strong: constitutionStrong?.id },
      temperament: { melanch: temperamentMelanch?.id, phlegm: temperamentPhlegm?.id },
      wool: { even: woolEven?.id, uneven: woolUneven?.id, bristled: woolBristled?.id },
      skinColor: { pale: skinColorPale?.id, white: skinColorWhite?.id, red: skinColorRed?.id, yellow: skinColorYellow?.id },
      skinHumidity: { normal: skinHumidityNormal?.id, hyper: skinHumidityHyper?.id },
      skinSmell: { none: skinSmellNone?.id, normal: skinSmellNormal?.id },
      skinTemp: { raised: skinTempRaisedAll?.id, varies: skinTempVaries?.id },
      skinSurface: { smooth: skinSurfaceSmooth?.id, rough: skinSurfaceRough?.id },
      skinElasticity: { normal: skinElasticNormal?.id, reduced: skinElasticReduced?.id },
      skinSens: { normal: skinSensNormal?.id, high: skinSensHigh?.id },
      skinPain: { none: skinPainNone?.id, yes: skinPainYes?.id },
      lymphSize: { normal: lymphSizeNormal?.id, enlarged: lymphSizeEnlarged?.id },
      lymphShape: { flat: lymphShapeFlat?.id, round: lymphShapeRound?.id, swollen: lymphShapeSwollen?.id },
      lymphSurface: { smooth: lymphSurfaceSmooth?.id, rough: lymphSurfaceRough?.id },
      lymphCons: { dense: lymphConsDense?.id, soft: lymphConsSoft?.id },
      lymphTemp: { normal: lymphTempNormal?.id, raised: lymphTempRaised?.id },
      lymphPain: { no: lymphPainNo?.id, yes: lymphPainYes?.id },
      lymphMob: { mobile: lymphMobMobile?.id, reduced: lymphMobReduced?.id },
      rumenFluid: { normal: rumenFluidNormal?.id, bloated: rumenFluidBloated?.id, blocked: rumenFluidBlocked?.id },
    };

    const clinProfiles: Record<string, ClinicalProfile> = {
      healthy: {
        pulse: 68, temperature: 38.5, respiratoryRate: 22, rumination: 3,
        bodyType: 'normal', obesity: 'good', bodyPos: 'natural', constitution: 'strong', temperament: 'phlegm',
        wool: 'even', skinColor: 'pale', skinHumidity: 'normal', skinSmell: 'none', skinTemp: 'varies',
        skinSurface: 'smooth', skinElasticity: 'normal', skinSens: 'normal', skinPain: 'none',
        lymphSize: 'normal', lymphShape: 'flat', lymphSurface: 'smooth', lymphCons: 'dense',
        lymphTemp: 'normal', lymphPain: 'no', lymphMob: 'mobile',
        rumenFluid: 'normal', infusoria: 250,
      },
      mild: {
        pulse: 78, temperature: 39.2, respiratoryRate: 26, rumination: 2,
        bodyType: 'normal', obesity: 'medium', bodyPos: 'natural', constitution: 'soft', temperament: 'phlegm',
        wool: 'uneven', skinColor: 'pale', skinHumidity: 'normal', skinSmell: 'normal', skinTemp: 'varies',
        skinSurface: 'smooth', skinElasticity: 'normal', skinSens: 'normal', skinPain: 'none',
        lymphSize: 'normal', lymphShape: 'round', lymphSurface: 'smooth', lymphCons: 'dense',
        lymphTemp: 'normal', lymphPain: 'no', lymphMob: 'mobile',
        rumenFluid: 'bloated', infusoria: 180,
      },
      moderate: {
        pulse: 88, temperature: 39.8, respiratoryRate: 32, rumination: 1,
        bodyType: 'weak', obesity: 'low', bodyPos: 'natural', constitution: 'soft', temperament: 'melanch',
        wool: 'bristled', skinColor: 'red', skinHumidity: 'hyper', skinSmell: 'normal', skinTemp: 'raised',
        skinSurface: 'rough', skinElasticity: 'reduced', skinSens: 'high', skinPain: 'yes',
        lymphSize: 'enlarged', lymphShape: 'round', lymphSurface: 'rough', lymphCons: 'soft',
        lymphTemp: 'raised', lymphPain: 'yes', lymphMob: 'reduced',
        rumenFluid: 'bloated', infusoria: 100,
      },
      severe: {
        pulse: 100, temperature: 40.5, respiratoryRate: 40, rumination: 0,
        bodyType: 'weak', obesity: 'cachexia', bodyPos: 'forced', constitution: 'soft', temperament: 'melanch',
        wool: 'bristled', skinColor: 'yellow', skinHumidity: 'hyper', skinSmell: 'normal', skinTemp: 'raised',
        skinSurface: 'rough', skinElasticity: 'reduced', skinSens: 'high', skinPain: 'yes',
        lymphSize: 'enlarged', lymphShape: 'swollen', lymphSurface: 'rough', lymphCons: 'soft',
        lymphTemp: 'raised', lymphPain: 'yes', lymphMob: 'reduced',
        rumenFluid: 'blocked', infusoria: 40,
      },
      urinary: {
        pulse: 82, temperature: 39.5, respiratoryRate: 28, rumination: 2,
        bodyType: 'normal', obesity: 'low', bodyPos: 'natural', constitution: 'soft', temperament: 'melanch',
        wool: 'uneven', skinColor: 'white', skinHumidity: 'normal', skinSmell: 'none', skinTemp: 'varies',
        skinSurface: 'smooth', skinElasticity: 'reduced', skinSens: 'high', skinPain: 'yes',
        lymphSize: 'normal', lymphShape: 'flat', lymphSurface: 'smooth', lymphCons: 'dense',
        lymphTemp: 'normal', lymphPain: 'no', lymphMob: 'mobile',
        rumenFluid: 'normal', infusoria: 200,
      },
    };

    // Blood profiles
    interface BloodProfile {
      coe: number; erythrocyteCount: number; leukocyteCount: number; thrombocyteCount: number;
      hemoglobin: number; glutathione: number; waterPercentage: number; dryResidue: number;
      totalProtein: number; totalCalcium: number; organicPhosphorus: number; albumin: number;
      alphaGlobulin: number; betaGlobulin: number; gammaGlobulin: number; residualNitrogen: number;
      urea: number; uricAcid: number; creatine: number; creatinine: number; alkalineReserve: number;
      glucose: number; ketoneBodies: number; totalBilirubin: number; directBilirubin: number;
      totalCholesterol: number; totalLipids: number; phospholipids: number; lacticAcid: number;
      pyruvicAcid: number; citricAcid: number; carotene: number; vitaminA: number; vitaminB: number;
      vitaminC: number; copper: number; cobalt: number; manganese: number; zinc: number;
    }

    const bloodProfiles: Record<string, BloodProfile> = {
      healthy: {
        coe: 5, erythrocyteCount: 7.5, leukocyteCount: 8.0, thrombocyteCount: 350,
        hemoglobin: 110, glutathione: 28, waterPercentage: 80, dryResidue: 20,
        totalProtein: 72, totalCalcium: 2.5, organicPhosphorus: 1.5, albumin: 35,
        alphaGlobulin: 10, betaGlobulin: 12, gammaGlobulin: 15, residualNitrogen: 25,
        urea: 4.5, uricAcid: 0.3, creatine: 1.2, creatinine: 1.0, alkalineReserve: 52,
        glucose: 2.8, ketoneBodies: 0.5, totalBilirubin: 3.5, directBilirubin: 1.2,
        totalCholesterol: 3.5, totalLipids: 4.0, phospholipids: 2.0, lacticAcid: 1.2,
        pyruvicAcid: 0.8, citricAcid: 0.4, carotene: 0.5, vitaminA: 0.3, vitaminB: 0.4,
        vitaminC: 0.5, copper: 0.9, cobalt: 0.05, manganese: 0.02, zinc: 3.0,
      },
      mild: {
        coe: 6, erythrocyteCount: 6.8, leukocyteCount: 10.0, thrombocyteCount: 320,
        hemoglobin: 100, glutathione: 25, waterPercentage: 81, dryResidue: 19,
        totalProtein: 68, totalCalcium: 2.3, organicPhosphorus: 1.3, albumin: 32,
        alphaGlobulin: 11, betaGlobulin: 13, gammaGlobulin: 17, residualNitrogen: 28,
        urea: 5.0, uricAcid: 0.4, creatine: 1.4, creatinine: 1.2, alkalineReserve: 48,
        glucose: 2.5, ketoneBodies: 1.0, totalBilirubin: 4.5, directBilirubin: 1.8,
        totalCholesterol: 4.0, totalLipids: 4.5, phospholipids: 2.2, lacticAcid: 1.5,
        pyruvicAcid: 1.0, citricAcid: 0.5, carotene: 0.4, vitaminA: 0.25, vitaminB: 0.35,
        vitaminC: 0.4, copper: 0.8, cobalt: 0.04, manganese: 0.02, zinc: 2.8,
      },
      moderate: {
        coe: 8, erythrocyteCount: 5.5, leukocyteCount: 14.0, thrombocyteCount: 280,
        hemoglobin: 85, glutathione: 20, waterPercentage: 83, dryResidue: 17,
        totalProtein: 60, totalCalcium: 2.0, organicPhosphorus: 1.0, albumin: 28,
        alphaGlobulin: 13, betaGlobulin: 15, gammaGlobulin: 20, residualNitrogen: 35,
        urea: 6.5, uricAcid: 0.6, creatine: 1.8, creatinine: 1.5, alkalineReserve: 40,
        glucose: 2.0, ketoneBodies: 2.5, totalBilirubin: 7.0, directBilirubin: 3.0,
        totalCholesterol: 5.0, totalLipids: 5.5, phospholipids: 2.8, lacticAcid: 2.0,
        pyruvicAcid: 1.5, citricAcid: 0.7, carotene: 0.3, vitaminA: 0.18, vitaminB: 0.25,
        vitaminC: 0.3, copper: 0.6, cobalt: 0.03, manganese: 0.015, zinc: 2.2,
      },
      severe: {
        coe: 12, erythrocyteCount: 4.0, leukocyteCount: 18.0, thrombocyteCount: 200,
        hemoglobin: 65, glutathione: 15, waterPercentage: 86, dryResidue: 14,
        totalProtein: 50, totalCalcium: 1.8, organicPhosphorus: 0.8, albumin: 22,
        alphaGlobulin: 15, betaGlobulin: 18, gammaGlobulin: 25, residualNitrogen: 45,
        urea: 9.0, uricAcid: 1.0, creatine: 2.5, creatinine: 2.2, alkalineReserve: 32,
        glucose: 1.5, ketoneBodies: 5.0, totalBilirubin: 12.0, directBilirubin: 5.0,
        totalCholesterol: 6.5, totalLipids: 7.0, phospholipids: 3.5, lacticAcid: 3.0,
        pyruvicAcid: 2.2, citricAcid: 1.0, carotene: 0.2, vitaminA: 0.1, vitaminB: 0.15,
        vitaminC: 0.2, copper: 0.4, cobalt: 0.02, manganese: 0.01, zinc: 1.5,
      },
      urinary: {
        coe: 7, erythrocyteCount: 6.0, leukocyteCount: 12.0, thrombocyteCount: 300,
        hemoglobin: 90, glutathione: 22, waterPercentage: 82, dryResidue: 18,
        totalProtein: 65, totalCalcium: 2.8, organicPhosphorus: 1.8, albumin: 30,
        alphaGlobulin: 12, betaGlobulin: 14, gammaGlobulin: 18, residualNitrogen: 40,
        urea: 8.0, uricAcid: 0.8, creatine: 2.0, creatinine: 2.0, alkalineReserve: 44,
        glucose: 2.2, ketoneBodies: 1.5, totalBilirubin: 5.0, directBilirubin: 2.0,
        totalCholesterol: 4.2, totalLipids: 4.8, phospholipids: 2.4, lacticAcid: 1.8,
        pyruvicAcid: 1.2, citricAcid: 0.6, carotene: 0.35, vitaminA: 0.2, vitaminB: 0.3,
        vitaminC: 0.35, copper: 0.7, cobalt: 0.035, manganese: 0.018, zinc: 2.5,
      },
    };

    // Urine profiles
    interface UrineProfile {
      colorIdx: number; smellIdx: number; clarityIdx: number; consistencyIdx: number;
      amount: number; ph: number; acetone: number; protein: number; bilirubin: number;
      urobilinogen: number; sugar: number; leukocytes: number; epithelium: number;
      microbialBodies: number; erythrocytes: number; saltCrystals: number;
    }

    const urineProfiles: Record<string, UrineProfile> = {
      healthy: {
        colorIdx: 1, smellIdx: 0, clarityIdx: 0, consistencyIdx: 0,
        amount: 6.0, ph: 7.5, acetone: 0, protein: 0.1, bilirubin: 0.2,
        urobilinogen: 1.0, sugar: 0, leukocytes: 2, epithelium: 1, microbialBodies: 0, erythrocytes: 0, saltCrystals: 0,
      },
      mild: {
        colorIdx: 0, smellIdx: 1, clarityIdx: 1, consistencyIdx: 0,
        amount: 5.0, ph: 6.8, acetone: 0.5, protein: 0.3, bilirubin: 0.5,
        urobilinogen: 2.0, sugar: 0, leukocytes: 5, epithelium: 3, microbialBodies: 1, erythrocytes: 1, saltCrystals: 1,
      },
      moderate: {
        colorIdx: 3, smellIdx: 1, clarityIdx: 2, consistencyIdx: 1,
        amount: 4.0, ph: 6.2, acetone: 2.0, protein: 0.8, bilirubin: 1.5,
        urobilinogen: 4.0, sugar: 0.5, leukocytes: 15, epithelium: 8, microbialBodies: 5, erythrocytes: 3, saltCrystals: 3,
      },
      severe: {
        colorIdx: 4, smellIdx: 2, clarityIdx: 3, consistencyIdx: 2,
        amount: 2.5, ph: 5.5, acetone: 5.0, protein: 2.0, bilirubin: 4.0,
        urobilinogen: 8.0, sugar: 2.0, leukocytes: 30, epithelium: 15, microbialBodies: 12, erythrocytes: 10, saltCrystals: 8,
      },
      urinary: {
        colorIdx: 4, smellIdx: 2, clarityIdx: 3, consistencyIdx: 3,
        amount: 3.0, ph: 5.8, acetone: 1.0, protein: 3.0, bilirubin: 1.0,
        urobilinogen: 3.0, sugar: 1.0, leukocytes: 40, epithelium: 20, microbialBodies: 15, erythrocytes: 20, saltCrystals: 12,
      },
    };

    // Feces profiles
    interface FecesProfile {
      colorIdx: number; smellIdx: number; consistencyIdx: number; formIdx: number;
      amount: number; undigestedFood: number;
    }

    const fecesProfiles: Record<string, FecesProfile> = {
      healthy: { colorIdx: 0, smellIdx: 0, consistencyIdx: 0, formIdx: 0, amount: 500, undigestedFood: 1 },
      mild:    { colorIdx: 1, smellIdx: 1, consistencyIdx: 1, formIdx: 1, amount: 600, undigestedFood: 3 },
      moderate:{ colorIdx: 2, smellIdx: 1, consistencyIdx: 3, formIdx: 3, amount: 700, undigestedFood: 5 },
      severe:  { colorIdx: 3, smellIdx: 3, consistencyIdx: 4, formIdx: 5, amount: 300, undigestedFood: 8 },
      urinary: { colorIdx: 0, smellIdx: 0, consistencyIdx: 0, formIdx: 0, amount: 450, undigestedFood: 2 },
    };

    // --- Create animals and their exam data ---
    for (let ai = 0; ai < animalDefs.length; ai++) {
      const def = animalDefs[ai];
      const sexId = def.sexNv === 0 ? maleSexRef.id : femaleSexRef.id;

      const animal = await prisma.animal.create({
        data: {
          animalNameCode: def.code,
          birthDate: new Date(def.birthDate),
          arrivalDate: new Date('2026-01-15'),
          sexId,
          animalTypeId: cattleType.id,
          animalBreedId: pick(breeds, def.breedIdx).id,
          animalColorId: pick(colors, def.colorIdx).id,
        },
      });

      // Create 1-3 sessions per animal
      const sessionCount = ai < 4 ? 2 : ai < 12 ? 1 : ai < 16 ? 3 : 1;
      for (let si = 0; si < sessionCount; si++) {
        const isLatest = si === sessionCount - 1;
        const status = isLatest ? 'SUBMITTED' : (si === 0 && sessionCount > 1 ? 'DRAFT' : 'READY');
        const dateStr = pick(sessionDates, ai * 3 + si);

        const session = await prisma.medicalSession.create({
          data: {
            animalId: animal.id,
            veterinarianId: admin.id,
            status,
            date: new Date(dateStr),
          },
        });

        // Only create full exams for SUBMITTED sessions
        if (status !== 'SUBMITTED') continue;

        const prof = def.profile;
        const cp = clinProfiles[prof];
        const bp = bloodProfiles[prof];
        const up = urineProfiles[prof];
        const fp = fecesProfiles[prof];

        // Add small per-animal variance
        const jitter = (base: number, pct: number) => {
          const variance = base * pct * ((ai * 7 + si * 3) % 10 - 5) / 50;
          return Math.round((base + variance) * 100) / 100;
        };

        // --- Clinical Exam ---
        await prisma.clinicalExam.create({
          data: {
            animalId: animal.id,
            sessionId: session.id,
            pulse: Math.round(jitter(cp.pulse, 0.05)),
            rumination: cp.rumination,
            temperature: jitter(cp.temperature, 0.02),
            respiratoryRate: jitter(cp.respiratoryRate, 0.05),
            bodyTypeId: clinLookup.bodyType[cp.bodyType],
            obesityId: clinLookup.obesity[cp.obesity],
            bodyPositionId: clinLookup.bodyPos[cp.bodyPos],
            constitutionId: clinLookup.constitution[cp.constitution],
            temperamentId: clinLookup.temperament[cp.temperament],
            woolId: clinLookup.wool[cp.wool],
            skinColorId: clinLookup.skinColor[cp.skinColor],
            skinHumidityId: clinLookup.skinHumidity[cp.skinHumidity],
            skinSmellId: clinLookup.skinSmell[cp.skinSmell],
            skinTempId: clinLookup.skinTemp[cp.skinTemp],
            skinSurfaceId: clinLookup.skinSurface[cp.skinSurface],
            skinElasticityId: clinLookup.skinElasticity[cp.skinElasticity],
            skinSensitivityId: clinLookup.skinSens[cp.skinSens],
            skinPainId: clinLookup.skinPain[cp.skinPain],
            lymphSizeId: clinLookup.lymphSize[cp.lymphSize],
            lymphShapeId: clinLookup.lymphShape[cp.lymphShape],
            lymphSurfaceId: clinLookup.lymphSurface[cp.lymphSurface],
            lymphConsistencyId: clinLookup.lymphCons[cp.lymphCons],
            lymphTempId: clinLookup.lymphTemp[cp.lymphTemp],
            lymphPainId: clinLookup.lymphPain[cp.lymphPain],
            lymphMobilityId: clinLookup.lymphMob[cp.lymphMob],
            rumenFluidStateId: clinLookup.rumenFluid[cp.rumenFluid],
            rumenInfusoriaCount: cp.infusoria,
          },
        });

        // --- Blood Exam ---
        await prisma.bloodExam.create({
          data: {
            animalId: animal.id,
            sessionId: session.id,
            coe: jitter(bp.coe, 0.05),
            erythrocyteCount: jitter(bp.erythrocyteCount, 0.05),
            leukocyteCount: jitter(bp.leukocyteCount, 0.05),
            thrombocyteCount: jitter(bp.thrombocyteCount, 0.05),
            hemoglobin: jitter(bp.hemoglobin, 0.05),
            glutathione: jitter(bp.glutathione, 0.05),
            waterPercentage: jitter(bp.waterPercentage, 0.02),
            dryResidue: jitter(bp.dryResidue, 0.05),
            totalProtein: jitter(bp.totalProtein, 0.05),
            totalCalcium: jitter(bp.totalCalcium, 0.05),
            organicPhosphorus: jitter(bp.organicPhosphorus, 0.05),
            albumin: jitter(bp.albumin, 0.05),
            alphaGlobulin: jitter(bp.alphaGlobulin, 0.05),
            betaGlobulin: jitter(bp.betaGlobulin, 0.05),
            gammaGlobulin: jitter(bp.gammaGlobulin, 0.05),
            residualNitrogen: jitter(bp.residualNitrogen, 0.05),
            urea: jitter(bp.urea, 0.05),
            uricAcid: jitter(bp.uricAcid, 0.05),
            creatine: jitter(bp.creatine, 0.05),
            creatinine: jitter(bp.creatinine, 0.05),
            alkalineReserve: jitter(bp.alkalineReserve, 0.05),
            glucose: jitter(bp.glucose, 0.05),
            ketoneBodies: jitter(bp.ketoneBodies, 0.1),
            totalBilirubin: jitter(bp.totalBilirubin, 0.05),
            directBilirubin: jitter(bp.directBilirubin, 0.05),
            totalCholesterol: jitter(bp.totalCholesterol, 0.05),
            totalLipids: jitter(bp.totalLipids, 0.05),
            phospholipids: jitter(bp.phospholipids, 0.05),
            lacticAcid: jitter(bp.lacticAcid, 0.05),
            pyruvicAcid: jitter(bp.pyruvicAcid, 0.05),
            citricAcid: jitter(bp.citricAcid, 0.05),
            carotene: jitter(bp.carotene, 0.05),
            vitaminA: jitter(bp.vitaminA, 0.05),
            vitaminB: jitter(bp.vitaminB, 0.05),
            vitaminC: jitter(bp.vitaminC, 0.05),
            copper: jitter(bp.copper, 0.05),
            cobalt: jitter(bp.cobalt, 0.05),
            manganese: jitter(bp.manganese, 0.05),
            zinc: jitter(bp.zinc, 0.05),
          },
        });

        // --- Urine Exam ---
        if (urineColors.length && urineSmells.length && urineClarities.length && urineConsistencies.length) {
          await prisma.urineExam.create({
            data: {
              animalId: animal.id,
              sessionId: session.id,
              urineColorId: pick(urineColors, up.colorIdx).id,
              urineSmellId: pick(urineSmells, up.smellIdx).id,
              urineClarityId: pick(urineClarities, up.clarityIdx).id,
              urineConsistencyId: pick(urineConsistencies, up.consistencyIdx).id,
              amount: jitter(up.amount, 0.1),
              ph: jitter(up.ph, 0.05),
              acetone: jitter(up.acetone, 0.1),
              protein: jitter(up.protein, 0.1),
              bilirubin: jitter(up.bilirubin, 0.1),
              urobilinogen: jitter(up.urobilinogen, 0.1),
              sugar: jitter(up.sugar, 0.1),
              leukocytes: jitter(up.leukocytes, 0.1),
              epithelium: jitter(up.epithelium, 0.1),
              microbialBodies: jitter(up.microbialBodies, 0.1),
              erythrocytes: jitter(up.erythrocytes, 0.1),
              saltCrystals: jitter(up.saltCrystals, 0.1),
            },
          });
        }

        // --- Feces Exam ---
        if (fecesColors.length && fecesSmells.length && fecesConsistencies.length && fecesForms.length) {
          await prisma.fecesExam.create({
            data: {
              animalId: animal.id,
              sessionId: session.id,
              fecesColorId: pick(fecesColors, fp.colorIdx).id,
              fecesSmellId: pick(fecesSmells, fp.smellIdx).id,
              fecesConsistencyId: pick(fecesConsistencies, fp.consistencyIdx).id,
              fecesFormId: pick(fecesForms, fp.formIdx).id,
              amount: jitter(fp.amount, 0.1),
              undigestedFood: jitter(fp.undigestedFood, 0.1),
            },
          });
        }

        // --- Mucosa Exams (one per mucosa type) ---
        if (mucosaAppearances.length > 0) {
          for (const mt of mucosaTypesAll) {
            const appsForType = mucosaAppearances.filter((a) => a.mucosaTypeId === mt.id);
            if (appsForType.length > 0) {
              // Healthy animals get nv=0 (pink), sick animals get higher nv
              const appIdx = prof === 'healthy' ? 0 : prof === 'mild' ? 0 : prof === 'moderate' ? 1 : prof === 'severe' ? 2 : 0;
              await prisma.mucosaExam.create({
                data: {
                  animalId: animal.id,
                  sessionId: session.id,
                  mucosaTypeId: mt.id,
                  mucosaAppearanceId: pick(appsForType, appIdx).id,
                },
              });
            }
          }
        }

        // --- Prediction via real AI API ---
        {
          // Build 85-feature input vector in EXACT order matching medical-session.service.ts submit()
          const inputVector: Record<string, number> = {
            // 1-3: Clinical vitals
            pulse: cp.pulse,
            respiratoryRate: cp.respiratoryRate,
            temperature: cp.temperature,
            // 4-11: Blood morphological
            erythrocyteCount: bp.erythrocyteCount,
            leukocyteCount: bp.leukocyteCount,
            thrombocyteCount: bp.thrombocyteCount,
            coe: bp.coe,
            waterPercentage: bp.waterPercentage,
            dryResidue: bp.dryResidue,
            glutathione: bp.glutathione,
            hemoglobin: bp.hemoglobin,
            // 12-41: Blood serum & trace
            totalProtein: bp.totalProtein,
            albumin: bp.albumin,
            alphaGlobulin: bp.alphaGlobulin,
            betaGlobulin: bp.betaGlobulin,
            gammaGlobulin: bp.gammaGlobulin,
            residualNitrogen: bp.residualNitrogen,
            urea: bp.urea,
            uricAcid: bp.uricAcid,
            creatinine: bp.creatinine,
            alkalineReserve: bp.alkalineReserve,
            glucose: bp.glucose,
            ketoneBodies: bp.ketoneBodies,
            totalBilirubin: bp.totalBilirubin,
            directBilirubin: bp.directBilirubin,
            totalCholesterol: bp.totalCholesterol,
            totalLipids: bp.totalLipids,
            phospholipids: bp.phospholipids,
            lacticAcid: bp.lacticAcid,
            pyruvicAcid: bp.pyruvicAcid,
            citricAcid: bp.citricAcid,
            carotene: bp.carotene,
            vitaminA: bp.vitaminA,
            vitaminC: bp.vitaminC,
            organicPhosphorus: bp.organicPhosphorus,
            totalCalcium: bp.totalCalcium,
            creatine: bp.creatine,
            copper: bp.copper,
            zinc: bp.zinc,
            manganese: bp.manganese,
            cobalt: bp.cobalt,
            // 42-57: Urine
            urineColor: up.colorIdx,
            urineSmell: up.smellIdx,
            urineClarity: up.clarityIdx,
            urineConsistency: up.consistencyIdx,
            urinePh: up.ph,
            urineAcetone: up.acetone,
            urineProtein: up.protein,
            urineBilirubin: up.bilirubin,
            urineUrobilinogen: up.urobilinogen,
            urineSugar: up.sugar,
            urineLeukocytes: up.leukocytes,
            urineEpithelium: up.epithelium,
            urineMicrobialBodies: up.microbialBodies,
            urineErythrocytes: up.erythrocytes,
            urineSaltCrystals: up.saltCrystals,
            urineAmount: up.amount,
            // 58-63: Feces
            fecesSmell: fp.smellIdx,
            fecesColor: fp.colorIdx,
            fecesConsistency: fp.consistencyIdx,
            fecesForm: fp.formIdx,
            fecesAmount: fp.amount,
            fecesUndigestedFood: fp.undigestedFood,
            // 64-67: Mucosa
            mucosaOral: 0,
            mucosaNasal: 0,
            mucosaOcular: 0,
            mucosaVaginal: 0,
            // 68-85: Clinical habitus, skin, lymph
            rumination: cp.rumination,
            obesity: cp.obesity === 'good' ? 0 : cp.obesity === 'medium' ? 1 : cp.obesity === 'low' ? 2 : 3,
            bodyType: cp.bodyType === 'strong' ? 0 : cp.bodyType === 'normal' ? 1 : 2,
            bodyPosition: cp.bodyPos === 'natural' ? 0 : 1,
            wool: cp.wool === 'even' ? 0 : cp.wool === 'uneven' ? 1 : 6,
            skinColor: cp.skinColor === 'pale' ? 0 : cp.skinColor === 'white' ? 1 : cp.skinColor === 'red' ? 2 : 4,
            skinHumidity: cp.skinHumidity === 'normal' ? 0 : 1,
            skinSmell: cp.skinSmell === 'none' ? 0 : 1,
            skinTemp: cp.skinTemp === 'raised' ? 0 : 4,
            skinSurface: cp.skinSurface === 'smooth' ? 0 : 1,
            skinElasticity: cp.skinElasticity === 'normal' ? 0 : 1,
            lymphSize: cp.lymphSize === 'normal' ? 0 : 1,
            lymphShape: cp.lymphShape === 'flat' ? 0 : cp.lymphShape === 'round' ? 1 : 3,
            lymphSurface: cp.lymphSurface === 'smooth' ? 0 : 1,
            lymphConsistency: cp.lymphCons === 'dense' ? 0 : 1,
            lymphTemp: cp.lymphTemp === 'normal' ? 0 : 1,
            lymphPain: cp.lymphPain === 'no' ? 0 : 1,
            lymphMobility: cp.lymphMob === 'mobile' ? 0 : 1,
          };

          const numericArray = Object.values(inputVector).map((v) => Number(v));

          // Determine model key based on animal subtype
          const modelKey = def.profile === 'urinary' ? 'cow' :
            def.sexNv === 0 ? 'bull' :
            def.birthDate > '2024-01-01' ? 'calf' :
            def.birthDate > '2021-06-01' ? 'heifer' : 'cow';

          // Call real AI prediction API
          const predictUri = process.env.PREDICT_API_URI || 'http://176.96.241.182:8090/predict';
          let rawOutput: Record<string, any> = {};

          try {
            const response = await axios.post(
              predictUri,
              { params: numericArray },
              { params: { animal: modelKey }, timeout: 10000 },
            );
            rawOutput = response.data;
            console.log(`    AI prediction for ${def.code} (${modelKey}): OK`);
          } catch (err: any) {
            console.warn(`    AI prediction for ${def.code} failed: ${err.message}. Using empty prediction.`);
          }

          await prisma.prediction.create({
            data: {
              sessionId: session.id,
              inputVector: inputVector as any,
              rawOutput: rawOutput as any,
              modelVersion: 'live-v1.0',
            },
          });
        }

        console.log(`  ${def.code} session ${si + 1}/${sessionCount} (${status}) created.`);
      }
    }

    console.log('Demo animals, sessions, exams, and predictions seeded.');
  } else {
    console.log('Demo data already exists. Skipping.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

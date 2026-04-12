import 'dotenv/config';
import { PrismaClient, ProphylaxisType, UserRole, UserGender } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

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
    { ru: 'Кучли жуссали', uz: 'Kuchli jussali', nv: 0 },
    { ru: 'Ўртача жуссали', uz: "O'rtacha jussali", nv: 1 },
    { ru: 'Кучсиз жуссали', uz: 'Kuchsiz jussali', nv: 2 },
  ];
  for (const item of bodyTypes) {
    await prisma.bodyType.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const obesityTypes = [
    { ru: 'Яхши, юқори семиз', uz: 'Yaxshi, yuqori semiz', nv: 0 },
    { ru: 'Ўртача семиз', uz: "O'rtacha semiz", nv: 1 },
    { ru: 'Ўртадан паст семиз', uz: "O'rtadan past semiz", nv: 2 },
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
    { ru: 'Табиий', uz: 'Tabiiy', nv: 0 },
    { ru: 'Мажбурий тик турган', uz: 'Majburiy tik turgan', nv: 1 },
    { ru: 'Мажбурий ётган', uz: 'Majburiy yotgan', nv: 2 },
    { ru: 'Мажбурий ўтирган', uz: "Majburiy o'tirgan", nv: 3 },
    { ru: 'Табиий бўлмаган холат', uz: "Tabiiy bo'lmagan holat", nv: 4 },
    { ru: 'Ихтиёрсиз ҳаракатлар', uz: 'Ixtiyorsiz harakatlar', nv: 5 },
    { ru: 'Монежли ҳаракат', uz: 'Monejli harakat', nv: 6 },
    { ru: 'Айланма ҳаракат', uz: 'Aylanma harakat', nv: 7 },
    { ru: 'Олдинга қараб ҳаракат', uz: 'Oldinga qarab harakat', nv: 8 },
    { ru: 'Орқага қараб ҳаракат', uz: 'Orqaga qarab harakat', nv: 9 },
    { ru: 'Ағанаб ётган жойдаги ҳаракат', uz: "Ag'anab yotgan joyidagi harakat", nv: 10 },
  ];
  for (const item of bodyPositions) {
    await prisma.bodyPosition.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const constitutions = [
    { ru: 'Юмшоқ', uz: 'Yumshoq', nv: 0 },
    { ru: 'Мустаҳкам', uz: 'Mustahkam', nv: 1 },
    { ru: 'Отларда', uz: 'Otlarda', nv: 2 },
    { ru: 'Паррандаларда', uz: 'Parranda', nv: 3 },
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
    { ru: 'Бир текис', uz: 'Bir tekis', nv: 0 },
    { ru: 'Бир текис эмас', uz: 'Bir tekis emas', nv: 1 },
    { ru: 'Терига ётиб туради', uz: 'Teriga yotib turadi', nv: 2 },
    { ru: 'Ялтироқ', uz: 'Yaltiroq', nv: 3 },
    { ru: 'Хира', uz: 'Xira', nv: 4 },
    { ru: 'Тушмайди', uz: 'Tushmaydi', nv: 5 },
    { ru: 'Ҳурпайган', uz: 'Hurpaygan', nv: 6 },
    { ru: 'Бир-бирига ёпишган', uz: 'Bir-biriga yopishgan', nv: 7 },
    { ru: 'Теринг айрим жойларида жунлар тушган', uz: 'Terining ayrim joylarida junlar tushgan', nv: 8 },
    { ru: 'Қалин', uz: 'Qalin', nv: 9 },
    { ru: 'Сийрак', uz: 'Siyrak', nv: 10 },
    { ru: 'Физиологик тулаш', uz: 'Fiziologik tullash', nv: 11 },
    { ru: 'Патологик тулаш', uz: 'Patologik tullash', nv: 12 },
    { ru: 'Жун тушаяпти', uz: 'Jun tushayapti', nv: 13 },
    { ru: 'Жун тушмаяпти', uz: 'Jun tushmayapti', nv: 14 },
  ];
  for (const item of woolTypes) {
    await prisma.woolType.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const downTypes = [
    { ru: 'Зич', uz: 'Zich', nv: 0 },
    { ru: 'Сийрак', uz: 'Siyrak', nv: 1 },
    { ru: 'Йўқ', uz: "Yo'q", nv: 2 },
    { ru: 'Юмшоқ', uz: 'Yumshoq', nv: 3 },
    { ru: 'Силлиқ', uz: 'Silliq', nv: 4 },
    { ru: 'Хира', uz: 'Xira', nv: 5 },
    { ru: 'Ялтироқ', uz: 'Yaltiroq', nv: 6 },
    { ru: 'Қуруқ', uz: 'Quruq', nv: 7 },
    { ru: 'Чанг босган', uz: 'Chang bosgan', nv: 8 },
    { ru: 'Бир текис', uz: 'Bir tekis', nv: 9 },
    { ru: 'Оқ рангли', uz: 'Oq rangli', nv: 10 },
    { ru: 'Кулранг', uz: 'Kulrang', nv: 11 },
    { ru: 'Сарғайган', uz: "Sarg'aygan", nv: 12 },
    { ru: 'Қорамтир', uz: 'Qoramtir', nv: 13 },
    { ru: 'Нам', uz: 'Nam', nv: 14 },
  ];
  for (const item of downTypes) {
    await prisma.downType.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const hairTypes = [
    { ru: 'Дағал', uz: "Dag'al", nv: 0 },
    { ru: 'Сийрак', uz: 'Siyrak', nv: 1 },
  ];
  for (const item of hairTypes) {
    await prisma.hairType.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const featherTypes = [
    { ru: 'Ялтироқ', uz: 'Yaltiroq', nv: 0 },
    { ru: 'Хира', uz: 'Xira', nv: 1 },
    { ru: 'Тўлиқ', uz: "To'liq", nv: 2 },
    { ru: 'Тўкилган', uz: "To'kilgan", nv: 3 },
    { ru: 'Синиқ', uz: 'Siniq', nv: 4 },
  ];
  for (const item of featherTypes) {
    await prisma.featherType.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const skinColors = [
    { ru: 'Оч бинафша', uz: 'Och binafsha', nv: 0 },
    { ru: 'Оқарган', uz: 'Oqargan', nv: 1 },
    { ru: 'Қизарган', uz: 'Qizargan', nv: 2 },
    { ru: 'Кўкарган', uz: "Ko'kargan", nv: 3 },
    { ru: 'Сарғайган', uz: "Sarg'aygan", nv: 4 },
  ];
  for (const item of skinColors) {
    await prisma.skinColor.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const skinHumidities = [
    { ru: 'Ўртача нам', uz: "O'rtacha nam", nv: 0 },
    { ru: 'Гипергидроз', uz: 'Gipergidroz', nv: 1 },
    { ru: 'Маҳаллий терлаган', uz: 'Mahalliy terlagan', nv: 2 },
    { ru: 'Қуруқ — ангидоз', uz: 'Quruq – angidoz', nv: 3 },
  ];
  for (const item of skinHumidities) {
    await prisma.skinHumidity.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const skinTemps = [
    { ru: 'Тери ҳарорати умумий кўтарилган', uz: "Teri harorati umumiy ko'tarilgan", nv: 0 },
    { ru: 'Тери ҳарорати маҳаллий кўтарилган', uz: "Teri harorati mahalliy ko'tarilgan", nv: 1 },
    { ru: 'Тери ҳарорати умумий пасайган', uz: 'Teri harorati umumiy pasaygan', nv: 2 },
    { ru: 'Тери ҳарорати маҳаллий пасайган', uz: 'Teri harorati mahalliy pasaygan', nv: 3 },
    { ru: 'Тери ҳарорати ҳар хил', uz: 'Teri harorati har xil', nv: 4 },
  ];
  for (const item of skinTemps) {
    await prisma.skinTemp.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const skinElasticities = [
    { ru: 'Эластик', uz: 'Elastik', nv: 0 },
    { ru: 'Тери эластиклиги камайган', uz: 'Teri elastikgi kamaygan', nv: 1 },
    { ru: 'Тери эластиклиги умуман йўқ', uz: "Teri elastikligi umuman yo'q", nv: 2 },
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
    { ru: 'Катталмаган', uz: 'Kattarmagan', nv: 0 },
    { ru: 'Катталган', uz: 'Kattargan', nv: 1 },
  ];
  for (const item of lymphSizes) {
    await prisma.lymphSize.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const lymphShapes = [
    { ru: 'Ясси', uz: 'Yassi', nv: 0 },
    { ru: 'Думалоқ', uz: 'Dumaloq', nv: 1 },
    { ru: 'Катталган', uz: 'Kattargan', nv: 2 },
    { ru: 'Шишган', uz: 'Shishgan', nv: 3 },
  ];
  for (const item of lymphShapes) {
    await prisma.lymphShape.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const lymphSurfaces = [
    { ru: 'Силлиқ', uz: 'Silliq', nv: 0 },
    { ru: 'Ғадир-будир', uz: "G'adir-budir", nv: 1 },
  ];
  for (const item of lymphSurfaces) {
    await prisma.lymphSurface.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const lymphConsistencies = [
    { ru: 'Зич', uz: 'Zich', nv: 0 },
    { ru: 'Билқиллаган', uz: 'Bilqillagan', nv: 1 },
    { ru: 'Ўзига хос', uz: "O'ziga xos", nv: 2 },
  ];
  for (const item of lymphConsistencies) {
    await prisma.lymphConsistency.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const lymphTemps = [
    { ru: 'Ўртача', uz: "O'rtacha", nv: 0 },
    { ru: 'Ошган', uz: 'Oshgan', nv: 1 },
  ];
  for (const item of lymphTemps) {
    await prisma.lymphTemp.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const lymphPains = [
    { ru: 'Оғриқсиз', uz: "Og'riqsiz", nv: 0 },
    { ru: 'Оғриқли', uz: "Og'riqli", nv: 1 },
  ];
  for (const item of lymphPains) {
    await prisma.lymphPain.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const lymphMobilities = [
    { ru: 'Ҳаракатчан', uz: 'Harakatchan', nv: 0 },
    { ru: 'Кам ҳаракатчан', uz: 'Kam harakatchan', nv: 1 },
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
    { ru: 'Оғиз', uz: "Og'iz", nv: 0 },
    { ru: 'Бурун', uz: 'Burun', nv: 1 },
    { ru: 'Кўз', uz: "Ko'z", nv: 2 },
    { ru: 'Репродуктив', uz: 'Reproduktiv organ', nv: 3 },
  ];
  for (const item of mucosaTypes) {
    await prisma.mucosaType.upsert({
      where: { numericValue: item.nv },
      update: {},
      create: { name: n(item.ru, item.uz), numericValue: item.nv },
    });
  }

  const animalSexes = [
    { ru: 'Эркак', uz: 'Erkak', nv: 0 },                                           // MALE
    { ru: 'Аёл', uz: 'Ayol', nv: 1 },                                              // FEMALE
    { ru: 'Кастрация қилинган эркак', uz: 'Kastratsiya qilingan erkak', nv: 2 },   // NEUTERED
    { ru: 'Стерилизация қилинган аёл', uz: 'Sterilizatsiya qilingan ayol', nv: 3 }, // SPAYED
    { ru: 'Номаълум', uz: "Noma'lum", nv: 4 },                                     // UNKNOWN
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
              ru: 'Буқа (Бык)',
              uz: 'Buqa',
              modelKey: 'bull',
              sexId: maleSex?.id ?? null,
              minAgeMonths: 36,
              maxAgeMonths: null,
            },
            {
              ru: 'Гунажин (Тёлка)',
              uz: "G'unojin",
              modelKey: 'heifer',
              sexId: femaleSex?.id ?? null,
              minAgeMonths: 12,
              maxAgeMonths: 35,
            },
            {
              ru: 'Сигир (Корова)',
              uz: 'Sigir',
              modelKey: 'cow',
              sexId: femaleSex?.id ?? null,
              minAgeMonths: 24,
              maxAgeMonths: null,
            },
            {
              ru: 'Бузоқ (Телёнок)',
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

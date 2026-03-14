import { PrismaClient, ProphylaxisType, UserRole, UserGender } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding ...');

  // --- 0. Clinical Exam Lookup Tables (former Prisma enums) ---

  const bodyTypes = [
    { nameRu: 'Кучли жуссали', nameUz: 'Kuchli jussali', numericValue: 0 },       // STRONG
    { nameRu: 'Ўртача жуссали', nameUz: "O'rtacha jussali", numericValue: 1 },     // MEDIUM
    { nameRu: 'Кучсиз жуссали', nameUz: 'Kuchsiz jussali', numericValue: 2 },      // WEAK
  ];
  for (const item of bodyTypes) {
    await prisma.bodyType.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const obesityTypes = [
    { nameRu: 'Яхши, юқори семиз', nameUz: 'Yaxshi, yuqori semiz', numericValue: 0 },  // HIGH
    { nameRu: 'Ўртача семиз', nameUz: "O'rtacha semiz", numericValue: 1 },               // MEDIUM
    { nameRu: 'Ўртадан паст семиз', nameUz: "O'rtadan past semiz", numericValue: 2 },    // LOW
    { nameRu: 'Кахексия', nameUz: 'Kaxeksiya', numericValue: 3 },                        // CACHEXIA
  ];
  for (const item of obesityTypes) {
    await prisma.obesityType.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const bodyPositions = [
    { nameRu: 'Табиий', nameUz: 'Tabiiy', numericValue: 0 },                                          // NATURAL
    { nameRu: 'Мажбурий тик турган', nameUz: 'Majburiy tik turgan', numericValue: 1 },                // FORCED_STANDING
    { nameRu: 'Мажбурий ётган', nameUz: 'Majburiy yotgan', numericValue: 2 },                         // FORCED_LYING
    { nameRu: 'Мажбурий ўтирган', nameUz: "Majburiy o'tirgan", numericValue: 3 },                     // FORCED_SITTING
    { nameRu: 'Табиий бўлмаган холат', nameUz: "Tabiiy bo'lmagan holat", numericValue: 4 },           // NON_THERAPEUTIC
    { nameRu: 'Ихтиёрсиз ҳаракатлар', nameUz: 'Ixtiyorsiz harakatlar', numericValue: 5 },             // INVOLUNTARY
    { nameRu: 'Монежли ҳаракат', nameUz: 'Monejli harakat', numericValue: 6 },                        // MANEGE
    { nameRu: 'Айланма ҳаракат', nameUz: 'Aylanma harakat', numericValue: 7 },                        // CIRCULAR
    { nameRu: 'Олдинга қараб ҳаракат', nameUz: 'Oldinga qarab harakat', numericValue: 8 },            // FORWARD
    { nameRu: 'Орқага қараб ҳаракат', nameUz: 'Orqaga qarab harakat', numericValue: 9 },              // BACKWARD
    { nameRu: 'Ағанаб ётган жойдаги ҳаракат', nameUz: "Ag'anab yotgan joyidagi harakat", numericValue: 10 }, // ROLLING
  ];
  for (const item of bodyPositions) {
    await prisma.bodyPosition.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const constitutions = [
    { nameRu: 'Юмшоқ', nameUz: 'Yumshoq', numericValue: 0 },           // LOOSE
    { nameRu: 'Мустаҳкам', nameUz: "Mustahkam", numericValue: 1 },       // DENSE
    { nameRu: 'Отларда', nameUz: 'Otlarda', numericValue: 2 },           // HORSES
    { nameRu: 'Паррандаларда', nameUz: 'Parranda', numericValue: 3 },    // BIRDS
  ];
  for (const item of constitutions) {
    await prisma.constitution.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const temperaments = [
    { nameRu: 'Меланхолик', nameUz: 'Melanxolik', numericValue: 0 },    // MELANCHOLIC
    { nameRu: 'Флегматик', nameUz: 'Flegmatik', numericValue: 1 },       // PHLEGMATIC
  ];
  for (const item of temperaments) {
    await prisma.temperament.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const woolTypes = [
    { nameRu: 'Бир текис', nameUz: 'Bir tekis', numericValue: 0 },                                          // EVEN
    { nameRu: 'Бир текис эмас', nameUz: 'Bir tekis emas', numericValue: 1 },                                // UNEVEN
    { nameRu: 'Терига ётиб туради', nameUz: 'Teriga yotib turadi', numericValue: 2 },                       // LYING_FLAT
    { nameRu: 'Ялтироқ', nameUz: 'Yaltiroq', numericValue: 3 },                                             // SHINY
    { nameRu: 'Хира', nameUz: 'Xira', numericValue: 4 },                                                    // MATTE
    { nameRu: 'Тушмайди', nameUz: 'Tushmaydi', numericValue: 5 },                                           // NOT_FALLING
    { nameRu: 'Ҳурпайган', nameUz: 'Hurpaygan', numericValue: 6 },                                          // DISHEVELED
    { nameRu: 'Бир-бирига ёпишган', nameUz: 'Bir-biriga yopishgan', numericValue: 7 },                      // MATTED
    { nameRu: 'Теринг айрим жойларида жунлар тушган', nameUz: 'Terining ayrim joylarida junlar tushgan', numericValue: 8 }, // BALD_PATCHES
    { nameRu: 'Қалин', nameUz: 'Qalin', numericValue: 9 },                                                  // THICK
    { nameRu: 'Сийрак', nameUz: 'Siyrak', numericValue: 10 },                                               // SPARSE
    { nameRu: 'Физиологик тулаш', nameUz: 'Fiziologik tullash', numericValue: 11 },                         // PHYSIOLOGICAL_MOLT
    { nameRu: 'Патологик тулаш', nameUz: 'Patologik tullash', numericValue: 12 },                           // PATHOLOGICAL_MOLT
    { nameRu: 'Жун тушаяпти', nameUz: 'Jun tushayapti', numericValue: 13 },                                 // FALLING
    { nameRu: 'Жун тушмаяпти', nameUz: 'Jun tushmayapti', numericValue: 14 },                               // NOT_FALLING_OUT
  ];
  for (const item of woolTypes) {
    await prisma.woolType.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const downTypes = [
    { nameRu: 'Зич', nameUz: 'Zich', numericValue: 0 },               // DENSE
    { nameRu: 'Сийрак', nameUz: 'Siyrak', numericValue: 1 },          // SPARSE
    { nameRu: 'Йўқ', nameUz: "Yo'q", numericValue: 2 },               // NONE
    { nameRu: 'Юмшоқ', nameUz: 'Yumshoq', numericValue: 3 },          // SOFT
    { nameRu: 'Силлиқ', nameUz: 'Silliq', numericValue: 4 },          // SMOOTH
    { nameRu: 'Хира', nameUz: 'Xira', numericValue: 5 },              // MATTE
    { nameRu: 'Ялтироқ', nameUz: 'Yaltiroq', numericValue: 6 },       // SHINY
    { nameRu: 'Қуруқ', nameUz: 'Quruq', numericValue: 7 },            // DRY
    { nameRu: 'Чанг босган', nameUz: 'Chang bosgan', numericValue: 8 }, // DUSTY
    { nameRu: 'Бир текис', nameUz: 'Bir tekis', numericValue: 9 },    // EVEN
    { nameRu: 'Оқ рангли', nameUz: 'Oq rangli', numericValue: 10 },   // WHITE
    { nameRu: 'Кулранг', nameUz: 'Kulrang', numericValue: 11 },       // GRAY
    { nameRu: 'Сарғайган', nameUz: "Sarg'aygan", numericValue: 12 },  // YELLOWISH
    { nameRu: 'Қорамтир', nameUz: 'Qoramtir', numericValue: 13 },     // DARK
    { nameRu: 'Нам', nameUz: 'Nam', numericValue: 14 },               // MOIST
  ];
  for (const item of downTypes) {
    await prisma.downType.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const hairTypes = [
    { nameRu: 'Дағал', nameUz: "Dag'al", numericValue: 0 },           // COARSE
    { nameRu: 'Сийрак', nameUz: 'Siyrak', numericValue: 1 },          // SPARSE
  ];
  for (const item of hairTypes) {
    await prisma.hairType.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const featherTypes = [
    { nameRu: 'Ялтироқ', nameUz: 'Yaltiroq', numericValue: 0 },      // SHINY
    { nameRu: 'Хира', nameUz: 'Xira', numericValue: 1 },              // MATTE
    { nameRu: 'Тўлиқ', nameUz: "To'liq", numericValue: 2 },           // FULL
    { nameRu: 'Тўкилган', nameUz: "To'kilgan", numericValue: 3 },     // FALLEN
    { nameRu: 'Синиқ', nameUz: 'Siniq', numericValue: 4 },            // BROKEN
  ];
  for (const item of featherTypes) {
    await prisma.featherType.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const skinColors = [
    { nameRu: 'Оч бинафша', nameUz: 'Och binafsha', numericValue: 0 }, // PALE_VIOLET
    { nameRu: 'Оқарган', nameUz: 'Oqargan', numericValue: 1 },          // PALE
    { nameRu: 'Қизарган', nameUz: 'Qizargan', numericValue: 2 },        // RED
    { nameRu: 'Кўкарган', nameUz: "Ko'kargan", numericValue: 3 },       // BLUE
    { nameRu: 'Сарғайган', nameUz: "Sarg'aygan", numericValue: 4 },     // YELLOW
  ];
  for (const item of skinColors) {
    await prisma.skinColor.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const skinHumidities = [
    { nameRu: 'Ўртача нам', nameUz: "O'rtacha nam", numericValue: 0 },    // MODERATE
    { nameRu: 'Гипергидроз', nameUz: 'Gipergidroz', numericValue: 1 },     // HYPERHIDROSIS
    { nameRu: 'Маҳаллий терлаган', nameUz: 'Mahalliy terlagan', numericValue: 2 }, // LOCAL_SWEAT
    { nameRu: 'Қуруқ — ангидоз', nameUz: 'Quruq – angidoz', numericValue: 3 }, // DRY
  ];
  for (const item of skinHumidities) {
    await prisma.skinHumidity.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const skinTemps = [
    { nameRu: 'Тери ҳарорати умумий кўтарилган', nameUz: "Teri harorati umumiy ko'tarilgan", numericValue: 0 }, // GENERAL_HIGH
    { nameRu: 'Тери ҳарорати маҳаллий кўтарилган', nameUz: "Teri harorati mahalliy ko'tarilgan", numericValue: 1 }, // LOCAL_HIGH
    { nameRu: 'Тери ҳарорати умумий пасайган', nameUz: 'Teri harorati umumiy pasaygan', numericValue: 2 },           // GENERAL_LOW
    { nameRu: 'Тери ҳарорати маҳаллий пасайган', nameUz: 'Teri harorati mahalliy pasaygan', numericValue: 3 },       // LOCAL_LOW
    { nameRu: 'Тери ҳарорати ҳар хил', nameUz: 'Teri harorati har xil', numericValue: 4 },                          // UNEVEN
  ];
  for (const item of skinTemps) {
    await prisma.skinTemp.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const skinElasticities = [
    { nameRu: 'Эластик', nameUz: 'Elastik', numericValue: 0 },                                          // ELASTIC
    { nameRu: 'Тери эластиклиги камайган', nameUz: 'Teri elastikgi kamaygan', numericValue: 1 },         // REDUCED
    { nameRu: 'Тери эластиклиги умуман йўқ', nameUz: "Teri elastikligi umuman yo'q", numericValue: 2 }, // NONE
  ];
  for (const item of skinElasticities) {
    await prisma.skinElasticity.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const lymphSizes = [
    { nameRu: 'Катталмаган', nameUz: 'Kattarmagan', numericValue: 0 }, // NORMAL
    { nameRu: 'Катталган', nameUz: 'Kattargan', numericValue: 1 },     // ENLARGED
  ];
  for (const item of lymphSizes) {
    await prisma.lymphSize.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const lymphShapes = [
    { nameRu: 'Ясси', nameUz: 'Yassi', numericValue: 0 },      // FLAT
    { nameRu: 'Думалоқ', nameUz: 'Dumaloq', numericValue: 1 }, // ROUND
    { nameRu: 'Катталган', nameUz: 'Kattargan', numericValue: 2 }, // ENLARGED
    { nameRu: 'Шишган', nameUz: 'Shishgan', numericValue: 3 },  // SWOLLEN
  ];
  for (const item of lymphShapes) {
    await prisma.lymphShape.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const lymphSurfaces = [
    { nameRu: 'Силлиқ', nameUz: 'Silliq', numericValue: 0 },           // SMOOTH
    { nameRu: 'Ғадир-будир', nameUz: "G'adir-budir", numericValue: 1 }, // ROUGH
  ];
  for (const item of lymphSurfaces) {
    await prisma.lymphSurface.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const lymphConsistencies = [
    { nameRu: 'Зич', nameUz: 'Zich', numericValue: 0 },               // DENSE
    { nameRu: 'Билқиллаган', nameUz: 'Bilqillagan', numericValue: 1 }, // SOFT
    { nameRu: 'Ўзига хос', nameUz: "O'ziga xos", numericValue: 2 },   // SPECIFIC
  ];
  for (const item of lymphConsistencies) {
    await prisma.lymphConsistency.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const lymphTemps = [
    { nameRu: 'Ўртача', nameUz: "O'rtacha", numericValue: 0 }, // NORMAL
    { nameRu: 'Ошган', nameUz: 'Oshgan', numericValue: 1 },    // ELEVATED
  ];
  for (const item of lymphTemps) {
    await prisma.lymphTemp.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const lymphPains = [
    { nameRu: 'Оғриқсиз', nameUz: "Og'riqsiz", numericValue: 0 }, // PAINLESS
    { nameRu: 'Оғриқли', nameUz: "Og'riqli", numericValue: 1 },    // PAINFUL
  ];
  for (const item of lymphPains) {
    await prisma.lymphPain.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const lymphMobilities = [
    { nameRu: 'Ҳаракатчан', nameUz: 'Harakatchan', numericValue: 0 },         // MOBILE
    { nameRu: 'Кам ҳаракатчан', nameUz: 'Kam harakatchan', numericValue: 1 }, // LOW_MOBILITY
  ];
  for (const item of lymphMobilities) {
    await prisma.lymphMobility.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const mucosaTypes = [
    { nameRu: 'Оғиз', nameUz: "Og'iz", numericValue: 0 },               // ORAL
    { nameRu: 'Бурун', nameUz: 'Burun', numericValue: 1 },               // NASAL
    { nameRu: 'Кўз', nameUz: "Ko'z", numericValue: 2 },                  // OCULAR
    { nameRu: 'Репродуктив', nameUz: 'Reproduktiv organ', numericValue: 3 }, // REPRODUCTIVE
  ];
  for (const item of mucosaTypes) {
    await prisma.mucosaType.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const animalSexes = [
    { nameRu: 'Эркак', nameUz: 'Erkak', numericValue: 0 },                                        // MALE
    { nameRu: 'Аёл', nameUz: 'Ayol', numericValue: 1 },                                           // FEMALE
    { nameRu: 'Кастрация қилинган эркак', nameUz: 'Kastratsiya qilingan erkak', numericValue: 2 }, // NEUTERED
    { nameRu: 'Стерилизация қилинган аёл', nameUz: 'Sterilizatsiya qilingan ayol', numericValue: 3 }, // SPAYED
    { nameRu: "Номаълум", nameUz: "Noma'lum", numericValue: 4 },                                   // UNKNOWN
  ];
  for (const item of animalSexes) {
    await prisma.animalSex.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  console.log('Clinical exam lookup tables seeded.');

  // --- 1. Regions and Districts ---
  const regionsWithDistricts = [
    {
      name: 'Tashkent',
      districts: ['Yunusabad', 'Chilanzar', 'Bektemir'],
    },
    {
      name: 'Samarkand',
      districts: ['Samarkand City', 'Pastdargom', 'Urgut'],
    },
    {
      name: 'Andijan',
      districts: ['Andijan City', 'Asaka', 'Buloqboshi'],
    },
  ];

  for (const region of regionsWithDistricts) {
    await prisma.region.upsert({
      where: { nameRu: region.name },
      update: {},
      create: {
        nameRu: region.name,
        nameUz: region.name,
        districts: {
          create: region.districts.map((d) => ({ nameRu: d, nameUz: d })),
        },
      },
    });
  }
  console.log('Regions and Districts seeded.');

  // --- 2. Users ---
  const district = await prisma.district.findFirst();
  if (district) {
    await prisma.user.upsert({
      where: { phone: '+998679050005' },
      update: {},
      create: {
        phone: '+998679050005',
        username: 'admin',
        password: await bcrypt.hash('123qazwsx', 10),
        firstName: 'John',
        lastName: 'Doe',
        address: 'Дагбитская улица, 168а',
        districtId: district.id,
        role: UserRole.SUPER_ADMIN,
        gender: UserGender.MALE,
      },
    });
    console.log('Admin user seeded.');
  }

  // --- 3. Animal Types Hierarchy ---
  const animalTypes = [
    {
      nameRu: 'Сельскохозяйственные животные',
      nameUz: "Qishloq xo'jalik hayvonlari",
      children: [
        {
          nameRu: 'Крупный рогатый скот',
          nameUz: 'Qoramol',
          children: [],
          breeds: [
            { nameRu: 'Голштинская порода', nameUz: 'Holstein' },
            { nameRu: 'Эрширская порода', nameUz: 'Ayrshire' },
            { nameRu: 'Джерсейская порода', nameUz: 'Jersey' },
            { nameRu: 'Гернсейская порода', nameUz: 'Guernsey' },
            { nameRu: 'Браун швиц', nameUz: 'Brown Swiss' },
            { nameRu: 'Симментальская порода', nameUz: 'Simmental' },
            { nameRu: 'Герефордская порода', nameUz: 'Hereford' },
            { nameRu: 'Ангусская порода', nameUz: 'Angus' },
            { nameRu: 'Лимузинская порода', nameUz: 'Limousin' },
            { nameRu: 'Шаролезская порода', nameUz: 'Charolais' },
            { nameRu: 'Брахманская порода', nameUz: 'Brahman' },
            { nameRu: 'Ред Синдхи', nameUz: 'Red Sindhi' },
            { nameRu: 'Харианская порода', nameUz: 'Hariana' },
            { nameRu: 'Холмогорская порода', nameUz: 'Kholmogor' },
            { nameRu: 'Ярославская порода', nameUz: 'Yaroslavl' },
          ],
          colors: [
            { nameRu: 'Белый', nameUz: 'Oq' },
            { nameRu: 'Черный', nameUz: 'Qora' },
            { nameRu: 'Пестрый', nameUz: 'Ola-bula' },
            { nameRu: 'Рыжеватый', nameUz: "Qizg'ish" },
            { nameRu: 'Серый', nameUz: 'Sur' },
            { nameRu: 'Серо-бурый', nameUz: 'Kulrang' },
            { nameRu: 'Коричневый', nameUz: 'Jigarrang' },
          ],
        },
        {
          nameRu: 'Мелкий рогатый скот',
          nameUz: 'Mayda shoxli hayvonlar',
          children: [
            {
              nameRu: 'Овца',
              nameUz: "Qo'y",
              breeds: [
                { nameRu: 'Меринос', nameUz: 'Merinos' },
                { nameRu: 'Каракульская порода', nameUz: 'Karakul' },
                { nameRu: 'Романовская порода', nameUz: 'Romanov' },
                { nameRu: 'Гиссарская порода', nameUz: 'Gissar' },
                { nameRu: 'Эдильбаевская порода', nameUz: 'Edilbay' },
                { nameRu: 'Дорсет', nameUz: 'Dorset' },
                { nameRu: 'Саффолк', nameUz: 'Suffolk' },
                { nameRu: 'Авасси', nameUz: 'Awassi' },
                { nameRu: 'Тексель', nameUz: 'Texel' },
                { nameRu: 'Гемпшир', nameUz: 'Hampshire' },
                { nameRu: 'Валахская порода', nameUz: 'Valaxiya' },
                { nameRu: 'Карабахская порода', nameUz: 'Karabakh' },
                { nameRu: 'Шевиот', nameUz: 'Cheviot' },
                { nameRu: 'Дорпер', nameUz: 'Dorper' },
              ],
              colors: [
                { nameRu: 'Белый', nameUz: 'Oq' },
                { nameRu: 'Чёрный', nameUz: 'Qora' },
                { nameRu: 'Коричневый', nameUz: 'Jigarrang' },
                { nameRu: 'Серый', nameUz: 'Kulrang' },
                { nameRu: 'Жёлтый', nameUz: 'Sariq' },
                { nameRu: 'Тёмный', nameUz: 'Qoramtir' },
                { nameRu: 'Белый с чёрным', nameUz: 'Oq-qora' },
                { nameRu: 'Коричнево-чёрный', nameUz: 'Jigarrang-qora' },
                { nameRu: 'Серо-чёрный', nameUz: 'Kulrang-qora' },
                { nameRu: 'Жёлто-коричневый', nameUz: 'Sariq-jigarrang' },
              ],
            },
            {
              nameRu: 'Коза',
              nameUz: 'Echki',
              breeds: [
                { nameRu: 'Зааненская порода', nameUz: 'Zaanen' },
                { nameRu: 'Тоггенбургская порода', nameUz: 'Toggenburg' },
                { nameRu: 'Альпийская порода', nameUz: 'Alpin' },
                { nameRu: 'Нубийская порода', nameUz: 'Nubian' },
                { nameRu: 'Ла-Манча', nameUz: 'La-Mancha' },
                { nameRu: 'Бурская порода', nameUz: 'Boer' },
                { nameRu: 'Кико', nameUz: 'Kiko' },
                { nameRu: 'Испанская порода', nameUz: 'Spanish' },
                { nameRu: 'Ангорская коза', nameUz: 'Angora' },
                { nameRu: 'Кашмирская коза', nameUz: 'Kashmir' },
                { nameRu: 'Узбекская чёрная коза', nameUz: 'O\'zbekiston qora echkisi' },
                { nameRu: 'Узбекская пуховая коза', nameUz: 'O\'zbekiston mo\'ynali echkisi' },
                { nameRu: 'Киргизская горная коза', nameUz: 'Qirg\'iz tog\' echkisi' },
                { nameRu: 'Таджикская горная коза', nameUz: 'Tojik tog\' echkisi' },
                { nameRu: 'Сирийская коза', nameUz: 'Suriyalik echki' },
                { nameRu: 'Мархур', nameUz: 'Markhor' },
                { nameRu: 'Битальская порода', nameUz: 'Beetal' },
                { nameRu: 'Джамнапари', nameUz: 'Jamnapari' },
                { nameRu: 'Сирохийская порода', nameUz: 'Sirohi' },
                { nameRu: 'Барбарийская порода', nameUz: 'Barbari' },
              ],
              colors: [
                { nameRu: 'Белый', nameUz: 'Oq' },
                { nameRu: 'Чёрный', nameUz: 'Qora' },
                { nameRu: 'Коричневый', nameUz: 'Jigarrang' },
                { nameRu: 'Серый', nameUz: 'Kulrang' },
                { nameRu: 'Красновато-коричневый', nameUz: 'Qizg\'ish-jigarrang' },
                { nameRu: 'Белый с чёрным', nameUz: 'Oq-qora' },
                { nameRu: 'Золотистый', nameUz: 'Oltin' },
                { nameRu: 'Пепельный', nameUz: 'Bo\'r rang' },
              ],
            },
          ],
        },
        {
          nameRu: 'Верблюды',
          nameUz: 'Tuyalar',
          children: [
            {
              nameRu: 'Одногорбый',
              nameUz: 'Bir o`rkachli',
              breeds: [
                { nameRu: 'Афганская порода', nameUz: 'Afg\'on tuya zoti' },
                { nameRu: 'Арабская порода', nameUz: 'Arab tuya zoti' },
                { nameRu: 'Сомалийская порода', nameUz: 'Somali tuya zoti' },
                { nameRu: 'Индийская порода', nameUz: 'Hind tuya zoti' },
                { nameRu: 'Пакистанская порода', nameUz: 'Pokiston tuya zoti' },
                { nameRu: 'Суданская порода', nameUz: 'Sudan tuya zoti' },
                { nameRu: 'Иранская порода', nameUz: 'Eron tuya zoti' },
                { nameRu: 'Туркменская порода', nameUz: 'Turkman tuya zoti' },
                { nameRu: 'Белуджистанская порода', nameUz: 'Balujiston tuya zoti' },
                { nameRu: 'Магрибская порода', nameUz: 'Mag\'rib tuya zoti' },
              ],
              colors: [
                { nameRu: 'Белый', nameUz: 'Oq' },
                { nameRu: 'Желтоватый', nameUz: 'Sarg\'ish' },
                { nameRu: 'Коричневый', nameUz: 'Jigarrang' },
                { nameRu: 'Красноватый', nameUz: 'Qizg\'ish' },
                { nameRu: 'Чёрный', nameUz: 'Qora' },
                { nameRu: 'Серый', nameUz: 'Kulrang' },
                { nameRu: 'Бурый', nameUz: 'Qo\'ng\'ir' },
              ],
            },
            {
              nameRu: 'Двугорбые',
              nameUz: 'Ikki o`rkachli',
              breeds: [
                { nameRu: 'Казахстанская порода', nameUz: 'Qozog\'iston tuya zoti' },
                { nameRu: 'Монгольская порода', nameUz: 'Mongol tuya zoti' },
                { nameRu: 'Иранская порода', nameUz: 'Eron tuya zoti' },
                { nameRu: 'Китайская порода', nameUz: 'Xitoy tuya zoti' },
                { nameRu: 'Туркменская порода', nameUz: 'Turkman tuya zoti' },
                { nameRu: 'Узбекская порода', nameUz: 'O\'zbekiston tuya zoti' },
                { nameRu: 'Каракалпакская порода', nameUz: 'Qoraqalpoq tuya zoti' },
              ],
              colors: [
                { nameRu: 'Белый', nameUz: 'Oq' },
                { nameRu: 'Желтоватый', nameUz: 'Sarg\'ish' },
                { nameRu: 'Коричневый', nameUz: 'Jigarrang' },
                { nameRu: 'Красноватый', nameUz: 'Qizg\'ish' },
                { nameRu: 'Чёрный', nameUz: 'Qora' },
                { nameRu: 'Серый', nameUz: 'Kulrang' },
                { nameRu: 'Бурый', nameUz: 'Qo\'ng\'ir' },
              ],
            },
          ],
        },
        {
          nameRu: 'Лошади',
          nameUz: 'Otlar',
          children: [],
          breeds: [
            { nameRu: 'Арабская лошадь', nameUz: 'Arab oti' },
            { nameRu: 'Английская скаковая', nameUz: 'Ingliz chopard oti' },
            { nameRu: 'Орловский рысак', nameUz: 'Orlov yo\'rg\'asi' },
            { nameRu: 'Донская лошадь', nameUz: 'Don oti' },
            { nameRu: 'Казахстанская лошадь', nameUz: 'Qozog\'iston oti' },
            { nameRu: 'Карабаирская лошадь', nameUz: 'Qorabair oti' },
            { nameRu: 'Ахалтекинская лошадь', nameUz: 'Achal-tekinskiy oti' },
            { nameRu: 'Будённовская лошадь', nameUz: 'Budennovsk oti' },
            { nameRu: 'Кабардинская лошадь', nameUz: 'Kabardin oti' },
            { nameRu: 'Киргизская лошадь', nameUz: 'Qirg\'iz oti' },
            { nameRu: 'Узбекская лошадь', nameUz: 'O\'zbek oti' },
            { nameRu: 'Монгольская лошадь', nameUz: 'Mo\'g\'ul oti' },
            { nameRu: 'Фризская лошадь', nameUz: 'Friz oti' },
            { nameRu: 'Шетландский пони', nameUz: 'Shetland poni' },
            { nameRu: 'Гафлингер', nameUz: 'Haflinger' },
            { nameRu: 'Першерон', nameUz: 'Percheron' },
            { nameRu: 'Арденская лошадь', nameUz: 'Arden oti' },
            { nameRu: 'Торийская лошадь', nameUz: 'Tori oti' },
            { nameRu: 'Тракененская лошадь', nameUz: 'Trakenen oti' },
            { nameRu: 'Липицанская лошадь', nameUz: 'Lipitsian oti' },
          ],
          colors: [
            { nameRu: 'Чёрный', nameUz: 'Qora' },
            { nameRu: 'Белый', nameUz: 'Oq' },
            { nameRu: 'Коричневый', nameUz: 'Jigarrang' },
            { nameRu: 'Красновато-коричневый', nameUz: 'Qizg\'ish-jigarrang' },
            { nameRu: 'Серый', nameUz: 'Kulrang' },
            { nameRu: 'Пепельный', nameUz: 'Bo\'r rang' },
            { nameRu: 'Желтоватый', nameUz: 'Sarg\'ish' },
            { nameRu: 'Бурый', nameUz: 'Qo\'ng\'ir' },
            { nameRu: 'Алазан', nameUz: 'Alazan' },
            { nameRu: 'Буланый', nameUz: 'Bulan' },
          ],
        },
        {
          nameRu: 'Ослы',
          nameUz: 'Eshaklar',
          children: [],
          breeds: [
            { nameRu: 'Узбекский осёл', nameUz: 'O\'zbekiston eshagi' },
            { nameRu: 'Каракалпакский осёл', nameUz: 'Qoraqalpoq eshagi' },
            { nameRu: 'Туркменский осёл', nameUz: 'Turkman eshagi' },
            { nameRu: 'Таджикский осёл', nameUz: 'Tojik eshagi' },
            { nameRu: 'Киргизский осёл', nameUz: 'Qirg\'iz eshagi' },
            { nameRu: 'Китайский осёл', nameUz: 'Xitoy eshagi' },
            { nameRu: 'Сомалийский осёл', nameUz: 'Somali eshagi' },
            { nameRu: 'Нубийский осёл', nameUz: 'Nubian eshagi' },
            { nameRu: 'Андалузский осёл', nameUz: 'Andalusiya eshagi' },
            { nameRu: 'Каталонский осёл', nameUz: 'Kataloniya eshagi' },
            { nameRu: 'Пуату осёл', nameUz: 'Poitou eshagi' },
            { nameRu: 'Американский мини-осёл', nameUz: 'Amerika mini eshagi' },
          ],
          colors: [
            { nameRu: 'Белый', nameUz: 'Oq' },
            { nameRu: 'Чёрный', nameUz: 'Qora' },
            { nameRu: 'Коричневый', nameUz: 'Jigarrang' },
            { nameRu: 'Серый', nameUz: 'Kulrang' },
            { nameRu: 'Желтоватый', nameUz: 'Sarg\'ish' },
            { nameRu: 'Бурый', nameUz: 'Qo\'ng\'ir' },
            { nameRu: 'Красновато-коричневый', nameUz: 'Qizg\'ish-jigarrang' },
            { nameRu: 'Белый с коричневым', nameUz: 'Oq-jigarrang aralash' },
          ],
        },
        {
          nameRu: 'Зебры',
          nameUz: 'Zebralar',
          children: [],
          breeds: [
            { nameRu: 'Равнинная зебра', nameUz: 'Tekislik zebrasi' },
            { nameRu: 'Зебра Греви', nameUz: 'Grevi zebrasi' },
            { nameRu: 'Горная зебра', nameUz: 'Tog\' zebrasi' },
            { nameRu: 'Зебра Гранта', nameUz: 'Grant zebrasi' },
            { nameRu: 'Зебра Чапмана', nameUz: 'Chapman zebrasi' },
            { nameRu: 'Горная зебра Хартмана', nameUz: 'Hartmann tog\' zebrasi' },
          ],
          colors: [
            { nameRu: 'Белый с чёрным', nameUz: 'Oq-qora' },
            { nameRu: 'Белый с коричневым', nameUz: 'Oq-jigarrang' },
            { nameRu: 'Чёрный с коричневым', nameUz: 'Qora-jigarrang' },
            { nameRu: 'Белый с серым', nameUz: 'Oq-kulrang' },
            { nameRu: 'Белый с желтоватым', nameUz: 'Oq-sarg\'ish' },
          ],
        },
        {
          nameRu: 'Свиньи',
          nameUz: "Cho'chqalar",
          children: [],
          breeds: [
            { nameRu: 'Узбекская свинья', nameUz: 'O\'zbekiston cho\'chqasi' },
            { nameRu: 'Крупная белая свинья', nameUz: 'Katta oq cho\'chqa' },
            { nameRu: 'Ландрас', nameUz: 'Landras' },
            { nameRu: 'Дюрок', nameUz: 'Durok' },
            { nameRu: 'Гемпшир', nameUz: 'Hampshire' },
            { nameRu: 'Йоркшир', nameUz: 'Yorshir' },
            { nameRu: 'Беркшир', nameUz: 'Berkshir' },
            { nameRu: 'Эстонский бекон', nameUz: 'Estoniya bekoni' },
            { nameRu: 'Латвийская белая свинья', nameUz: 'Latviya oq cho\'chqasi' },
            { nameRu: 'Украинская порода', nameUz: 'Ukrainaning cho\'chqa zoti' },
            { nameRu: 'Белорусская белая', nameUz: 'Belorus oq cho\'chqasi' },
            { nameRu: 'Вьетнамская вислобрюхая', nameUz: 'Vyetnam vislobryux cho\'chqasi' },
            { nameRu: 'Пьетрен', nameUz: 'Pietren' },
            { nameRu: 'Тамворт', nameUz: 'Tamvort' },
            { nameRu: 'Мангалица', nameUz: 'Mangalitsa' },
          ],
          colors: [
            { nameRu: 'Белый', nameUz: 'Oq' },
            { nameRu: 'Чёрный', nameUz: 'Qora' },
            { nameRu: 'Коричневый', nameUz: 'Jigarrang' },
            { nameRu: 'Красно-коричневый', nameUz: 'Qizil-jigarrang' },
            { nameRu: 'Серый', nameUz: 'Kulrang' },
            { nameRu: 'Смешанный', nameUz: 'Aralash' },
          ],
        },
      ],
    },
    {
      nameRu: 'Мелкие домашние животные',
      nameUz: 'Mayda uy hayvonlari',
      children: [
        {
          nameRu: 'Собака',
          nameUz: 'It',
          breeds: [
            { nameRu: 'Чихуахуа', nameUz: 'Chihuahua' },
            { nameRu: 'Померанский шпиц', nameUz: 'Pomeranian' },
            { nameRu: 'Мальтийская болонка', nameUz: 'Maltese' },
            { nameRu: 'Ши-тцу', nameUz: 'Shih Tzu' },
            { nameRu: 'Пекинес', nameUz: 'Pekingese' },
            { nameRu: 'Лхаса апсо', nameUz: 'Lhasa Apso' },
            { nameRu: 'Йоркширский терьер', nameUz: 'Yorkshire Terrier' },
            { nameRu: 'Бишон фризе', nameUz: 'Bichon Frise' },
            { nameRu: 'Кавалер Кинг Чарльз', nameUz: 'Cavalier King Charles Spaniel' },
            { nameRu: 'Французский бульдог', nameUz: 'French Bulldog' },
            { nameRu: 'Бостон-терьер', nameUz: 'Boston Terrier' },
            { nameRu: 'Гаванская собака', nameUz: 'Havanese' },
            { nameRu: 'Той-пудель', nameUz: 'Toy Poodle' },
            { nameRu: 'Итальянская борзая', nameUz: 'Italian Greyhound' },
            { nameRu: 'Папийон', nameUz: 'Papillon' },
          ],
          colors: [
            { nameRu: 'Белый', nameUz: 'Oq' },
            { nameRu: 'Чёрный', nameUz: 'Qora' },
            { nameRu: 'Коричневый', nameUz: 'Jigarrang' },
            { nameRu: 'Рыжий', nameUz: 'Qizil' },
            { nameRu: 'Серый', nameUz: 'Kulrang' },
            { nameRu: 'Смешанный', nameUz: 'Aralash' },
            { nameRu: 'Жёлтоватый', nameUz: 'Sarg\'ish' },
            { nameRu: 'Бежевый', nameUz: 'Bej' },
          ],
        },
        {
          nameRu: 'Кошка',
          nameUz: 'Mushuk',
          breeds: [
            { nameRu: 'Персидская кошка', nameUz: 'Pers mushuk' },
            { nameRu: 'Сфинкс', nameUz: 'Sphinx' },
            { nameRu: 'Сиамская кошка', nameUz: 'Siamese' },
            { nameRu: 'Мейн-кун', nameUz: 'Maine Coon' },
            { nameRu: 'Британская короткошерстная', nameUz: 'British Shorthair' },
            { nameRu: 'Шотландская вислоухая', nameUz: 'Scottish Fold' },
            { nameRu: 'Рэгдолл', nameUz: 'Ragdoll' },
            { nameRu: 'Бенгальская кошка', nameUz: 'Bengal' },
            { nameRu: 'Абиссинская кошка', nameUz: 'Abyssinian' },
            { nameRu: 'Русская голубая', nameUz: 'Russian Blue' },
            { nameRu: 'Норвежская лесная', nameUz: 'Norwegian Forest Cat' },
            { nameRu: 'Восточная короткошерстная', nameUz: 'Oriental Shorthair' },
            { nameRu: 'Турецкая ангора', nameUz: 'Turkish Angora' },
            { nameRu: 'Бурманская кошка', nameUz: 'Burmese' },
            { nameRu: 'Корниш-рекс', nameUz: 'Cornish Rex' },
          ],
          colors: [
            { nameRu: 'Белый', nameUz: 'Oq' },
            { nameRu: 'Чёрный', nameUz: 'Qora' },
            { nameRu: 'Коричневый', nameUz: 'Jigarrang' },
            { nameRu: 'Серый', nameUz: 'Kulrang' },
            { nameRu: 'Рыжий', nameUz: 'Qizil' },
            { nameRu: 'Жёлтоватый', nameUz: 'Sarg\'ish' },
            { nameRu: 'Голубой', nameUz: 'Moviy' },
            { nameRu: 'Пёстрый', nameUz: 'Aralash' },
            { nameRu: 'Бежевый', nameUz: 'Bej' },
            { nameRu: 'Шоколадный', nameUz: 'Shokolad rang' },
            { nameRu: 'Линкс', nameUz: 'Lynx' },
            { nameRu: 'Табби', nameUz: 'Tabby' },
          ],
        },
      ],
    },
    {
      nameRu: 'Птицы',
      nameUz: 'Parrandalar',
      children: [],
      breeds: [
        { nameRu: 'Корниш', nameUz: 'Cornish' },
        { nameRu: 'Плимутрок', nameUz: 'Plymouth Rock' },
        { nameRu: 'Орпингтон', nameUz: 'Orpington' },
        { nameRu: 'Брама', nameUz: 'Brahma' },
        { nameRu: 'Сассекс', nameUz: 'Sussex' },
        { nameRu: 'Виандот', nameUz: 'Wyandotte' },
        { nameRu: 'Маран', nameUz: 'Maran' },
        { nameRu: 'Силки', nameUz: 'Silkie' },
        { nameRu: 'Польская', nameUz: 'Polish' },
        { nameRu: 'Бантам', nameUz: 'Bantam' },
        { nameRu: 'Себрайт', nameUz: 'Sebright' },
        { nameRu: 'Леггорн', nameUz: 'Leghorn' },
        { nameRu: 'Минорка', nameUz: 'Minorca' },
        { nameRu: 'Анкона', nameUz: 'Ancona' },
        { nameRu: 'Гамбург', nameUz: 'Hamburg' },
      ],
      colors: [
        { nameRu: 'Белый', nameUz: 'Oq' },
        { nameRu: 'Чёрный', nameUz: 'Qora' },
        { nameRu: 'Коричневый', nameUz: 'Jigarrang' },
        { nameRu: 'Красный', nameUz: 'Qizil' },
        { nameRu: 'Серый', nameUz: 'Kulrang' },
        { nameRu: 'Жёлтоватый', nameUz: 'Sarg\'ish' },
        { nameRu: 'Смешанный', nameUz: 'Aralash' },
      ],
    },
    {
      nameRu: 'Пчёлы',
      nameUz: 'Asalarilar',
      children: [],
      breeds: [
        { nameRu: 'Итальянская', nameUz: 'Italiyan' },
        { nameRu: 'Карниольская', nameUz: 'Carniolan' },
        { nameRu: 'Кавказская', nameUz: 'Kavkaz' },
        { nameRu: 'Евро-патагонская', nameUz: 'Yevro-patagonian' },
        { nameRu: 'Восточная', nameUz: 'Sharqiy' },
        { nameRu: 'Африканская', nameUz: 'Afrika' },
        { nameRu: 'Дикая тропическая', nameUz: 'Yovvoyi tropik' },
        { nameRu: 'Дикая малая', nameUz: 'Yovvoyi kichik' },
        { nameRu: 'Мини / местная', nameUz: 'Mini / mahalliy' },
      ],
      colors: [
        { nameRu: 'Жёлтый', nameUz: 'Sariq' },
        { nameRu: 'Красно-жёлтый', nameUz: 'Qizil-sariq' },
        { nameRu: 'Коричневый', nameUz: 'Jigarrang' },
        { nameRu: 'Чёрный', nameUz: 'Qora' },
        { nameRu: 'Жёлто-чёрный', nameUz: 'Sariq-qora chiziqli' },
        { nameRu: 'Золотистый', nameUz: 'Oltin rang' },
      ],
    },
  ];

  async function seedAnimalType(typeData: any, parentId: string | null = null) {
    const type = await prisma.animalType.upsert({
      where: { nameRu: typeData.nameRu },
      update: {},
      create: {
        nameRu: typeData.nameRu,
        nameUz: typeData.nameUz,
        parentId: parentId,
      },
    });

    if (typeData.breeds) {
      for (const breed of typeData.breeds) {
        await prisma.breed.create({
          data: {
            nameRu: breed.nameRu,
            nameUz: breed.nameUz,
            animals: { connect: [] },
          },
        });
      }
    }

    if (typeData.colors) {
      for (const color of typeData.colors) {
        await prisma.color.create({
          data: {
            nameRu: color.nameRu,
            nameUz: color.nameUz,
          },
        });
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
  const diseaseCategories = [
    {
      nameRu: 'Болезни пищеварительной системы',
      nameUz: 'Hazm qilish tizimi kasalliklari',
      diseases: [
        { nameRu: 'Стоматит', nameUz: 'Stomatit' },
        { nameRu: 'Фарингит', nameUz: 'Faringit' },
        { nameRu: 'Гипотония преджелудков', nameUz: 'Oshqozon Oldi gipotoniyasi' },
        { nameRu: 'Атония преджелудков', nameUz: 'Oshqozon Oldi atoniyasi' },
        { nameRu: 'Парез рубца', nameUz: 'Rubets parezi' },
        { nameRu: 'Ацидоз', nameUz: 'Atsidoz' },
        { nameRu: 'Алкалоз', nameUz: 'Alkaloz' },
        { nameRu: 'Тимпания', nameUz: 'Timpaniya' },
        { nameRu: 'Паракератоз', nameUz: 'Parakeratoz' },
        { nameRu: 'Травматический ретикулит', nameUz: 'Travmatik retikulit' },
        { nameRu: 'Ретикулоперитонит', nameUz: 'Retikuloperitonit' },
        { nameRu: 'Гастрит', nameUz: 'Gastrit' },
        { nameRu: 'Язва желудка', nameUz: 'Oshqozon yarasi' },
        { nameRu: 'Гастроэнтерит', nameUz: 'Gastroenterit' },
        { nameRu: 'Энтероколит', nameUz: 'Enterokolit' },
        { nameRu: 'Метеоризм кишечника', nameUz: 'Ichak meteorismi' },
      ],
    },
    {
      nameRu: 'Болезни мочевыделительной системы',
      nameUz: 'Siydik chiqarish tizimi kasalliklari',
      diseases: [
        { nameRu: 'Нефрит', nameUz: 'Nefrit' },
        { nameRu: 'Нефроз', nameUz: 'Nefroz' },
        { nameRu: 'Нефросклероз', nameUz: 'Nefroskleroz' },
        { nameRu: 'Пиелонефрит', nameUz: 'Pielonefrit' },
        { nameRu: 'Уроцистит', nameUz: 'Urotsistit' },
        { nameRu: 'Мочекаменная болезнь', nameUz: 'Buyrak tosh kasalligi' },
        { nameRu: 'Хроническая гематурия', nameUz: 'Xronik gematuriya' },
      ],
    },
  ];

  for (const category of diseaseCategories) {
    await prisma.diseaseCategory.create({
      data: {
        nameRu: category.nameRu,
        nameUz: category.nameUz,
        diseases: {
          create: category.diseases.map((d) => ({
            nameRu: d.nameRu,
            nameUz: d.nameUz,
          })),
        },
      },
    });
  }
  console.log('Diseases seeded.');

  // --- 5. Prophylaxis (Vaccines & Deworming) ---
  const vaccines = [
    { nameRu: 'Вакцина против бруцеллёза', nameUz: 'Brucella vaksina' },
    { nameRu: 'Вакцина против пастереллёза', nameUz: 'Pasteurella vaksina' },
  ];

  const vaccineStrains = [
    'S19', 'P52', 'Oregon C24V', 'Nigeria 75/1', 'A, B, C', 'K88, K99', 'Typhimurium', 'S-6',
  ];

  for (const v of vaccines) {
    await prisma.prophylaxisItem.create({
      data: {
        nameRu: v.nameRu,
        nameUz: v.nameUz,
        type: ProphylaxisType.VACCINE,
        details: {
          create: vaccineStrains.map((s) => ({ nameRu: s, nameUz: s })),
        },
      },
    });
  }

  // --- 6. Reference Data (Urine, Feces, Mucosa) ---
  const findType = async (name: string) =>
    prisma.animalType.findUnique({ where: { nameRu: name } });

  const targetTypes = [
    { name: 'Крупный рогатый скот' },
    { name: 'Мелкий рогатый скот' },
    { name: 'Лошади' },
    { name: 'Свиньи' },
  ];

  const urineColorsData = [
    // Cattle
    [
      { ru: 'Тёмно-жёлтый', uz: 'To\'q sariq', numericValue: 0 },
      { ru: 'Жёлтый', uz: 'Sariq', numericValue: 1 },
      { ru: 'Светло-жёлтый', uz: 'Och sariq', numericValue: 2 },
      { ru: 'Коричневый', uz: 'Jigarrang', numericValue: 3 },
      { ru: 'Красный', uz: 'Qizil', numericValue: 4 },
      { ru: 'Почти чёрный', uz: 'Qoramtir', numericValue: 5 },
      { ru: 'Молочный', uz: 'Sut rang', numericValue: 6 },
    ],
    // Small Cattle
    [
      { ru: 'Тёмно-жёлтый', uz: 'To\'q sariq', numericValue: 0 },
      { ru: 'Красный', uz: 'Qizil', numericValue: 1 },
      { ru: 'Розовый', uz: 'Pushti', numericValue: 2 },
      { ru: 'Коричневый', uz: 'Jigarrang', numericValue: 3 },
    ],
    // Horses
    [
      { ru: 'Тёмно-жёлтый', uz: 'To\'q sariq', numericValue: 0 },
      { ru: 'Коричневый', uz: 'Jigarrang', numericValue: 1 },
      { ru: 'Красный', uz: 'Qizil', numericValue: 2 },
      { ru: 'Молочного цвета', uz: 'Sut rang', numericValue: 3 },
    ],
    // Pigs
    [
      { ru: 'Светло-жёлтый', uz: 'Och sariq', numericValue: 0 },
      { ru: 'Коричневый', uz: 'Jigarrang', numericValue: 1 },
      { ru: 'Красный', uz: 'Qizil', numericValue: 2 },
      { ru: 'Молочный', uz: 'Sut rang', numericValue: 3 },
    ],
  ];

  for (let i = 0; i < targetTypes.length; i++) {
    const type = await findType(targetTypes[i].name);
    if (type && urineColorsData[i]) {
      for (const color of urineColorsData[i]) {
        await prisma.urineColor.create({
          data: {
            nameRu: color.ru,
            nameUz: color.uz,
            numericValue: color.numericValue,
            animalTypeId: type.id,
          },
        });
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

import { PrismaClient, ProphylaxisType, UserRole, UserGender } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- 0. Clinical Exam Lookup Tables (former Prisma enums) ---

  const bodyTypes = [
    { name_ru: 'Кучли жуссали', name_uz: 'Kuchli jussali', numericValue: 0 },       // STRONG
    { name_ru: 'Ўртача жуссали', name_uz: "O'rtacha jussali", numericValue: 1 },     // MEDIUM
    { name_ru: 'Кучсиз жуссали', name_uz: 'Kuchsiz jussali', numericValue: 2 },      // WEAK
  ];
  for (const item of bodyTypes) {
    await prisma.bodyType.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const obesityTypes = [
    { name_ru: 'Яхши, юқори семиз', name_uz: 'Yaxshi, yuqori semiz', numericValue: 0 },  // HIGH
    { name_ru: 'Ўртача семиз', name_uz: "O'rtacha semiz", numericValue: 1 },               // MEDIUM
    { name_ru: 'Ўртадан паст семиз', name_uz: "O'rtadan past semiz", numericValue: 2 },    // LOW
    { name_ru: 'Кахексия', name_uz: 'Kaxeksiya', numericValue: 3 },                        // CACHEXIA
  ];
  for (const item of obesityTypes) {
    await prisma.obesityType.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const bodyPositions = [
    { name_ru: 'Табиий', name_uz: 'Tabiiy', numericValue: 0 },                                          // NATURAL
    { name_ru: 'Мажбурий тик турган', name_uz: 'Majburiy tik turgan', numericValue: 1 },                // FORCED_STANDING
    { name_ru: 'Мажбурий ётган', name_uz: 'Majburiy yotgan', numericValue: 2 },                         // FORCED_LYING
    { name_ru: 'Мажбурий ўтирган', name_uz: "Majburiy o'tirgan", numericValue: 3 },                     // FORCED_SITTING
    { name_ru: 'Табиий бўлмаган холат', name_uz: "Tabiiy bo'lmagan holat", numericValue: 4 },           // NON_THERAPEUTIC
    { name_ru: 'Ихтиёрсиз ҳаракатлар', name_uz: 'Ixtiyorsiz harakatlar', numericValue: 5 },             // INVOLUNTARY
    { name_ru: 'Монежли ҳаракат', name_uz: 'Monejli harakat', numericValue: 6 },                        // MANEGE
    { name_ru: 'Айланма ҳаракат', name_uz: 'Aylanma harakat', numericValue: 7 },                        // CIRCULAR
    { name_ru: 'Олдинга қараб ҳаракат', name_uz: 'Oldinga qarab harakat', numericValue: 8 },            // FORWARD
    { name_ru: 'Орқага қараб ҳаракат', name_uz: 'Orqaga qarab harakat', numericValue: 9 },              // BACKWARD
    { name_ru: 'Ағанаб ётган жойдаги ҳаракат', name_uz: "Ag'anab yotgan joyidagi harakat", numericValue: 10 }, // ROLLING
  ];
  for (const item of bodyPositions) {
    await prisma.bodyPosition.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const constitutions = [
    { name_ru: 'Юмшоқ', name_uz: 'Yumshoq', numericValue: 0 },           // LOOSE
    { name_ru: 'Мустаҳкам', name_uz: "Mustahkam", numericValue: 1 },       // DENSE
    { name_ru: 'Отларда', name_uz: 'Otlarda', numericValue: 2 },           // HORSES
    { name_ru: 'Паррандаларда', name_uz: 'Parranda', numericValue: 3 },    // BIRDS
  ];
  for (const item of constitutions) {
    await prisma.constitution.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const temperaments = [
    { name_ru: 'Меланхолик', name_uz: 'Melanxolik', numericValue: 0 },    // MELANCHOLIC
    { name_ru: 'Флегматик', name_uz: 'Flegmatik', numericValue: 1 },       // PHLEGMATIC
  ];
  for (const item of temperaments) {
    await prisma.temperament.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const woolTypes = [
    { name_ru: 'Бир текис', name_uz: 'Bir tekis', numericValue: 0 },                                          // EVEN
    { name_ru: 'Бир текис эмас', name_uz: 'Bir tekis emas', numericValue: 1 },                                // UNEVEN
    { name_ru: 'Терига ётиб туради', name_uz: 'Teriga yotib turadi', numericValue: 2 },                       // LYING_FLAT
    { name_ru: 'Ялтироқ', name_uz: 'Yaltiroq', numericValue: 3 },                                             // SHINY
    { name_ru: 'Хира', name_uz: 'Xira', numericValue: 4 },                                                    // MATTE
    { name_ru: 'Тушмайди', name_uz: 'Tushmaydi', numericValue: 5 },                                           // NOT_FALLING
    { name_ru: 'Ҳурпайган', name_uz: 'Hurpaygan', numericValue: 6 },                                          // DISHEVELED
    { name_ru: 'Бир-бирига ёпишган', name_uz: 'Bir-biriga yopishgan', numericValue: 7 },                      // MATTED
    { name_ru: 'Теринг айрим жойларида жунлар тушган', name_uz: 'Terining ayrim joylarida junlar tushgan', numericValue: 8 }, // BALD_PATCHES
    { name_ru: 'Қалин', name_uz: 'Qalin', numericValue: 9 },                                                  // THICK
    { name_ru: 'Сийрак', name_uz: 'Siyrak', numericValue: 10 },                                               // SPARSE
    { name_ru: 'Физиологик тулаш', name_uz: 'Fiziologik tullash', numericValue: 11 },                         // PHYSIOLOGICAL_MOLT
    { name_ru: 'Патологик тулаш', name_uz: 'Patologik tullash', numericValue: 12 },                           // PATHOLOGICAL_MOLT
    { name_ru: 'Жун тушаяпти', name_uz: 'Jun tushayapti', numericValue: 13 },                                 // FALLING
    { name_ru: 'Жун тушмаяпти', name_uz: 'Jun tushmayapti', numericValue: 14 },                               // NOT_FALLING_OUT
  ];
  for (const item of woolTypes) {
    await prisma.woolType.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const downTypes = [
    { name_ru: 'Зич', name_uz: 'Zich', numericValue: 0 },               // DENSE
    { name_ru: 'Сийрак', name_uz: 'Siyrak', numericValue: 1 },          // SPARSE
    { name_ru: 'Йўқ', name_uz: "Yo'q", numericValue: 2 },               // NONE
    { name_ru: 'Юмшоқ', name_uz: 'Yumshoq', numericValue: 3 },          // SOFT
    { name_ru: 'Силлиқ', name_uz: 'Silliq', numericValue: 4 },          // SMOOTH
    { name_ru: 'Хира', name_uz: 'Xira', numericValue: 5 },              // MATTE
    { name_ru: 'Ялтироқ', name_uz: 'Yaltiroq', numericValue: 6 },       // SHINY
    { name_ru: 'Қуруқ', name_uz: 'Quruq', numericValue: 7 },            // DRY
    { name_ru: 'Чанг босган', name_uz: 'Chang bosgan', numericValue: 8 }, // DUSTY
    { name_ru: 'Бир текис', name_uz: 'Bir tekis', numericValue: 9 },    // EVEN
    { name_ru: 'Оқ рангли', name_uz: 'Oq rangli', numericValue: 10 },   // WHITE
    { name_ru: 'Кулранг', name_uz: 'Kulrang', numericValue: 11 },       // GRAY
    { name_ru: 'Сарғайган', name_uz: "Sarg'aygan", numericValue: 12 },  // YELLOWISH
    { name_ru: 'Қорамтир', name_uz: 'Qoramtir', numericValue: 13 },     // DARK
    { name_ru: 'Нам', name_uz: 'Nam', numericValue: 14 },               // MOIST
  ];
  for (const item of downTypes) {
    await prisma.downType.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const hairTypes = [
    { name_ru: 'Дағал', name_uz: "Dag'al", numericValue: 0 },           // COARSE
    { name_ru: 'Сийрак', name_uz: 'Siyrak', numericValue: 1 },          // SPARSE
  ];
  for (const item of hairTypes) {
    await prisma.hairType.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const featherTypes = [
    { name_ru: 'Ялтироқ', name_uz: 'Yaltiroq', numericValue: 0 },      // SHINY
    { name_ru: 'Хира', name_uz: 'Xira', numericValue: 1 },              // MATTE
    { name_ru: 'Тўлиқ', name_uz: "To'liq", numericValue: 2 },           // FULL
    { name_ru: 'Тўкилган', name_uz: "To'kilgan", numericValue: 3 },     // FALLEN
    { name_ru: 'Синиқ', name_uz: 'Siniq', numericValue: 4 },            // BROKEN
  ];
  for (const item of featherTypes) {
    await prisma.featherType.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const skinColors = [
    { name_ru: 'Оч бинафша', name_uz: 'Och binafsha', numericValue: 0 }, // PALE_VIOLET
    { name_ru: 'Оқарган', name_uz: 'Oqargan', numericValue: 1 },          // PALE
    { name_ru: 'Қизарган', name_uz: 'Qizargan', numericValue: 2 },        // RED
    { name_ru: 'Кўкарган', name_uz: "Ko'kargan", numericValue: 3 },       // BLUE
    { name_ru: 'Сарғайган', name_uz: "Sarg'aygan", numericValue: 4 },     // YELLOW
  ];
  for (const item of skinColors) {
    await prisma.skinColor.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const skinHumidities = [
    { name_ru: 'Ўртача нам', name_uz: "O'rtacha nam", numericValue: 0 },    // MODERATE
    { name_ru: 'Гипергидроз', name_uz: 'Gipergidroz', numericValue: 1 },     // HYPERHIDROSIS
    { name_ru: 'Маҳаллий терлаган', name_uz: 'Mahalliy terlagan', numericValue: 2 }, // LOCAL_SWEAT
    { name_ru: 'Қуруқ — ангидоз', name_uz: 'Quruq – angidoz', numericValue: 3 }, // DRY
  ];
  for (const item of skinHumidities) {
    await prisma.skinHumidity.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const skinTemps = [
    { name_ru: 'Тери ҳарорати умумий кўтарилган', name_uz: "Teri harorati umumiy ko'tarilgan", numericValue: 0 }, // GENERAL_HIGH
    { name_ru: 'Тери ҳарорати маҳаллий кўтарилган', name_uz: "Teri harorati mahalliy ko'tarilgan", numericValue: 1 }, // LOCAL_HIGH
    { name_ru: 'Тери ҳарорати умумий пасайган', name_uz: 'Teri harorati umumiy pasaygan', numericValue: 2 },           // GENERAL_LOW
    { name_ru: 'Тери ҳарорати маҳаллий пасайган', name_uz: 'Teri harorati mahalliy pasaygan', numericValue: 3 },       // LOCAL_LOW
    { name_ru: 'Тери ҳарорати ҳар хил', name_uz: 'Teri harorati har xil', numericValue: 4 },                          // UNEVEN
  ];
  for (const item of skinTemps) {
    await prisma.skinTemp.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const skinElasticities = [
    { name_ru: 'Эластик', name_uz: 'Elastik', numericValue: 0 },                                          // ELASTIC
    { name_ru: 'Тери эластиклиги камайган', name_uz: 'Teri elastikgi kamaygan', numericValue: 1 },         // REDUCED
    { name_ru: 'Тери эластиклиги умуман йўқ', name_uz: "Teri elastikligi umuman yo'q", numericValue: 2 }, // NONE
  ];
  for (const item of skinElasticities) {
    await prisma.skinElasticity.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const lymphSizes = [
    { name_ru: 'Катталмаган', name_uz: 'Kattarmagan', numericValue: 0 }, // NORMAL
    { name_ru: 'Катталган', name_uz: 'Kattargan', numericValue: 1 },     // ENLARGED
  ];
  for (const item of lymphSizes) {
    await prisma.lymphSize.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const lymphShapes = [
    { name_ru: 'Ясси', name_uz: 'Yassi', numericValue: 0 },      // FLAT
    { name_ru: 'Думалоқ', name_uz: 'Dumaloq', numericValue: 1 }, // ROUND
    { name_ru: 'Катталган', name_uz: 'Kattargan', numericValue: 2 }, // ENLARGED
    { name_ru: 'Шишган', name_uz: 'Shishgan', numericValue: 3 },  // SWOLLEN
  ];
  for (const item of lymphShapes) {
    await prisma.lymphShape.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const lymphSurfaces = [
    { name_ru: 'Силлиқ', name_uz: 'Silliq', numericValue: 0 },           // SMOOTH
    { name_ru: 'Ғадир-будир', name_uz: "G'adir-budir", numericValue: 1 }, // ROUGH
  ];
  for (const item of lymphSurfaces) {
    await prisma.lymphSurface.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const lymphConsistencies = [
    { name_ru: 'Зич', name_uz: 'Zich', numericValue: 0 },               // DENSE
    { name_ru: 'Билқиллаган', name_uz: 'Bilqillagan', numericValue: 1 }, // SOFT
    { name_ru: 'Ўзига хос', name_uz: "O'ziga xos", numericValue: 2 },   // SPECIFIC
  ];
  for (const item of lymphConsistencies) {
    await prisma.lymphConsistency.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const lymphTemps = [
    { name_ru: 'Ўртача', name_uz: "O'rtacha", numericValue: 0 }, // NORMAL
    { name_ru: 'Ошган', name_uz: 'Oshgan', numericValue: 1 },    // ELEVATED
  ];
  for (const item of lymphTemps) {
    await prisma.lymphTemp.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const lymphPains = [
    { name_ru: 'Оғриқсиз', name_uz: "Og'riqsiz", numericValue: 0 }, // PAINLESS
    { name_ru: 'Оғриқли', name_uz: "Og'riqli", numericValue: 1 },    // PAINFUL
  ];
  for (const item of lymphPains) {
    await prisma.lymphPain.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const lymphMobilities = [
    { name_ru: 'Ҳаракатчан', name_uz: 'Harakatchan', numericValue: 0 },         // MOBILE
    { name_ru: 'Кам ҳаракатчан', name_uz: 'Kam harakatchan', numericValue: 1 }, // LOW_MOBILITY
  ];
  for (const item of lymphMobilities) {
    await prisma.lymphMobility.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const mucosaTypes = [
    { name_ru: 'Оғиз', name_uz: "Og'iz", numericValue: 0 },               // ORAL
    { name_ru: 'Бурун', name_uz: 'Burun', numericValue: 1 },               // NASAL
    { name_ru: 'Кўз', name_uz: "Ko'z", numericValue: 2 },                  // OCULAR
    { name_ru: 'Репродуктив', name_uz: 'Reproduktiv organ', numericValue: 3 }, // REPRODUCTIVE
  ];
  for (const item of mucosaTypes) {
    await prisma.mucosaType.upsert({
      where: { numericValue: item.numericValue },
      update: {},
      create: item,
    });
  }

  const animalSexes = [
    { name_ru: 'Эркак', name_uz: 'Erkak', numericValue: 0 },                                        // MALE
    { name_ru: 'Аёл', name_uz: 'Ayol', numericValue: 1 },                                           // FEMALE
    { name_ru: 'Кастрация қилинган эркак', name_uz: 'Kastratsiya qilingan erkak', numericValue: 2 }, // NEUTERED
    { name_ru: 'Стерилизация қилинган аёл', name_uz: 'Sterilizatsiya qilingan ayol', numericValue: 3 }, // SPAYED
    { name_ru: "Номаълум", name_uz: "Noma'lum", numericValue: 4 },                                   // UNKNOWN
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
      where: { name_ru: region.name },
      update: {},
      create: {
        name_ru: region.name,
        name_uz: region.name,
        districts: {
          create: region.districts.map((d) => ({ name_ru: d, name_uz: d })),
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
      name_ru: 'Сельскохозяйственные животные',
      name_uz: "Qishloq xo'jalik hayvonlari",
      children: [
        {
          name_ru: 'Крупный рогатый скот',
          name_uz: 'Qoramol',
          children: [],
          breeds: [
            { name_ru: 'Голштинская порода', name_uz: 'Holstein' },
            { name_ru: 'Эрширская порода', name_uz: 'Ayrshire' },
            { name_ru: 'Джерсейская порода', name_uz: 'Jersey' },
            { name_ru: 'Гернсейская порода', name_uz: 'Guernsey' },
            { name_ru: 'Браун швиц', name_uz: 'Brown Swiss' },
            { name_ru: 'Симментальская порода', name_uz: 'Simmental' },
            { name_ru: 'Герефордская порода', name_uz: 'Hereford' },
            { name_ru: 'Ангусская порода', name_uz: 'Angus' },
            { name_ru: 'Лимузинская порода', name_uz: 'Limousin' },
            { name_ru: 'Шаролезская порода', name_uz: 'Charolais' },
            { name_ru: 'Брахманская порода', name_uz: 'Brahman' },
            { name_ru: 'Ред Синдхи', name_uz: 'Red Sindhi' },
            { name_ru: 'Харианская порода', name_uz: 'Hariana' },
            { name_ru: 'Холмогорская порода', name_uz: 'Kholmogor' },
            { name_ru: 'Ярославская порода', name_uz: 'Yaroslavl' },
          ],
          colors: [
            { name_ru: 'Белый', name_uz: 'Oq' },
            { name_ru: 'Черный', name_uz: 'Qora' },
            { name_ru: 'Пестрый', name_uz: 'Ola-bula' },
            { name_ru: 'Рыжеватый', name_uz: "Qizg'ish" },
            { name_ru: 'Серый', name_uz: 'Sur' },
            { name_ru: 'Серо-бурый', name_uz: 'Kulrang' },
            { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
          ],
        },
        {
          name_ru: 'Мелкий рогатый скот',
          name_uz: 'Mayda shoxli hayvonlar',
          children: [
            {
              name_ru: 'Овца',
              name_uz: "Qo'y",
              breeds: [
                { name_ru: 'Меринос', name_uz: 'Merinos' },
                { name_ru: 'Каракульская порода', name_uz: 'Karakul' },
                { name_ru: 'Романовская порода', name_uz: 'Romanov' },
                { name_ru: 'Гиссарская порода', name_uz: 'Gissar' },
                { name_ru: 'Эдильбаевская порода', name_uz: 'Edilbay' },
                { name_ru: 'Дорсет', name_uz: 'Dorset' },
                { name_ru: 'Саффолк', name_uz: 'Suffolk' },
                { name_ru: 'Авасси', name_uz: 'Awassi' },
                { name_ru: 'Тексель', name_uz: 'Texel' },
                { name_ru: 'Гемпшир', name_uz: 'Hampshire' },
                { name_ru: 'Валахская порода', name_uz: 'Valaxiya' },
                { name_ru: 'Карабахская порода', name_uz: 'Karabakh' },
                { name_ru: 'Шевиот', name_uz: 'Cheviot' },
                { name_ru: 'Дорпер', name_uz: 'Dorper' },
              ],
              colors: [
                { name_ru: 'Белый', name_uz: 'Oq' },
                { name_ru: 'Чёрный', name_uz: 'Qora' },
                { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
                { name_ru: 'Серый', name_uz: 'Kulrang' },
                { name_ru: 'Жёлтый', name_uz: 'Sariq' },
                { name_ru: 'Тёмный', name_uz: 'Qoramtir' },
                { name_ru: 'Белый с чёрным', name_uz: 'Oq-qora' },
                { name_ru: 'Коричнево-чёрный', name_uz: 'Jigarrang-qora' },
                { name_ru: 'Серо-чёрный', name_uz: 'Kulrang-qora' },
                { name_ru: 'Жёлто-коричневый', name_uz: 'Sariq-jigarrang' },
              ],
            },
            {
              name_ru: 'Коза',
              name_uz: 'Echki',
              breeds: [
                { name_ru: 'Зааненская порода', name_uz: 'Zaanen' },
                { name_ru: 'Тоггенбургская порода', name_uz: 'Toggenburg' },
                { name_ru: 'Альпийская порода', name_uz: 'Alpin' },
                { name_ru: 'Нубийская порода', name_uz: 'Nubian' },
                { name_ru: 'Ла-Манча', name_uz: 'La-Mancha' },
                { name_ru: 'Бурская порода', name_uz: 'Boer' },
                { name_ru: 'Кико', name_uz: 'Kiko' },
                { name_ru: 'Испанская порода', name_uz: 'Spanish' },
                { name_ru: 'Ангорская коза', name_uz: 'Angora' },
                { name_ru: 'Кашмирская коза', name_uz: 'Kashmir' },
                { name_ru: 'Узбекская чёрная коза', name_uz: 'O\'zbekiston qora echkisi' },
                { name_ru: 'Узбекская пуховая коза', name_uz: 'O\'zbekiston mo\'ynali echkisi' },
                { name_ru: 'Киргизская горная коза', name_uz: 'Qirg\'iz tog\' echkisi' },
                { name_ru: 'Таджикская горная коза', name_uz: 'Tojik tog\' echkisi' },
                { name_ru: 'Сирийская коза', name_uz: 'Suriyalik echki' },
                { name_ru: 'Мархур', name_uz: 'Markhor' },
                { name_ru: 'Битальская порода', name_uz: 'Beetal' },
                { name_ru: 'Джамнапари', name_uz: 'Jamnapari' },
                { name_ru: 'Сирохийская порода', name_uz: 'Sirohi' },
                { name_ru: 'Барбарийская порода', name_uz: 'Barbari' },
              ],
              colors: [
                { name_ru: 'Белый', name_uz: 'Oq' },
                { name_ru: 'Чёрный', name_uz: 'Qora' },
                { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
                { name_ru: 'Серый', name_uz: 'Kulrang' },
                { name_ru: 'Красновато-коричневый', name_uz: 'Qizg\'ish-jigarrang' },
                { name_ru: 'Белый с чёрным', name_uz: 'Oq-qora' },
                { name_ru: 'Золотистый', name_uz: 'Oltin' },
                { name_ru: 'Пепельный', name_uz: 'Bo\'r rang' },
              ],
            },
          ],
        },
        {
          name_ru: 'Верблюды',
          name_uz: 'Tuyalar',
          children: [
            {
              name_ru: 'Одногорбый',
              name_uz: 'Bir o`rkachli',
              breeds: [
                { name_ru: 'Афганская порода', name_uz: 'Afg\'on tuya zoti' },
                { name_ru: 'Арабская порода', name_uz: 'Arab tuya zoti' },
                { name_ru: 'Сомалийская порода', name_uz: 'Somali tuya zoti' },
                { name_ru: 'Индийская порода', name_uz: 'Hind tuya zoti' },
                { name_ru: 'Пакистанская порода', name_uz: 'Pokiston tuya zoti' },
                { name_ru: 'Суданская порода', name_uz: 'Sudan tuya zoti' },
                { name_ru: 'Иранская порода', name_uz: 'Eron tuya zoti' },
                { name_ru: 'Туркменская порода', name_uz: 'Turkman tuya zoti' },
                { name_ru: 'Белуджистанская порода', name_uz: 'Balujiston tuya zoti' },
                { name_ru: 'Магрибская порода', name_uz: 'Mag\'rib tuya zoti' },
              ],
              colors: [
                { name_ru: 'Белый', name_uz: 'Oq' },
                { name_ru: 'Желтоватый', name_uz: 'Sarg\'ish' },
                { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
                { name_ru: 'Красноватый', name_uz: 'Qizg\'ish' },
                { name_ru: 'Чёрный', name_uz: 'Qora' },
                { name_ru: 'Серый', name_uz: 'Kulrang' },
                { name_ru: 'Бурый', name_uz: 'Qo\'ng\'ir' },
              ],
            },
            {
              name_ru: 'Двугорбые',
              name_uz: 'Ikki o`rkachli',
              breeds: [
                { name_ru: 'Казахстанская порода', name_uz: 'Qozog\'iston tuya zoti' },
                { name_ru: 'Монгольская порода', name_uz: 'Mongol tuya zoti' },
                { name_ru: 'Иранская порода', name_uz: 'Eron tuya zoti' },
                { name_ru: 'Китайская порода', name_uz: 'Xitoy tuya zoti' },
                { name_ru: 'Туркменская порода', name_uz: 'Turkman tuya zoti' },
                { name_ru: 'Узбекская порода', name_uz: 'O\'zbekiston tuya zoti' },
                { name_ru: 'Каракалпакская порода', name_uz: 'Qoraqalpoq tuya zoti' },
              ],
              colors: [
                { name_ru: 'Белый', name_uz: 'Oq' },
                { name_ru: 'Желтоватый', name_uz: 'Sarg\'ish' },
                { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
                { name_ru: 'Красноватый', name_uz: 'Qizg\'ish' },
                { name_ru: 'Чёрный', name_uz: 'Qora' },
                { name_ru: 'Серый', name_uz: 'Kulrang' },
                { name_ru: 'Бурый', name_uz: 'Qo\'ng\'ir' },
              ],
            },
          ],
        },
        {
          name_ru: 'Лошади',
          name_uz: 'Otlar',
          children: [],
          breeds: [
            { name_ru: 'Арабская лошадь', name_uz: 'Arab oti' },
            { name_ru: 'Английская скаковая', name_uz: 'Ingliz chopard oti' },
            { name_ru: 'Орловский рысак', name_uz: 'Orlov yo\'rg\'asi' },
            { name_ru: 'Донская лошадь', name_uz: 'Don oti' },
            { name_ru: 'Казахстанская лошадь', name_uz: 'Qozog\'iston oti' },
            { name_ru: 'Карабаирская лошадь', name_uz: 'Qorabair oti' },
            { name_ru: 'Ахалтекинская лошадь', name_uz: 'Achal-tekinskiy oti' },
            { name_ru: 'Будённовская лошадь', name_uz: 'Budennovsk oti' },
            { name_ru: 'Кабардинская лошадь', name_uz: 'Kabardin oti' },
            { name_ru: 'Киргизская лошадь', name_uz: 'Qirg\'iz oti' },
            { name_ru: 'Узбекская лошадь', name_uz: 'O\'zbek oti' },
            { name_ru: 'Монгольская лошадь', name_uz: 'Mo\'g\'ul oti' },
            { name_ru: 'Фризская лошадь', name_uz: 'Friz oti' },
            { name_ru: 'Шетландский пони', name_uz: 'Shetland poni' },
            { name_ru: 'Гафлингер', name_uz: 'Haflinger' },
            { name_ru: 'Першерон', name_uz: 'Percheron' },
            { name_ru: 'Арденская лошадь', name_uz: 'Arden oti' },
            { name_ru: 'Торийская лошадь', name_uz: 'Tori oti' },
            { name_ru: 'Тракененская лошадь', name_uz: 'Trakenen oti' },
            { name_ru: 'Липицанская лошадь', name_uz: 'Lipitsian oti' },
          ],
          colors: [
            { name_ru: 'Чёрный', name_uz: 'Qora' },
            { name_ru: 'Белый', name_uz: 'Oq' },
            { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
            { name_ru: 'Красновато-коричневый', name_uz: 'Qizg\'ish-jigarrang' },
            { name_ru: 'Серый', name_uz: 'Kulrang' },
            { name_ru: 'Пепельный', name_uz: 'Bo\'r rang' },
            { name_ru: 'Желтоватый', name_uz: 'Sarg\'ish' },
            { name_ru: 'Бурый', name_uz: 'Qo\'ng\'ir' },
            { name_ru: 'Алазан', name_uz: 'Alazan' },
            { name_ru: 'Буланый', name_uz: 'Bulan' },
          ],
        },
        {
          name_ru: 'Ослы',
          name_uz: 'Eshaklar',
          children: [],
          breeds: [
            { name_ru: 'Узбекский осёл', name_uz: 'O\'zbekiston eshagi' },
            { name_ru: 'Каракалпакский осёл', name_uz: 'Qoraqalpoq eshagi' },
            { name_ru: 'Туркменский осёл', name_uz: 'Turkman eshagi' },
            { name_ru: 'Таджикский осёл', name_uz: 'Tojik eshagi' },
            { name_ru: 'Киргизский осёл', name_uz: 'Qirg\'iz eshagi' },
            { name_ru: 'Китайский осёл', name_uz: 'Xitoy eshagi' },
            { name_ru: 'Сомалийский осёл', name_uz: 'Somali eshagi' },
            { name_ru: 'Нубийский осёл', name_uz: 'Nubian eshagi' },
            { name_ru: 'Андалузский осёл', name_uz: 'Andalusiya eshagi' },
            { name_ru: 'Каталонский осёл', name_uz: 'Kataloniya eshagi' },
            { name_ru: 'Пуату осёл', name_uz: 'Poitou eshagi' },
            { name_ru: 'Американский мини-осёл', name_uz: 'Amerika mini eshagi' },
          ],
          colors: [
            { name_ru: 'Белый', name_uz: 'Oq' },
            { name_ru: 'Чёрный', name_uz: 'Qora' },
            { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
            { name_ru: 'Серый', name_uz: 'Kulrang' },
            { name_ru: 'Желтоватый', name_uz: 'Sarg\'ish' },
            { name_ru: 'Бурый', name_uz: 'Qo\'ng\'ir' },
            { name_ru: 'Красновато-коричневый', name_uz: 'Qizg\'ish-jigarrang' },
            { name_ru: 'Белый с коричневым', name_uz: 'Oq-jigarrang aralash' },
          ],
        },
        {
          name_ru: 'Зебры',
          name_uz: 'Zebralar',
          children: [],
          breeds: [
            { name_ru: 'Равнинная зебра', name_uz: 'Tekislik zebrasi' },
            { name_ru: 'Зебра Греви', name_uz: 'Grevi zebrasi' },
            { name_ru: 'Горная зебра', name_uz: 'Tog\' zebrasi' },
            { name_ru: 'Зебра Гранта', name_uz: 'Grant zebrasi' },
            { name_ru: 'Зебра Чапмана', name_uz: 'Chapman zebrasi' },
            { name_ru: 'Горная зебра Хартмана', name_uz: 'Hartmann tog\' zebrasi' },
          ],
          colors: [
            { name_ru: 'Белый с чёрным', name_uz: 'Oq-qora' },
            { name_ru: 'Белый с коричневым', name_uz: 'Oq-jigarrang' },
            { name_ru: 'Чёрный с коричневым', name_uz: 'Qora-jigarrang' },
            { name_ru: 'Белый с серым', name_uz: 'Oq-kulrang' },
            { name_ru: 'Белый с желтоватым', name_uz: 'Oq-sarg\'ish' },
          ],
        },
        {
          name_ru: 'Свиньи',
          name_uz: "Cho'chqalar",
          children: [],
          breeds: [
            { name_ru: 'Узбекская свинья', name_uz: 'O\'zbekiston cho\'chqasi' },
            { name_ru: 'Крупная белая свинья', name_uz: 'Katta oq cho\'chqa' },
            { name_ru: 'Ландрас', name_uz: 'Landras' },
            { name_ru: 'Дюрок', name_uz: 'Durok' },
            { name_ru: 'Гемпшир', name_uz: 'Hampshire' },
            { name_ru: 'Йоркшир', name_uz: 'Yorshir' },
            { name_ru: 'Беркшир', name_uz: 'Berkshir' },
            { name_ru: 'Эстонский бекон', name_uz: 'Estoniya bekoni' },
            { name_ru: 'Латвийская белая свинья', name_uz: 'Latviya oq cho\'chqasi' },
            { name_ru: 'Украинская порода', name_uz: 'Ukrainaning cho\'chqa zoti' },
            { name_ru: 'Белорусская белая', name_uz: 'Belorus oq cho\'chqasi' },
            { name_ru: 'Вьетнамская вислобрюхая', name_uz: 'Vyetnam vislobryux cho\'chqasi' },
            { name_ru: 'Пьетрен', name_uz: 'Pietren' },
            { name_ru: 'Тамворт', name_uz: 'Tamvort' },
            { name_ru: 'Мангалица', name_uz: 'Mangalitsa' },
          ],
          colors: [
            { name_ru: 'Белый', name_uz: 'Oq' },
            { name_ru: 'Чёрный', name_uz: 'Qora' },
            { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
            { name_ru: 'Красно-коричневый', name_uz: 'Qizil-jigarrang' },
            { name_ru: 'Серый', name_uz: 'Kulrang' },
            { name_ru: 'Смешанный', name_uz: 'Aralash' },
          ],
        },
      ],
    },
    {
      name_ru: 'Мелкие домашние животные',
      name_uz: 'Mayda uy hayvonlari',
      children: [
        {
          name_ru: 'Собака',
          name_uz: 'It',
          breeds: [
            { name_ru: 'Чихуахуа', name_uz: 'Chihuahua' },
            { name_ru: 'Померанский шпиц', name_uz: 'Pomeranian' },
            { name_ru: 'Мальтийская болонка', name_uz: 'Maltese' },
            { name_ru: 'Ши-тцу', name_uz: 'Shih Tzu' },
            { name_ru: 'Пекинес', name_uz: 'Pekingese' },
            { name_ru: 'Лхаса апсо', name_uz: 'Lhasa Apso' },
            { name_ru: 'Йоркширский терьер', name_uz: 'Yorkshire Terrier' },
            { name_ru: 'Бишон фризе', name_uz: 'Bichon Frise' },
            { name_ru: 'Кавалер Кинг Чарльз', name_uz: 'Cavalier King Charles Spaniel' },
            { name_ru: 'Французский бульдог', name_uz: 'French Bulldog' },
            { name_ru: 'Бостон-терьер', name_uz: 'Boston Terrier' },
            { name_ru: 'Гаванская собака', name_uz: 'Havanese' },
            { name_ru: 'Той-пудель', name_uz: 'Toy Poodle' },
            { name_ru: 'Итальянская борзая', name_uz: 'Italian Greyhound' },
            { name_ru: 'Папийон', name_uz: 'Papillon' },
          ],
          colors: [
            { name_ru: 'Белый', name_uz: 'Oq' },
            { name_ru: 'Чёрный', name_uz: 'Qora' },
            { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
            { name_ru: 'Рыжий', name_uz: 'Qizil' },
            { name_ru: 'Серый', name_uz: 'Kulrang' },
            { name_ru: 'Смешанный', name_uz: 'Aralash' },
            { name_ru: 'Жёлтоватый', name_uz: 'Sarg\'ish' },
            { name_ru: 'Бежевый', name_uz: 'Bej' },
          ],
        },
        {
          name_ru: 'Кошка',
          name_uz: 'Mushuk',
          breeds: [
            { name_ru: 'Персидская кошка', name_uz: 'Pers mushuk' },
            { name_ru: 'Сфинкс', name_uz: 'Sphinx' },
            { name_ru: 'Сиамская кошка', name_uz: 'Siamese' },
            { name_ru: 'Мейн-кун', name_uz: 'Maine Coon' },
            { name_ru: 'Британская короткошерстная', name_uz: 'British Shorthair' },
            { name_ru: 'Шотландская вислоухая', name_uz: 'Scottish Fold' },
            { name_ru: 'Рэгдолл', name_uz: 'Ragdoll' },
            { name_ru: 'Бенгальская кошка', name_uz: 'Bengal' },
            { name_ru: 'Абиссинская кошка', name_uz: 'Abyssinian' },
            { name_ru: 'Русская голубая', name_uz: 'Russian Blue' },
            { name_ru: 'Норвежская лесная', name_uz: 'Norwegian Forest Cat' },
            { name_ru: 'Восточная короткошерстная', name_uz: 'Oriental Shorthair' },
            { name_ru: 'Турецкая ангора', name_uz: 'Turkish Angora' },
            { name_ru: 'Бурманская кошка', name_uz: 'Burmese' },
            { name_ru: 'Корниш-рекс', name_uz: 'Cornish Rex' },
          ],
          colors: [
            { name_ru: 'Белый', name_uz: 'Oq' },
            { name_ru: 'Чёрный', name_uz: 'Qora' },
            { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
            { name_ru: 'Серый', name_uz: 'Kulrang' },
            { name_ru: 'Рыжий', name_uz: 'Qizil' },
            { name_ru: 'Жёлтоватый', name_uz: 'Sarg\'ish' },
            { name_ru: 'Голубой', name_uz: 'Moviy' },
            { name_ru: 'Пёстрый', name_uz: 'Aralash' },
            { name_ru: 'Бежевый', name_uz: 'Bej' },
            { name_ru: 'Шоколадный', name_uz: 'Shokolad rang' },
            { name_ru: 'Линкс', name_uz: 'Lynx' },
            { name_ru: 'Табби', name_uz: 'Tabby' },
          ],
        },
      ],
    },
    {
      name_ru: 'Птицы',
      name_uz: 'Parrandalar',
      children: [],
      breeds: [
        { name_ru: 'Корниш', name_uz: 'Cornish' },
        { name_ru: 'Плимутрок', name_uz: 'Plymouth Rock' },
        { name_ru: 'Орпингтон', name_uz: 'Orpington' },
        { name_ru: 'Брама', name_uz: 'Brahma' },
        { name_ru: 'Сассекс', name_uz: 'Sussex' },
        { name_ru: 'Виандот', name_uz: 'Wyandotte' },
        { name_ru: 'Маран', name_uz: 'Maran' },
        { name_ru: 'Силки', name_uz: 'Silkie' },
        { name_ru: 'Польская', name_uz: 'Polish' },
        { name_ru: 'Бантам', name_uz: 'Bantam' },
        { name_ru: 'Себрайт', name_uz: 'Sebright' },
        { name_ru: 'Леггорн', name_uz: 'Leghorn' },
        { name_ru: 'Минорка', name_uz: 'Minorca' },
        { name_ru: 'Анкона', name_uz: 'Ancona' },
        { name_ru: 'Гамбург', name_uz: 'Hamburg' },
      ],
      colors: [
        { name_ru: 'Белый', name_uz: 'Oq' },
        { name_ru: 'Чёрный', name_uz: 'Qora' },
        { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
        { name_ru: 'Красный', name_uz: 'Qizil' },
        { name_ru: 'Серый', name_uz: 'Kulrang' },
        { name_ru: 'Жёлтоватый', name_uz: 'Sarg\'ish' },
        { name_ru: 'Смешанный', name_uz: 'Aralash' },
      ],
    },
    {
      name_ru: 'Пчёлы',
      name_uz: 'Asalarilar',
      children: [],
      breeds: [
        { name_ru: 'Итальянская', name_uz: 'Italiyan' },
        { name_ru: 'Карниольская', name_uz: 'Carniolan' },
        { name_ru: 'Кавказская', name_uz: 'Kavkaz' },
        { name_ru: 'Евро-патагонская', name_uz: 'Yevro-patagonian' },
        { name_ru: 'Восточная', name_uz: 'Sharqiy' },
        { name_ru: 'Африканская', name_uz: 'Afrika' },
        { name_ru: 'Дикая тропическая', name_uz: 'Yovvoyi tropik' },
        { name_ru: 'Дикая малая', name_uz: 'Yovvoyi kichik' },
        { name_ru: 'Мини / местная', name_uz: 'Mini / mahalliy' },
      ],
      colors: [
        { name_ru: 'Жёлтый', name_uz: 'Sariq' },
        { name_ru: 'Красно-жёлтый', name_uz: 'Qizil-sariq' },
        { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
        { name_ru: 'Чёрный', name_uz: 'Qora' },
        { name_ru: 'Жёлто-чёрный', name_uz: 'Sariq-qora chiziqli' },
        { name_ru: 'Золотистый', name_uz: 'Oltin rang' },
      ],
    },
  ];

  async function seedAnimalType(typeData: any, parentId: string | null = null) {
    const type = await prisma.animalType.upsert({
      where: { name_ru: typeData.name_ru },
      update: {},
      create: {
        name_ru: typeData.name_ru,
        name_uz: typeData.name_uz,
        parentId: parentId,
      },
    });

    if (typeData.breeds) {
      for (const breed of typeData.breeds) {
        await prisma.breed.create({
          data: {
            name_ru: breed.name_ru,
            name_uz: breed.name_uz,
            animals: { connect: [] },
          },
        });
      }
    }

    if (typeData.colors) {
      for (const color of typeData.colors) {
        await prisma.color.create({
          data: {
            name_ru: color.name_ru,
            name_uz: color.name_uz,
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
      name_ru: 'Болезни пищеварительной системы',
      name_uz: 'Hazm qilish tizimi kasalliklari',
      diseases: [
        { name_ru: 'Стоматит', name_uz: 'Stomatit' },
        { name_ru: 'Фарингит', name_uz: 'Faringit' },
        { name_ru: 'Гипотония преджелудков', name_uz: 'Oshqozon Oldi gipotoniyasi' },
        { name_ru: 'Атония преджелудков', name_uz: 'Oshqozon Oldi atoniyasi' },
        { name_ru: 'Парез рубца', name_uz: 'Rubets parezi' },
        { name_ru: 'Ацидоз', name_uz: 'Atsidoz' },
        { name_ru: 'Алкалоз', name_uz: 'Alkaloz' },
        { name_ru: 'Тимпания', name_uz: 'Timpaniya' },
        { name_ru: 'Паракератоз', name_uz: 'Parakeratoz' },
        { name_ru: 'Травматический ретикулит', name_uz: 'Travmatik retikulit' },
        { name_ru: 'Ретикулоперитонит', name_uz: 'Retikuloperitonit' },
        { name_ru: 'Гастрит', name_uz: 'Gastrit' },
        { name_ru: 'Язва желудка', name_uz: 'Oshqozon yarasi' },
        { name_ru: 'Гастроэнтерит', name_uz: 'Gastroenterit' },
        { name_ru: 'Энтероколит', name_uz: 'Enterokolit' },
        { name_ru: 'Метеоризм кишечника', name_uz: 'Ichak meteorismi' },
      ],
    },
    {
      name_ru: 'Болезни мочевыделительной системы',
      name_uz: 'Siydik chiqarish tizimi kasalliklari',
      diseases: [
        { name_ru: 'Нефрит', name_uz: 'Nefrit' },
        { name_ru: 'Нефроз', name_uz: 'Nefroz' },
        { name_ru: 'Нефросклероз', name_uz: 'Nefroskleroz' },
        { name_ru: 'Пиелонефрит', name_uz: 'Pielonefrit' },
        { name_ru: 'Уроцистит', name_uz: 'Urotsistit' },
        { name_ru: 'Мочекаменная болезнь', name_uz: 'Buyrak tosh kasalligi' },
        { name_ru: 'Хроническая гематурия', name_uz: 'Xronik gematuriya' },
      ],
    },
  ];

  for (const category of diseaseCategories) {
    await prisma.diseaseCategory.create({
      data: {
        name_ru: category.name_ru,
        name_uz: category.name_uz,
        diseases: {
          create: category.diseases.map((d) => ({
            name_ru: d.name_ru,
            name_uz: d.name_uz,
          })),
        },
      },
    });
  }
  console.log('Diseases seeded.');

  // --- 5. Prophylaxis (Vaccines & Deworming) ---
  const vaccines = [
    { name_ru: 'Вакцина против бруцеллёза', name_uz: 'Brucella vaksina' },
    { name_ru: 'Вакцина против пастереллёза', name_uz: 'Pasteurella vaksina' },
  ];

  const vaccineStrains = [
    'S19', 'P52', 'Oregon C24V', 'Nigeria 75/1', 'A, B, C', 'K88, K99', 'Typhimurium', 'S-6',
  ];

  for (const v of vaccines) {
    await prisma.prophylaxisItem.create({
      data: {
        name_ru: v.name_ru,
        name_uz: v.name_uz,
        type: ProphylaxisType.VACCINE,
        details: {
          create: vaccineStrains.map((s) => ({ name_ru: s, name_uz: s })),
        },
      },
    });
  }

  // --- 6. Reference Data (Urine, Feces, Mucosa) ---
  const findType = async (name: string) =>
    prisma.animalType.findUnique({ where: { name_ru: name } });

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
            name_ru: color.ru,
            name_uz: color.uz,
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

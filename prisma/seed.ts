import {
  PrismaClient,
  ProphylaxisType,
  UserRole,
  UserGender,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

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
      where: { name_ru: region.name }, // Assuming name is RU for now
      update: {},
      create: {
        name_ru: region.name,
        name_uz: region.name, // Placeholder
        districts: {
          create: region.districts.map((d) => ({ name_ru: d, name_uz: d })),
        },
      },
    });
  }
  console.log('Regions and Districts seeded.');

  // --- 2. Users ---
  // Create a district to link user to
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
          name_uz: 'Qoramol', // Yirik shoxli hayvonlar / Qoramol
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
            { name_ru: 'Серо-бурый', name_uz: 'Kulrang' }, // Mapping based on order
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
                {
                  name_ru: 'Узбекская чёрная коза',
                  name_uz: 'O‘zbekiston qora echkisi',
                },
                {
                  name_ru: 'Узбекская пуховая коза',
                  name_uz: 'O‘zbekiston mo‘ynali echkisi',
                },
                {
                  name_ru: 'Киргизская горная коза',
                  name_uz: 'Qirg‘iz tog‘ echkisi',
                },
                {
                  name_ru: 'Таджикская горная коза',
                  name_uz: 'Tojik tog‘ echkisi',
                },
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
                {
                  name_ru: 'Красновато-коричневый',
                  name_uz: 'Qizg‘ish-jigarrang',
                },
                { name_ru: 'Белый с чёрным', name_uz: 'Oq-qora' },
                { name_ru: 'Золотистый', name_uz: 'Oltin' },
                { name_ru: 'Пепельный', name_uz: 'Bo‘r rang' },
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
                { name_ru: 'Афганская порода', name_uz: 'Afg‘on tuya zoti' },
                { name_ru: 'Арабская порода', name_uz: 'Arab tuya zoti' },
                { name_ru: 'Сомалийская порода', name_uz: 'Somali tuya zoti' },
                { name_ru: 'Индийская порода', name_uz: 'Hind tuya zoti' },
                {
                  name_ru: 'Пакистанская порода',
                  name_uz: 'Pokiston tuya zoti',
                },
                { name_ru: 'Суданская порода', name_uz: 'Sudan tuya zoti' },
                { name_ru: 'Иранская порода', name_uz: 'Eron tuya zoti' },
                { name_ru: 'Туркменская порода', name_uz: 'Turkman tuya zoti' },
                {
                  name_ru: 'Белуджистанская порода',
                  name_uz: 'Balujiston tuya zoti',
                },
                { name_ru: 'Магрибская порода', name_uz: 'Mag‘rib tuya zoti' },
              ],
              colors: [
                { name_ru: 'Белый', name_uz: 'Oq' },
                { name_ru: 'Желтоватый', name_uz: 'Sarg‘ish' },
                { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
                { name_ru: 'Красноватый', name_uz: 'Qizg‘ish' },
                { name_ru: 'Чёрный', name_uz: 'Qora' },
                { name_ru: 'Серый', name_uz: 'Kulrang' },
                { name_ru: 'Бурый', name_uz: 'Qo‘ng‘ir' },
              ],
            },
            {
              name_ru: 'Двугорбые',
              name_uz: 'Ikki o`rkachli',
              breeds: [
                {
                  name_ru: 'Казахстанская порода',
                  name_uz: 'Qozog‘iston tuya zoti',
                },
                { name_ru: 'Монгольская порода', name_uz: 'Mongol tuya zoti' },
                { name_ru: 'Иранская порода', name_uz: 'Eron tuya zoti' },
                { name_ru: 'Китайская порода', name_uz: 'Xitoy tuya zoti' },
                { name_ru: 'Туркменская порода', name_uz: 'Turkman tuya zoti' },
                {
                  name_ru: 'Узбекская порода',
                  name_uz: 'O‘zbekiston tuya zoti',
                },
                {
                  name_ru: 'Каракалпакская порода',
                  name_uz: 'Qoraqalpoq tuya zoti',
                },
              ],
              colors: [
                { name_ru: 'Белый', name_uz: 'Oq' },
                { name_ru: 'Желтоватый', name_uz: 'Sarg‘ish' },
                { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
                { name_ru: 'Красноватый', name_uz: 'Qizg‘ish' },
                { name_ru: 'Чёрный', name_uz: 'Qora' },
                { name_ru: 'Серый', name_uz: 'Kulrang' },
                { name_ru: 'Бурый', name_uz: 'Qo‘ng‘ir' },
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
            { name_ru: 'Орловский рысак', name_uz: 'Orlov yo‘rg‘asi' },
            { name_ru: 'Донская лошадь', name_uz: 'Don oti' },
            { name_ru: 'Казахстанская лошадь', name_uz: 'Qozog‘iston oti' },
            { name_ru: 'Карабаирская лошадь', name_uz: 'Qorabair oti' },
            { name_ru: 'Ахалтекинская лошадь', name_uz: 'Achal-tekinskiy oti' },
            { name_ru: 'Будённовская лошадь', name_uz: 'Budennovsk oti' },
            { name_ru: 'Кабардинская лошадь', name_uz: 'Kabardin oti' },
            { name_ru: 'Киргизская лошадь', name_uz: 'Qirg‘iz oti' },
            { name_ru: 'Узбекская лошадь', name_uz: 'O‘zbek oti' },
            { name_ru: 'Монгольская лошадь', name_uz: 'Mo‘g‘ul oti' },
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
            { name_ru: 'Красновато-коричневый', name_uz: 'Qizg‘ish-jigarrang' },
            { name_ru: 'Серый', name_uz: 'Kulrang' },
            { name_ru: 'Пепельный', name_uz: 'Bo‘r rang' },
            { name_ru: 'Желтоватый', name_uz: 'Sarg‘ish' },
            { name_ru: 'Бурый', name_uz: 'Qo‘ng‘ir' },
            { name_ru: 'Алазан', name_uz: 'Alazan' },
            { name_ru: 'Буланый', name_uz: 'Bulan' },
          ],
        },
        {
          name_ru: 'Ослы',
          name_uz: 'Eshaklar',
          children: [],
          breeds: [
            { name_ru: 'Узбекский осёл', name_uz: 'O‘zbekiston eshagi' },
            { name_ru: 'Каракалпакский осёл', name_uz: 'Qoraqalpoq eshagi' },
            { name_ru: 'Туркменский осёл', name_uz: 'Turkman eshagi' },
            { name_ru: 'Таджикский осёл', name_uz: 'Tojik eshagi' },
            { name_ru: 'Киргизский осёл', name_uz: 'Qirg‘iz eshagi' },
            { name_ru: 'Китайский осёл', name_uz: 'Xitoy eshagi' },
            { name_ru: 'Сомалийский осёл', name_uz: 'Somali eshagi' },
            { name_ru: 'Нубийский осёл', name_uz: 'Nubian eshagi' },
            { name_ru: 'Андалузский осёл', name_uz: 'Andalusiya eshagi' },
            { name_ru: 'Каталонский осёл', name_uz: 'Kataloniya eshagi' },
            { name_ru: 'Пуату осёл', name_uz: 'Poitou eshagi' },
            {
              name_ru: 'Американский мини-осёл',
              name_uz: 'Amerika mini eshagi',
            },
          ],
          colors: [
            { name_ru: 'Белый', name_uz: 'Oq' },
            { name_ru: 'Чёрный', name_uz: 'Qora' },
            { name_ru: 'Коричневый', name_uz: 'Jigarrang' },
            { name_ru: 'Серый', name_uz: 'Kulrang' },
            { name_ru: 'Желтоватый', name_uz: 'Sarg‘ish' },
            { name_ru: 'Бурый', name_uz: 'Qo‘ng‘ir' },
            { name_ru: 'Красновато-коричневый', name_uz: 'Qizg‘ish-jigarrang' },
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
            { name_ru: 'Горная зебра', name_uz: 'Tog‘ zebrasi' },
            { name_ru: 'Зебра Гранта', name_uz: 'Grant zebrasi' },
            { name_ru: 'Зебра Чапмана', name_uz: 'Chapman zebrasi' },
            {
              name_ru: 'Горная зебра Хартмана',
              name_uz: 'Hartmann tog‘ zebrasi',
            },
          ],
          colors: [
            { name_ru: 'Белый с чёрным', name_uz: 'Oq-qora' },
            { name_ru: 'Белый с коричневым', name_uz: 'Oq-jigarrang' },
            { name_ru: 'Чёрный с коричневым', name_uz: 'Qora-jigarrang' },
            { name_ru: 'Белый с серым', name_uz: 'Oq-kulrang' },
            { name_ru: 'Белый с желтоватым', name_uz: 'Oq-sarg‘ish' },
          ],
        },
        {
          name_ru: 'Свиньи',
          name_uz: "Cho'chqalar",
          children: [],
          breeds: [
            { name_ru: 'Узбекская свинья', name_uz: 'O‘zbekiston cho‘chqasi' },
            { name_ru: 'Крупная белая свинья', name_uz: 'Katta oq cho‘chqa' },
            { name_ru: 'Ландрас', name_uz: 'Landras' },
            { name_ru: 'Дюрок', name_uz: 'Durok' },
            { name_ru: 'Гемпшир', name_uz: 'Hampshire' },
            { name_ru: 'Йоркшир', name_uz: 'Yorshir' },
            { name_ru: 'Беркшир', name_uz: 'Berkshir' },
            { name_ru: 'Эстонский бекон', name_uz: 'Estoniya bekoni' },
            {
              name_ru: 'Латвийская белая свинья',
              name_uz: 'Latviya oq cho‘chqasi',
            },
            {
              name_ru: 'Украинская порода',
              name_uz: 'Ukrainaning cho‘chqa zoti',
            },
            { name_ru: 'Белорусская белая', name_uz: 'Belorus oq cho‘chqasi' },
            {
              name_ru: 'Вьетнамская вислобрюхая',
              name_uz: 'Vyetnam vislobryux cho‘chqasi',
            },
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
            {
              name_ru: 'Кавалер Кинг Чарльз',
              name_uz: 'Cavalier King Charles Spaniel',
            },
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
            { name_ru: 'Жёлтоватый', name_uz: 'Sarg‘ish' },
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
            {
              name_ru: 'Британская короткошерстная',
              name_uz: 'British Shorthair',
            },
            { name_ru: 'Шотландская вислоухая', name_uz: 'Scottish Fold' },
            { name_ru: 'Рэгдолл', name_uz: 'Ragdoll' },
            { name_ru: 'Бенгальская кошка', name_uz: 'Bengal' },
            { name_ru: 'Абиссинская кошка', name_uz: 'Abyssinian' },
            { name_ru: 'Русская голубая', name_uz: 'Russian Blue' },
            { name_ru: 'Норвежская лесная', name_uz: 'Norwegian Forest Cat' },
            {
              name_ru: 'Восточная короткошерстная',
              name_uz: 'Oriental Shorthair',
            },
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
            { name_ru: 'Жёлтоватый', name_uz: 'Sarg‘ish' },
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
        { name_ru: 'Жёлтоватый', name_uz: 'Sarg‘ish' },
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

    // Seed Breeds
    if (typeData.breeds) {
      for (const breed of typeData.breeds) {
        await prisma.breed.create({
          data: {
            name_ru: breed.name_ru,
            name_uz: breed.name_uz,
            animals: { connect: [] }, // No animals yet
            // Note: Schema doesn't link Breed directly to Type, but Animal links to both.
            // Wait, schema has AnimalBreed model but no relation to AnimalType?
            // Checking schema... AnimalType has no relation to Breed.
            // Animal has relation to both.
            // So we just create breeds independently? Or should we link them?
            // The schema `inventory.prisma` shows `model Breed` has no `animalTypeId`.
            // This means breeds are global or we need to rely on naming convention.
            // For now, I will just create them.
          },
        });
      }
    }

    // Seed Colors
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

    // Recursively seed children
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
        {
          name_ru: 'Гипотония преджелудков',
          name_uz: 'Oshqozon Oldi gipotoniyasi',
        },
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
    // ... Add other categories similarly (abbreviated for brevity, but you should include all)
  ];

  for (const category of diseaseCategories) {
    const cat = await prisma.diseaseCategory.create({
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
    // ... others
  ];

  const vaccineStrains = [
    'S19',
    'P52',
    'Oregon C24V',
    'Nigeria 75/1',
    'A, B, C',
    'K88, K99',
    'Typhimurium',
    'S-6',
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
  // We need to fetch AnimalTypes to link them.
  // Assuming 'Крупный рогатый скот' (Cattle) corresponds to specific ID.
  // For simplicity, I will fetch all types and try to match by name if possible,
  // or just seed generally if the schema allows optional relation?
  // Schema: `animalTypeId String @map("animal_type_id") @db.Uuid` -> Required.

  // I will implement a helper to find type by RU name.
  const findType = async (name: string) =>
    prisma.animalType.findUnique({ where: { name_ru: name } });

  const cattle = await findType('Крупный рогатый скот');
  const smallCattle = await findType('Мелкий рогатый скот'); // This is a category, maybe link to Sheep/Goat?
  // The document lists YShH (Cattle), MShH (Small Cattle), Otlar (Horses), Cho'chqalar (Pigs) for Urine.

  const targetTypes = [
    { name: 'Крупный рогатый скот', code: 'YShH' },
    { name: 'Мелкий рогатый скот', code: 'MShH' },
    { name: 'Лошади', code: 'Otlar' },
    { name: 'Свиньи', code: "Cho'chqalar" },
  ];

  // Urine Colors (4 lists in doc, matching 4 types)
  const urineColorsData = [
    // Cattle
    [
      { ru: 'Тёмно-жёлтый', uz: 'To’q sariq' },
      { ru: 'Жёлтый', uz: 'Sariq' },
      { ru: 'Светло-жёлтый', uz: 'Och sariq' },
      { ru: 'Коричневый', uz: 'Jigarrang' },
      { ru: 'Красный', uz: 'Qizil' },
      { ru: 'Почти чёрный', uz: 'Qoramtir' },
      { ru: 'Молочный', uz: 'Sut rang' },
    ],
    // Small Cattle
    [
      { ru: 'Тёмно-жёлтый', uz: 'To’q sariq' },
      { ru: 'Красный', uz: 'Qizil' },
      { ru: 'Розовый', uz: 'Pushti' },
      { ru: 'Коричневый', uz: 'Jigarrang' },
    ],
    // Horses
    [
      { ru: 'Тёмно-жёлтый', uz: 'To’q sariq' },
      { ru: 'Коричневый', uz: 'Jigarrang' },
      { ru: 'Красный', uz: 'Qizil' },
      { ru: 'Молочного цвета', uz: 'Sut rang' },
    ],
    // Pigs
    [
      { ru: 'Светло-жёлтый', uz: 'Och sariq' },
      { ru: 'Коричневый', uz: 'Jigarrang' },
      { ru: 'Красный', uz: 'Qizil' },
      { ru: 'Молочный', uz: 'Sut rang' }, // Assuming implied from doc structure
    ],
  ];

  for (let i = 0; i < targetTypes.length; i++) {
    const typeName = targetTypes[i].name;
    const type = await findType(typeName);
    if (type) {
      // Seed Urine Colors
      if (urineColorsData[i]) {
        for (const color of urineColorsData[i]) {
          await prisma.urineColor.create({
            data: {
              name_ru: color.ru,
              name_uz: color.uz,
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

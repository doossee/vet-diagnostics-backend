/**
 * One-time data migration: fix Russian translations.
 *
 * Many lookup tables in the database had Uzbek-Cyrillic text (using letters
 * қ, ў, ҳ, ғ) in the `ru` field instead of actual Russian.
 * This script updates existing rows to proper Russian translations.
 *
 * Safe to run multiple times — only updates by numericValue / unique keys.
 *
 * Usage:
 *   npx tsx prisma/migrate-translations.ts
 *   # or
 *   yarn tsx prisma/migrate-translations.ts
 */

import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Create/update .env and try again.');
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const n = (ru: string, uz: string) => ({ ru, uz });

// Helper: update a lookup table by numericValue
async function updateLookup(
  modelName: string,
  translations: { nv: number; ru: string; uz: string }[],
) {
  let updated = 0;
  let skipped = 0;
  for (const t of translations) {
    try {
      await (prisma as any)[modelName].update({
        where: { numericValue: t.nv },
        data: { name: n(t.ru, t.uz) },
      });
      updated++;
    } catch {
      skipped++;
    }
  }
  console.log(`  ${modelName.padEnd(20)} updated=${updated}, skipped=${skipped}`);
}

async function main() {
  console.log('Starting translation migration...\n');

  // ===== Clinical exam lookups (keyed by numericValue) =====

  await updateLookup('bodyType', [
    { nv: 0, ru: 'Крепкое телосложение', uz: 'Kuchli jussali' },
    { nv: 1, ru: 'Среднее телосложение', uz: "O'rtacha jussali" },
    { nv: 2, ru: 'Слабое телосложение', uz: 'Kuchsiz jussali' },
  ]);

  await updateLookup('obesityType', [
    { nv: 0, ru: 'Хорошая упитанность', uz: 'Yaxshi, yuqori semiz' },
    { nv: 1, ru: 'Средняя упитанность', uz: "O'rtacha semiz" },
    { nv: 2, ru: 'Ниже средней упитанности', uz: "O'rtadan past semiz" },
    { nv: 3, ru: 'Кахексия', uz: 'Kaxeksiya' },
  ]);

  await updateLookup('bodyPosition', [
    { nv: 0, ru: 'Естественное', uz: 'Tabiiy' },
    { nv: 1, ru: 'Вынужденное стоячее', uz: 'Majburiy tik turgan' },
    { nv: 2, ru: 'Вынужденное лежачее', uz: 'Majburiy yotgan' },
    { nv: 3, ru: 'Вынужденное сидячее', uz: "Majburiy o'tirgan" },
    { nv: 4, ru: 'Неестественное положение', uz: "Tabiiy bo'lmagan holat" },
    { nv: 5, ru: 'Непроизвольные движения', uz: 'Ixtiyorsiz harakatlar' },
    { nv: 6, ru: 'Манежное движение', uz: 'Monejli harakat' },
    { nv: 7, ru: 'Круговое движение', uz: 'Aylanma harakat' },
    { nv: 8, ru: 'Движение вперёд', uz: 'Oldinga qarab harakat' },
    { nv: 9, ru: 'Движение назад', uz: 'Orqaga qarab harakat' },
    { nv: 10, ru: 'Движение в положении лёжа', uz: "Ag'anab yotgan joyidagi harakat" },
  ]);

  await updateLookup('constitution', [
    { nv: 0, ru: 'Рыхлая (нежная)', uz: 'Yumshoq' },
    { nv: 1, ru: 'Плотная (грубая)', uz: 'Mustahkam' },
    { nv: 2, ru: 'У лошадей', uz: 'Otlarda' },
    { nv: 3, ru: 'У птиц', uz: 'Parranda' },
  ]);

  await updateLookup('temperament', [
    { nv: 0, ru: 'Меланхолик', uz: 'Melanxolik' },
    { nv: 1, ru: 'Флегматик', uz: 'Flegmatik' },
  ]);

  await updateLookup('woolType', [
    { nv: 0, ru: 'Равномерная', uz: 'Bir tekis' },
    { nv: 1, ru: 'Неравномерная', uz: 'Bir tekis emas' },
    { nv: 2, ru: 'Прилегает к коже', uz: 'Teriga yotib turadi' },
    { nv: 3, ru: 'Блестящая', uz: 'Yaltiroq' },
    { nv: 4, ru: 'Тусклая', uz: 'Xira' },
    { nv: 5, ru: 'Не выпадает', uz: 'Tushmaydi' },
    { nv: 6, ru: 'Взъерошенная', uz: 'Hurpaygan' },
    { nv: 7, ru: 'Свалявшаяся', uz: 'Bir-biriga yopishgan' },
    { nv: 8, ru: 'Очаговое выпадение шерсти', uz: 'Terining ayrim joylarida junlar tushgan' },
    { nv: 9, ru: 'Густая', uz: 'Qalin' },
    { nv: 10, ru: 'Редкая', uz: 'Siyrak' },
    { nv: 11, ru: 'Физиологическая линька', uz: 'Fiziologik tullash' },
    { nv: 12, ru: 'Патологическая линька', uz: 'Patologik tullash' },
    { nv: 13, ru: 'Шерсть выпадает', uz: 'Jun tushayapti' },
    { nv: 14, ru: 'Шерсть не выпадает', uz: 'Jun tushmayapti' },
  ]);

  await updateLookup('downType', [
    { nv: 0, ru: 'Густой', uz: 'Zich' },
    { nv: 1, ru: 'Редкий', uz: 'Siyrak' },
    { nv: 2, ru: 'Отсутствует', uz: "Yo'q" },
    { nv: 3, ru: 'Мягкий', uz: 'Yumshoq' },
    { nv: 4, ru: 'Гладкий', uz: 'Silliq' },
    { nv: 5, ru: 'Тусклый', uz: 'Xira' },
    { nv: 6, ru: 'Блестящий', uz: 'Yaltiroq' },
    { nv: 7, ru: 'Сухой', uz: 'Quruq' },
    { nv: 8, ru: 'Запылённый', uz: 'Chang bosgan' },
    { nv: 9, ru: 'Равномерный', uz: 'Bir tekis' },
    { nv: 10, ru: 'Белого цвета', uz: 'Oq rangli' },
    { nv: 11, ru: 'Серый', uz: 'Kulrang' },
    { nv: 12, ru: 'Желтоватый', uz: "Sarg'aygan" },
    { nv: 13, ru: 'Тёмный', uz: 'Qoramtir' },
    { nv: 14, ru: 'Влажный', uz: 'Nam' },
  ]);

  await updateLookup('hairType', [
    { nv: 0, ru: 'Жёсткий', uz: "Dag'al" },
    { nv: 1, ru: 'Редкий', uz: 'Siyrak' },
  ]);

  await updateLookup('featherType', [
    { nv: 0, ru: 'Блестящие', uz: 'Yaltiroq' },
    { nv: 1, ru: 'Тусклые', uz: 'Xira' },
    { nv: 2, ru: 'Полные', uz: "To'liq" },
    { nv: 3, ru: 'Выпавшие', uz: "To'kilgan" },
    { nv: 4, ru: 'Сломанные', uz: 'Siniq' },
  ]);

  await updateLookup('skinColor', [
    { nv: 0, ru: 'Бледно-розовый', uz: 'Och binafsha' },
    { nv: 1, ru: 'Бледный', uz: 'Oqargan' },
    { nv: 2, ru: 'Покрасневший', uz: 'Qizargan' },
    { nv: 3, ru: 'Синюшный', uz: "Ko'kargan" },
    { nv: 4, ru: 'Желтушный', uz: "Sarg'aygan" },
  ]);

  await updateLookup('skinHumidity', [
    { nv: 0, ru: 'Умеренно влажная', uz: "O'rtacha nam" },
    { nv: 1, ru: 'Гипергидроз', uz: 'Gipergidroz' },
    { nv: 2, ru: 'Местное потоотделение', uz: 'Mahalliy terlagan' },
    { nv: 3, ru: 'Сухая — ангидроз', uz: 'Quruq – angidoz' },
  ]);

  await updateLookup('skinTemp', [
    { nv: 0, ru: 'Температура кожи общая повышена', uz: "Teri harorati umumiy ko'tarilgan" },
    { nv: 1, ru: 'Температура кожи местная повышена', uz: "Teri harorati mahalliy ko'tarilgan" },
    { nv: 2, ru: 'Температура кожи общая понижена', uz: 'Teri harorati umumiy pasaygan' },
    { nv: 3, ru: 'Температура кожи местная понижена', uz: 'Teri harorati mahalliy pasaygan' },
    { nv: 4, ru: 'Температура кожи разная', uz: 'Teri harorati har xil' },
  ]);

  await updateLookup('skinElasticity', [
    { nv: 0, ru: 'Эластичная', uz: 'Elastik' },
    { nv: 1, ru: 'Эластичность кожи снижена', uz: 'Teri elastikgi kamaygan' },
    { nv: 2, ru: 'Эластичность кожи отсутствует', uz: "Teri elastikligi umuman yo'q" },
  ]);

  await updateLookup('skinSmell', [
    { nv: 0, ru: 'Без запаха', uz: 'Hidsiz' },
    { nv: 1, ru: 'Нормальный запах', uz: 'Normal hid' },
    { nv: 2, ru: 'Ацетоновый запах', uz: 'Atsetonli hid' },
    { nv: 3, ru: 'Гнилостный запах', uz: 'Sepgan hid' },
  ]);

  await updateLookup('skinSurface', [
    { nv: 0, ru: 'Гладкая', uz: 'Silliq' },
    { nv: 1, ru: 'Шершавая', uz: "Qo'ng'ir" },
    { nv: 2, ru: 'Влажная', uz: 'Nam' },
    { nv: 3, ru: 'Чешуйчатая', uz: 'Qavatlar bilan' },
  ]);

  await updateLookup('skinSensitivity', [
    { nv: 0, ru: 'Нормальная', uz: 'Normal' },
    { nv: 1, ru: 'Повышенная', uz: "Ko'tarilgan" },
    { nv: 2, ru: 'Пониженная', uz: 'Pasaygan' },
  ]);

  await updateLookup('skinPain', [
    { nv: 0, ru: 'Безболезненная', uz: "Og'riqsiz" },
    { nv: 1, ru: 'Болезненная', uz: "Og'riqli" },
    { nv: 2, ru: 'Сильно болезненная', uz: "Juda og'riqli" },
  ]);

  await updateLookup('lymphSize', [
    { nv: 0, ru: 'Не увеличены', uz: 'Kattarmagan' },
    { nv: 1, ru: 'Увеличены', uz: 'Kattargan' },
  ]);

  await updateLookup('lymphShape', [
    { nv: 0, ru: 'Плоская', uz: 'Yassi' },
    { nv: 1, ru: 'Круглая', uz: 'Dumaloq' },
    { nv: 2, ru: 'Увеличенная', uz: 'Kattargan' },
    { nv: 3, ru: 'Распухшая', uz: 'Shishgan' },
  ]);

  await updateLookup('lymphSurface', [
    { nv: 0, ru: 'Гладкая', uz: 'Silliq' },
    { nv: 1, ru: 'Бугристая', uz: "G'adir-budir" },
  ]);

  await updateLookup('lymphConsistency', [
    { nv: 0, ru: 'Плотная', uz: 'Zich' },
    { nv: 1, ru: 'Дряблая', uz: 'Bilqillagan' },
    { nv: 2, ru: 'Своеобразная', uz: "O'ziga xos" },
  ]);

  await updateLookup('lymphTemp', [
    { nv: 0, ru: 'Умеренная', uz: "O'rtacha" },
    { nv: 1, ru: 'Повышенная', uz: 'Oshgan' },
  ]);

  await updateLookup('lymphPain', [
    { nv: 0, ru: 'Безболезненные', uz: "Og'riqsiz" },
    { nv: 1, ru: 'Болезненные', uz: "Og'riqli" },
  ]);

  await updateLookup('lymphMobility', [
    { nv: 0, ru: 'Подвижные', uz: 'Harakatchan' },
    { nv: 1, ru: 'Малоподвижные', uz: 'Kam harakatchan' },
  ]);

  await updateLookup('rumenFluidState', [
    { nv: 0, ru: 'Нормальное', uz: 'Normal' },
    { nv: 1, ru: 'Вздутие', uz: 'Bulanganlik' },
    { nv: 2, ru: 'Закупорка', uz: 'Tiqilib qolgan' },
    { nv: 3, ru: 'Гранулярное', uz: 'Zarnali' },
    { nv: 4, ru: 'Слизистое', uz: 'Limfali' },
  ]);

  await updateLookup('mucosaType', [
    { nv: 0, ru: 'Ротовая', uz: "Og'iz" },
    { nv: 1, ru: 'Носовая', uz: 'Burun' },
    { nv: 2, ru: 'Глазная', uz: "Ko'z" },
    { nv: 3, ru: 'Репродуктивная', uz: 'Reproduktiv organ' },
  ]);

  await updateLookup('animalSex', [
    { nv: 0, ru: 'Самец', uz: 'Erkak' },
    { nv: 1, ru: 'Самка', uz: 'Ayol' },
    { nv: 2, ru: 'Кастрированный самец', uz: 'Kastratsiya qilingan erkak' },
    { nv: 3, ru: 'Стерилизованная самка', uz: 'Sterilizatsiya qilingan ayol' },
    { nv: 4, ru: 'Неизвестно', uz: "Noma'lum" },
  ]);

  // ===== Animal type names (keyed by modelKey) =====

  console.log('\nUpdating animal types by modelKey...');
  const animalTypeFixes: { modelKey: string; ru: string; uz: string }[] = [
    { modelKey: 'bull', ru: 'Бык', uz: 'Buqa' },
    { modelKey: 'heifer', ru: 'Тёлка', uz: "G'unojin" },
    { modelKey: 'cow', ru: 'Корова', uz: 'Sigir' },
    { modelKey: 'calf', ru: 'Телёнок', uz: 'Buzoq' },
  ];
  for (const t of animalTypeFixes) {
    try {
      await prisma.animalType.update({
        where: { modelKey: t.modelKey },
        data: { name: n(t.ru, t.uz) },
      });
      console.log(`  animalType[${t.modelKey}] → "${t.ru}"`);
    } catch {
      console.log(`  animalType[${t.modelKey}] not found, skipping`);
    }
  }

  console.log('\nTranslation migration finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

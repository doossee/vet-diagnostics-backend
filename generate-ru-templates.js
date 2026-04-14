/**
 * Генерация Excel-шаблонов с русскими названиями и заголовками колонок.
 * Запуск: node generate-ru-templates.js
 */
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'ru-templates');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

async function generateTemplate(filename, sheetName, columns) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  sheet.columns = columns.map((c) => ({
    header: c.header,
    key: c.key,
    width: c.width ?? 22,
  }));

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3E8F5' } };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 20;

  const exampleData = {};
  columns.forEach((c) => { exampleData[c.key] = c.example ?? ''; });
  sheet.addRow(exampleData);

  await workbook.xlsx.writeFile(path.join(OUTPUT_DIR, filename));
  console.log(`✓ ${filename}`);
}

async function main() {
  // ─── Диагностика: анализы ──────────────────────────────────────────────────

  await generateTemplate('анализ-крови-шаблон.xlsx', 'Анализ крови', [
    { key: 'animalId',          header: 'ID животного',                       example: 'uuid-here', width: 38 },
    { key: 'erythrocyteCount',  header: 'Эритроциты',                         example: 7.5 },
    { key: 'leukocyteCount',    header: 'Лейкоциты',                          example: 8.0 },
    { key: 'thrombocyteCount',  header: 'Тромбоциты',                         example: 300 },
    { key: 'coe',               header: 'СОЭ',                                example: 2.5 },
    { key: 'waterPercentage',   header: 'Вода (%)',                           example: 78 },
    { key: 'dryResidue',        header: 'Сухой остаток (%)',                  example: 22 },
    { key: 'glutathione',       header: 'Глутатион (ммоль/л)',                example: 1.2 },
    { key: 'hemoglobin',        header: 'Гемоглобин (г/л)',                   example: 120 },
    { key: 'totalProtein',      header: 'Общий белок (г/л)',                  example: 75 },
    { key: 'albumin',           header: 'Альбумин (%)',                       example: 45 },
    { key: 'alphaGlobulin',     header: 'α-Глобулин (%)',                     example: 12 },
    { key: 'betaGlobulin',      header: 'β-Глобулин (%)',                     example: 15 },
    { key: 'gammaGlobulin',     header: 'γ-Глобулин (%)',                     example: 20 },
    { key: 'residualNitrogen',  header: 'Остаточный азот (ммоль/л)',          example: 18 },
    { key: 'urea',              header: 'Мочевина (ммоль/л)',                 example: 5.5 },
    { key: 'uricAcid',          header: 'Мочевая кислота (ммоль/л)',          example: 0.3 },
    { key: 'creatinine',        header: 'Креатинин (мкмоль/л)',               example: 90 },
    { key: 'alkalineReserve',   header: 'Щелочной резерв (об% СО2)',          example: 55 },
    { key: 'glucose',           header: 'Глюкоза (ммоль/л)',                  example: 4.5 },
    { key: 'ketoneBodies',      header: 'Кетоновые тела (г/л)',               example: 0.05 },
    { key: 'totalBilirubin',    header: 'Общий билирубин (мкмоль/л)',         example: 8 },
    { key: 'directBilirubin',   header: 'Прямой билирубин (мкмоль/л)',        example: 2 },
    { key: 'totalCholesterol',  header: 'Общий холестерин (ммоль/л)',         example: 4.5 },
    { key: 'totalLipids',       header: 'Общие липиды (г/л)',                 example: 5.5 },
    { key: 'phospholipids',     header: 'Фосфолипиды (г/л)',                  example: 2.1 },
    { key: 'lacticAcid',        header: 'Молочная кислота (ммоль/л)',         example: 1.2 },
    { key: 'pyruvicAcid',       header: 'Пировиноградная кислота (ммоль/л)', example: 0.08 },
    { key: 'citricAcid',        header: 'Лимонная кислота (ммоль/л)',         example: 0.12 },
    { key: 'carotene',          header: 'Каротин (мкмоль/л)',                 example: 3.5 },
    { key: 'vitaminA',          header: 'Витамин A (мкмоль/л)',               example: 1.5 },
    { key: 'vitaminC',          header: 'Витамин C (мкмоль/л)',               example: 40 },
    { key: 'organicPhosphorus', header: 'Органический фосфор (ммоль/л)',      example: 1.8 },
    { key: 'totalCalcium',      header: 'Общий кальций (ммоль/л)',            example: 2.5 },
    { key: 'creatine',          header: 'Креатин (ммоль/л)',                  example: 0.15 },
    { key: 'copper',            header: 'Медь (ммоль/л)',                     example: 0.015 },
    { key: 'zinc',              header: 'Цинк (ммоль/л)',                     example: 0.02 },
    { key: 'manganese',         header: 'Марганец (ммоль/л)',                 example: 0.001 },
    { key: 'cobalt',            header: 'Кобальт (ммоль/л)',                  example: 0.0003 },
    { key: 'vitaminB',          header: 'Витамин B',                          example: '' },
    { key: 'conclusion',        header: 'Заключение',                         example: '' },
  ]);

  await generateTemplate('клинический-осмотр-шаблон.xlsx', 'Клинический осмотр', [
    { key: 'animalId',           header: 'ID животного',                    example: 'uuid-here', width: 38 },
    { key: 'pulse',              header: 'Пульс (уд/мин)',                  example: 72, width: 18 },
    { key: 'temperature',        header: 'Температура (°C)',                example: 38.5, width: 20 },
    { key: 'respiratoryRate',    header: 'Частота дыхания (вдохов/мин)',    example: 18, width: 25 },
    { key: 'rumination',         header: 'Жвачка',                          example: 1, width: 20 },
    { key: 'rumenInfusoriaCount',header: 'Инфузории рубца',                 example: 500, width: 22 },
    { key: 'bodyTypeId',         header: 'ID состояния тела',               example: 'uuid-here', width: 38 },
    { key: 'obesityId',          header: 'ID упитанности',                  example: 'uuid-here', width: 38 },
    { key: 'bodyPositionId',     header: 'ID позы тела',                    example: 'uuid-here', width: 38 },
    { key: 'constitutionId',     header: 'ID конституции',                  example: 'uuid-here', width: 38 },
    { key: 'temperamentId',      header: 'ID темперамента',                 example: 'uuid-here', width: 38 },
    { key: 'woolId',             header: 'ID шерсти',                       example: 'uuid-here', width: 38 },
    { key: 'downId',             header: 'ID пуха',                         example: 'uuid-here', width: 38 },
    { key: 'hairId',             header: 'ID волос',                        example: 'uuid-here', width: 38 },
    { key: 'feathersId',         header: 'ID перьев',                       example: 'uuid-here', width: 38 },
    { key: 'skinColorId',        header: 'ID цвета кожи',                   example: 'uuid-here', width: 38 },
    { key: 'skinHumidityId',     header: 'ID влажности кожи',               example: 'uuid-here', width: 38 },
    { key: 'skinSmellId',        header: 'ID запаха кожи',                  example: 'uuid-here', width: 38 },
    { key: 'skinTempId',         header: 'ID температуры кожи',             example: 'uuid-here', width: 38 },
    { key: 'skinSurfaceId',      header: 'ID поверхности кожи',             example: 'uuid-here', width: 38 },
    { key: 'skinElasticityId',   header: 'ID эластичности кожи',            example: 'uuid-here', width: 38 },
    { key: 'skinSensitivityId',  header: 'ID чувствительности кожи',        example: 'uuid-here', width: 38 },
    { key: 'skinPainId',         header: 'ID болезненности кожи',           example: 'uuid-here', width: 38 },
    { key: 'lymphSizeId',        header: 'ID размера лимфоузла',            example: 'uuid-here', width: 38 },
    { key: 'lymphShapeId',       header: 'ID формы лимфоузла',              example: 'uuid-here', width: 38 },
    { key: 'lymphSurfaceId',     header: 'ID поверхности лимфоузла',        example: 'uuid-here', width: 38 },
    { key: 'lymphConsistencyId', header: 'ID консистенции лимфоузла',       example: 'uuid-here', width: 38 },
    { key: 'lymphTempId',        header: 'ID температуры лимфоузла',        example: 'uuid-here', width: 38 },
    { key: 'lymphPainId',        header: 'ID болезненности лимфоузла',      example: 'uuid-here', width: 38 },
    { key: 'lymphMobilityId',    header: 'ID подвижности лимфоузла',        example: 'uuid-here', width: 38 },
    { key: 'rumenFluidStateId',  header: 'ID состояния жидкости рубца',     example: 'uuid-here', width: 38 },
  ]);

  await generateTemplate('анализ-кала-шаблон.xlsx', 'Анализ кала', [
    { key: 'animalId',          header: 'ID животного',            example: 'uuid-here', width: 38 },
    { key: 'fecesColorId',      header: 'ID цвета кала',           example: 'uuid-here', width: 38 },
    { key: 'fecesSmellId',      header: 'ID запаха кала',          example: 'uuid-here', width: 38 },
    { key: 'fecesConsistencyId',header: 'ID консистенции кала',    example: 'uuid-here', width: 38 },
    { key: 'fecesFormId',       header: 'ID формы кала',           example: 'uuid-here', width: 38 },
    { key: 'amount',            header: 'Количество (кг/сутки)',   example: 15 },
    { key: 'undigestedFood',    header: 'Непереваренный корм (%)', example: 5 },
  ]);

  await generateTemplate('анализ-мочи-шаблон.xlsx', 'Анализ мочи', [
    { key: 'animalId',          header: 'ID животного',              example: 'uuid-here', width: 38 },
    { key: 'urineColorId',      header: 'ID цвета мочи',             example: 'uuid-here', width: 38 },
    { key: 'urineSmellId',      header: 'ID запаха мочи',            example: 'uuid-here', width: 38 },
    { key: 'urineClarityId',    header: 'ID прозрачности мочи',      example: 'uuid-here', width: 38 },
    { key: 'urineConsistencyId',header: 'ID консистенции мочи',      example: 'uuid-here', width: 38 },
    { key: 'ph',                header: 'pH (среда)',                 example: 6.5 },
    { key: 'acetone',           header: 'Ацетон (ммоль/л)',          example: 0.1 },
    { key: 'protein',           header: 'Белок (г/л)',               example: 0.0 },
    { key: 'bilirubin',         header: 'Билирубин (мкмоль/л)',      example: 0.0 },
    { key: 'urobilinogen',      header: 'Уробилиноген (мкмоль/л)',   example: 3.5 },
    { key: 'sugar',             header: 'Сахар (ммоль/л)',           example: 0.0 },
    { key: 'leukocytes',        header: 'Лейкоциты (кол-во)',        example: 2 },
    { key: 'epithelium',        header: 'Эпителий (кол-во)',         example: 1 },
    { key: 'microbialBodies',   header: 'Микробные тела (кол-во)',   example: 0 },
    { key: 'erythrocytes',      header: 'Эритроциты (кол-во)',       example: 0 },
    { key: 'saltCrystals',      header: 'Соли/кристаллы',            example: 0 },
    { key: 'amount',            header: 'Объём (л/сутки)',           example: 5.0 },
  ]);

  await generateTemplate('исследование-слизистых-шаблон.xlsx', 'Исследование слизистых', [
    { key: 'animalId',           header: 'ID животного',       example: 'uuid-here', width: 38 },
    { key: 'mucosaTypeId',       header: 'ID типа слизистой',  example: 'uuid-here', width: 38 },
    { key: 'mucosaAppearanceId', header: 'ID вида слизистой',  example: 'uuid-here', width: 38 },
  ]);

  // ─── Диагностика: справочники ──────────────────────────────────────────────

  const lookupCols3 = [
    { key: 'name_ru',      header: 'Название (рус)',    example: 'Пример' },
    { key: 'name_uz',      header: 'Название (уз)',     example: 'Namuna' },
    { key: 'numericValue', header: 'Числовое значение', example: 1, width: 18 },
  ];
  const lookupCols4 = [
    ...lookupCols3,
    { key: 'animalTypeId', header: 'ID типа животного', example: 'uuid-here', width: 38 },
  ];

  await generateTemplate('поза-тела-шаблон.xlsx',              'Позы тела',                  lookupCols4);
  await generateTemplate('тип-телосложения-шаблон.xlsx',       'Типы телосложения',          lookupCols4);
  await generateTemplate('конституция-шаблон.xlsx',            'Конституция',                lookupCols3);
  await generateTemplate('тип-пуха-шаблон.xlsx',               'Типы пуха',                  lookupCols3);
  await generateTemplate('тип-перьев-шаблон.xlsx',             'Типы перьев',                lookupCols3);
  await generateTemplate('тип-волос-шаблон.xlsx',              'Типы волос',                 lookupCols3);
  await generateTemplate('тип-шерсти-шаблон.xlsx',             'Типы шерсти',                lookupCols3);
  await generateTemplate('темперамент-шаблон.xlsx',            'Темперамент',                lookupCols3);
  await generateTemplate('тип-упитанности-шаблон.xlsx',        'Типы упитанности',           lookupCols3);
  await generateTemplate('состояние-жидкости-рубца-шаблон.xlsx','Состояние жидкости рубца',  lookupCols3);

  await generateTemplate('цвет-кала-шаблон.xlsx',              'Цвет кала',                  lookupCols4);
  await generateTemplate('консистенция-кала-шаблон.xlsx',      'Консистенция кала',          lookupCols4);
  await generateTemplate('форма-кала-шаблон.xlsx',             'Форма кала',                 lookupCols4);
  await generateTemplate('запах-кала-шаблон.xlsx',             'Запах кала',                 lookupCols4);

  await generateTemplate('прозрачность-мочи-шаблон.xlsx',      'Прозрачность мочи',          lookupCols4);
  await generateTemplate('цвет-мочи-шаблон.xlsx',              'Цвет мочи',                  lookupCols4);
  await generateTemplate('консистенция-мочи-шаблон.xlsx',      'Консистенция мочи',          lookupCols4);
  await generateTemplate('запах-мочи-шаблон.xlsx',             'Запах мочи',                 lookupCols4);

  await generateTemplate('цвет-кожи-шаблон.xlsx',              'Цвет кожи',                  lookupCols3);
  await generateTemplate('эластичность-кожи-шаблон.xlsx',      'Эластичность кожи',          lookupCols3);
  await generateTemplate('влажность-кожи-шаблон.xlsx',         'Влажность кожи',             lookupCols3);
  await generateTemplate('болезненность-кожи-шаблон.xlsx',     'Болезненность кожи',         lookupCols3);
  await generateTemplate('чувствительность-кожи-шаблон.xlsx',  'Чувствительность кожи',      lookupCols3);
  await generateTemplate('запах-кожи-шаблон.xlsx',             'Запах кожи',                 lookupCols3);
  await generateTemplate('поверхность-кожи-шаблон.xlsx',       'Поверхность кожи',           lookupCols3);
  await generateTemplate('температура-кожи-шаблон.xlsx',       'Температура кожи',           lookupCols3);

  await generateTemplate('консистенция-лимфоузлов-шаблон.xlsx','Консистенция лимфоузлов',    lookupCols3);
  await generateTemplate('подвижность-лимфоузлов-шаблон.xlsx', 'Подвижность лимфоузлов',     lookupCols3);
  await generateTemplate('болезненность-лимфоузлов-шаблон.xlsx','Болезненность лимфоузлов',  lookupCols3);
  await generateTemplate('форма-лимфоузлов-шаблон.xlsx',       'Форма лимфоузлов',           lookupCols3);
  await generateTemplate('размер-лимфоузлов-шаблон.xlsx',      'Размер лимфоузлов',          lookupCols3);
  await generateTemplate('поверхность-лимфоузлов-шаблон.xlsx', 'Поверхность лимфоузлов',     lookupCols3);
  await generateTemplate('температура-лимфоузлов-шаблон.xlsx', 'Температура лимфоузлов',     lookupCols3);

  await generateTemplate('тип-слизистой-шаблон.xlsx',          'Типы слизистой',             lookupCols3);
  await generateTemplate('вид-слизистой-шаблон.xlsx',          'Вид слизистой', [
    { key: 'name_ru',      header: 'Название (рус)',    example: 'Пример' },
    { key: 'name_uz',      header: 'Название (уз)',     example: 'Namuna' },
    { key: 'numericValue', header: 'Числовое значение', example: 1, width: 18 },
    { key: 'mucosaTypeId', header: 'ID типа слизистой', example: 'uuid-here', width: 38 },
    { key: 'animalTypeId', header: 'ID типа животного', example: 'uuid-here', width: 38 },
  ]);

  // ─── Инвентарь ────────────────────────────────────────────────────────────

  await generateTemplate('животные-шаблон.xlsx', 'Животные', [
    { key: 'animalNameCode', header: 'Код/Имя животного',              example: 'А-001', width: 24 },
    { key: 'arrivalDate',    header: 'Дата поступления (ГГГГ-ММ-ДД)', example: '2024-01-15', width: 28 },
    { key: 'birthYear',      header: 'Год рождения',                   example: 2022, width: 14 },
    { key: 'birthMonth',     header: 'Месяц рождения (1-12)',          example: 3, width: 22 },
    { key: 'farmerId',       header: 'ID фермера',                     example: 'uuid-here', width: 38 },
    { key: 'animalTypeId',   header: 'ID типа животного',              example: 'uuid-here', width: 38 },
    { key: 'animalBreedId',  header: 'ID породы',                      example: 'uuid-here', width: 38 },
    { key: 'animalColorId',  header: 'ID масти',                       example: 'uuid-here', width: 38 },
  ]);

  await generateTemplate('типы-животных-шаблон.xlsx', 'Типы животных', [
    { key: 'name_ru',       header: 'Название (рус)',      example: 'Корова' },
    { key: 'name_uz',       header: 'Название (уз)',       example: 'Sigir' },
    { key: 'modelKey',      header: 'Ключ модели',         example: 'cow', width: 18 },
    { key: 'parentId',      header: 'ID родителя',         example: '', width: 38 },
    { key: 'minAgeMonths',  header: 'Мин. возраст (мес)', example: 0, width: 16 },
    { key: 'maxAgeMonths',  header: 'Макс. возраст (мес)',example: 24, width: 16 },
  ]);

  await generateTemplate('породы-животных-шаблон.xlsx', 'Породы животных', [
    { key: 'name_ru', header: 'Название (рус)', example: 'Голштинская' },
    { key: 'name_uz', header: 'Название (уз)',  example: 'Golshtin' },
  ]);

  await generateTemplate('масти-животных-шаблон.xlsx', 'Масти животных', [
    { key: 'name_ru', header: 'Название (рус)', example: 'Чёрно-белая' },
    { key: 'name_uz', header: 'Название (уз)',  example: 'Qora-oq' },
  ]);

  await generateTemplate('пол-животного-шаблон.xlsx', 'Пол животного', lookupCols3);

  // ─── Управление ───────────────────────────────────────────────────────────

  await generateTemplate('регионы-шаблон.xlsx', 'Регионы', [
    { key: 'name_ru', header: 'Название (рус)', example: 'Ташкент' },
    { key: 'name_uz', header: 'Название (уз)',  example: 'Toshkent' },
  ]);

  await generateTemplate('районы-шаблон.xlsx', 'Районы', [
    { key: 'name_ru',  header: 'Название (рус)', example: 'Юнусабад' },
    { key: 'name_uz',  header: 'Название (уз)',  example: 'Yunusobod' },
    { key: 'regionId', header: 'ID региона',     example: 'uuid-here', width: 38 },
  ]);

  await generateTemplate('ветстанции-шаблон.xlsx', 'Ветстанции', [
    { key: 'name_ru',    header: 'Название (рус)', example: 'Ветстанция №1' },
    { key: 'name_uz',    header: 'Название (уз)',  example: 'Vet stansiya №1' },
    { key: 'address',    header: 'Адрес',          example: 'ул. Ленина 1', width: 30 },
    { key: 'districtId', header: 'ID района',      example: 'uuid-here', width: 38 },
  ]);

  // ─── Медицина ─────────────────────────────────────────────────────────────

  await generateTemplate('болезни-шаблон.xlsx', 'Болезни', [
    { key: 'name_ru',           header: 'Название (рус)',        example: 'Ящур' },
    { key: 'name_uz',           header: 'Название (уз)',         example: 'Tarvaqay' },
    { key: 'diseaseCategoryId', header: 'ID категории болезни',  example: 'uuid-here', width: 38 },
  ]);

  await generateTemplate('категории-болезней-шаблон.xlsx', 'Категории болезней', [
    { key: 'name_ru',  header: 'Название (рус)',         example: 'Инфекционные' },
    { key: 'name_uz',  header: 'Название (уз)',          example: 'Yuqumli' },
    { key: 'parentId', header: 'ID родителя (необязат.)',example: '', width: 38 },
  ]);

  await generateTemplate('препараты-профилактики-шаблон.xlsx', 'Препараты профилактики', [
    { key: 'name_ru', header: 'Название (рус)',                    example: 'Вакцина ящура' },
    { key: 'name_uz', header: 'Название (уз)',                     example: 'Tarvaqay vaktsinasi' },
    { key: 'type',    header: 'Тип (VACCINE/DEWORMING/TREATMENT)', example: 'VACCINE', width: 30 },
  ]);

  await generateTemplate('детали-профилактики-шаблон.xlsx', 'Детали профилактики', [
    { key: 'name_ru', header: 'Название (рус)', example: 'Доза 2мл' },
    { key: 'name_uz', header: 'Название (уз)',  example: '2ml doza' },
    { key: 'itemId',  header: 'ID препарата',   example: 'uuid-here', width: 38 },
  ]);

  console.log(`\nВсе шаблоны сохранены в папке: ${OUTPUT_DIR}`);
}

main().catch(console.error);

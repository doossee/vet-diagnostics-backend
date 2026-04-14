/**
 * Updates all controllers to use Russian headers in generateTemplate + parseFile,
 * removes mapped() remapping blocks (now unnecessary since parseFile returns rows
 * keyed by `key`), and regenerates all .xlsx template files.
 */
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const SRC = path.join(__dirname, 'src');
const TEMPLATES_DIR = path.join(__dirname, 'templates');

// ─── Column definitions per module ───────────────────────────────────────────

const SIMPLE = [
  { key: 'name_ru', header: 'Название (рус)', example: 'Пример' },
  { key: 'name_uz', header: 'Название (уз)', example: 'Namuna' },
  { key: 'numericValue', header: 'Числовое значение', example: 1, width: 18 },
];

const SIMPLE_WITH_ANIMAL_TYPE = [
  { key: 'name_ru', header: 'Название (рус)', example: 'Пример' },
  { key: 'name_uz', header: 'Название (уз)', example: 'Namuna' },
  { key: 'numericValue', header: 'Числовое значение', example: 1, width: 18 },
  { key: 'animalTypeId', header: 'ID типа животного', example: 'uuid-here', width: 38 },
];

const NAME_ONLY = [
  { key: 'name_ru', header: 'Название (рус)', example: 'Пример' },
  { key: 'name_uz', header: 'Название (уз)', example: 'Namuna' },
];

const MODULES = {
  // ── Group A: simple lookup tables ──────────────────────────────────────────
  'diagnostics/body-position':     { sheet: 'Body Positions',      cols: SIMPLE },
  'diagnostics/body-type':         { sheet: 'Body Types',          cols: SIMPLE },
  'diagnostics/constitution':      { sheet: 'Constitutions',       cols: SIMPLE },
  'diagnostics/down-type':         { sheet: 'Down Types',          cols: SIMPLE },
  'diagnostics/feather-type':      { sheet: 'Feather Types',       cols: SIMPLE },
  'diagnostics/hair-type':         { sheet: 'Hair Types',          cols: SIMPLE },
  'diagnostics/lymph-consistency': { sheet: 'Lymph Consistencies', cols: SIMPLE },
  'diagnostics/lymph-mobility':    { sheet: 'Lymph Mobilities',    cols: SIMPLE },
  'diagnostics/lymph-pain':        { sheet: 'Lymph Pain',          cols: SIMPLE },
  'diagnostics/lymph-shape':       { sheet: 'Lymph Shapes',        cols: SIMPLE },
  'diagnostics/lymph-size':        { sheet: 'Lymph Sizes',         cols: SIMPLE },
  'diagnostics/lymph-surface':     { sheet: 'Lymph Surfaces',      cols: SIMPLE },
  'diagnostics/lymph-temp':        { sheet: 'Lymph Temperatures',  cols: SIMPLE },
  'diagnostics/mucosa-type':       { sheet: 'Mucosa Types',        cols: SIMPLE },
  'diagnostics/obesity-type':      { sheet: 'Obesity Types',       cols: SIMPLE },
  'diagnostics/rumen-fluid-state': { sheet: 'Rumen Fluid States',  cols: SIMPLE },
  'diagnostics/skin-color':        { sheet: 'Skin Colors',         cols: SIMPLE },
  'diagnostics/skin-elasticity':   { sheet: 'Skin Elasticities',   cols: SIMPLE },
  'diagnostics/skin-humidity':     { sheet: 'Skin Humidity',       cols: SIMPLE },
  'diagnostics/skin-pain':         { sheet: 'Skin Pain',           cols: SIMPLE },
  'diagnostics/skin-sensitivity':  { sheet: 'Skin Sensitivities',  cols: SIMPLE },
  'diagnostics/skin-smell':        { sheet: 'Skin Smells',         cols: SIMPLE },
  'diagnostics/skin-surface':      { sheet: 'Skin Surfaces',       cols: SIMPLE },
  'diagnostics/skin-temp':         { sheet: 'Skin Temperatures',   cols: SIMPLE },
  'diagnostics/temperament':       { sheet: 'Temperaments',        cols: SIMPLE },
  'diagnostics/wool-type':         { sheet: 'Wool Types',          cols: SIMPLE },
  'inventory/animal-sex':          { sheet: 'Animal Sexes',        cols: SIMPLE },

  // ── Group B: with animalTypeId ─────────────────────────────────────────────
  'diagnostics/feces-color':        { sheet: 'Feces Colors',         cols: SIMPLE_WITH_ANIMAL_TYPE },
  'diagnostics/feces-consistency':  { sheet: 'Feces Consistencies',  cols: SIMPLE_WITH_ANIMAL_TYPE },
  'diagnostics/feces-form':         { sheet: 'Feces Forms',          cols: SIMPLE_WITH_ANIMAL_TYPE },
  'diagnostics/feces-smell':        { sheet: 'Feces Smells',         cols: SIMPLE_WITH_ANIMAL_TYPE },
  'diagnostics/urine-clarity':      { sheet: 'Urine Clarities',      cols: SIMPLE_WITH_ANIMAL_TYPE },
  'diagnostics/urine-color':        { sheet: 'Urine Colors',         cols: SIMPLE_WITH_ANIMAL_TYPE },
  'diagnostics/urine-consistency':  { sheet: 'Urine Consistencies',  cols: SIMPLE_WITH_ANIMAL_TYPE },
  'diagnostics/urine-smell':        { sheet: 'Urine Smells',         cols: SIMPLE_WITH_ANIMAL_TYPE },

  // ── Special ─────────────────────────────────────────────────────────────────
  'diagnostics/mucosa-appearance': {
    sheet: 'Mucosa Appearances',
    cols: [
      { key: 'name_ru',       header: 'Название (рус)',     example: 'Пример' },
      { key: 'name_uz',       header: 'Название (уз)',      example: 'Namuna' },
      { key: 'numericValue',  header: 'Числовое значение',  example: 1,            width: 18 },
      { key: 'mucosaTypeId',  header: 'ID типа слизистой',  example: 'uuid-here',  width: 38 },
      { key: 'animalTypeId',  header: 'ID типа животного',  example: 'uuid-here',  width: 38 },
    ],
  },

  // ── Exams ────────────────────────────────────────────────────────────────────
  'diagnostics/blood-exam': {
    sheet: 'Blood Exam',
    cols: [
      { key: 'animalId',           header: 'ID животного',                        example: 'uuid-here', width: 38 },
      { key: 'erythrocyteCount',   header: 'Эритроциты (×10¹²/л)',                example: 7.5 },
      { key: 'leukocyteCount',     header: 'Лейкоциты (×10⁹/л)',                  example: 8.0 },
      { key: 'thrombocyteCount',   header: 'Тромбоциты (×10⁹/л)',                 example: 300 },
      { key: 'coe',                header: 'СОЭ (мм/ч)',                           example: 2.5 },
      { key: 'waterPercentage',    header: 'Вода (%)',                             example: 78 },
      { key: 'dryResidue',         header: 'Сухой остаток (%)',                    example: 22 },
      { key: 'glutathione',        header: 'Глутатион (ммоль/л)',                  example: 1.2 },
      { key: 'hemoglobin',         header: 'Гемоглобин (г/л)',                     example: 120 },
      { key: 'totalProtein',       header: 'Общий белок (г/л)',                    example: 75 },
      { key: 'albumin',            header: 'Альбумин (%)',                         example: 45 },
      { key: 'alphaGlobulin',      header: 'Альфа-глобулин (%)',                   example: 12 },
      { key: 'betaGlobulin',       header: 'Бета-глобулин (%)',                    example: 15 },
      { key: 'gammaGlobulin',      header: 'Гамма-глобулин (%)',                   example: 20 },
      { key: 'residualNitrogen',   header: 'Остаточный азот (ммоль/л)',            example: 18 },
      { key: 'urea',               header: 'Мочевина (ммоль/л)',                   example: 5.5 },
      { key: 'uricAcid',           header: 'Мочевая кислота (ммоль/л)',            example: 0.3 },
      { key: 'creatinine',         header: 'Креатинин (мкмоль/л)',                 example: 90 },
      { key: 'alkalineReserve',    header: 'Щелочной резерв (об% СО2)',            example: 55 },
      { key: 'glucose',            header: 'Глюкоза (ммоль/л)',                    example: 4.5 },
      { key: 'ketoneBodies',       header: 'Кетоновые тела (г/л)',                 example: 0.05 },
      { key: 'totalBilirubin',     header: 'Общий билирубин (мкмоль/л)',           example: 8 },
      { key: 'directBilirubin',    header: 'Прямой билирубин (мкмоль/л)',          example: 2 },
      { key: 'totalCholesterol',   header: 'Общий холестерин (ммоль/л)',           example: 4.5 },
      { key: 'totalLipids',        header: 'Общие липиды (г/л)',                   example: 5.5 },
      { key: 'phospholipids',      header: 'Фосфолипиды (г/л)',                    example: 2.1 },
      { key: 'lacticAcid',         header: 'Молочная кислота (ммоль/л)',           example: 1.2 },
      { key: 'pyruvicAcid',        header: 'Пировиноградная кислота (ммоль/л)',    example: 0.08 },
      { key: 'citricAcid',         header: 'Лимонная кислота (ммоль/л)',           example: 0.12 },
      { key: 'carotene',           header: 'Каротин (мкмоль/л)',                   example: 3.5 },
      { key: 'vitaminA',           header: 'Витамин А (мкмоль/л)',                 example: 1.5 },
      { key: 'vitaminC',           header: 'Витамин С (мкмоль/л)',                 example: 40 },
      { key: 'organicPhosphorus',  header: 'Органический фосфор (ммоль/л)',        example: 1.8 },
      { key: 'totalCalcium',       header: 'Общий кальций (ммоль/л)',              example: 2.5 },
      { key: 'creatine',           header: 'Креатин (ммоль/л)',                    example: 0.15 },
      { key: 'copper',             header: 'Медь (ммоль/л)',                       example: 0.015 },
      { key: 'zinc',               header: 'Цинк (ммоль/л)',                       example: 0.02 },
      { key: 'manganese',          header: 'Марганец (ммоль/л)',                   example: 0.001 },
      { key: 'cobalt',             header: 'Кобальт (ммоль/л)',                    example: 0.0003 },
      { key: 'vitaminB',           header: 'Витамин В',                            example: '' },
      { key: 'conclusion',         header: 'Заключение',                           example: '' },
    ],
  },

  'diagnostics/urine-exam': {
    sheet: 'Urine Exam',
    cols: [
      { key: 'animalId',             header: 'ID животного',              example: 'uuid-here', width: 38 },
      { key: 'urineColorId',         header: 'ID цвета мочи',             example: 'uuid-here', width: 38 },
      { key: 'urineSmellId',         header: 'ID запаха мочи',            example: 'uuid-here', width: 38 },
      { key: 'urineClarityId',       header: 'ID прозрачности мочи',      example: 'uuid-here', width: 38 },
      { key: 'urineConsistencyId',   header: 'ID консистенции мочи',      example: 'uuid-here', width: 38 },
      { key: 'ph',                   header: 'pH (среда)',                 example: 6.5 },
      { key: 'acetone',              header: 'Ацетон (ммоль/л)',           example: 0.1 },
      { key: 'protein',              header: 'Белок (г/л)',                example: 0.0 },
      { key: 'bilirubin',            header: 'Билирубин (мкмоль/л)',       example: 0.0 },
      { key: 'urobilinogen',         header: 'Уробилиноген (мкмоль/л)',    example: 3.5 },
      { key: 'sugar',                header: 'Сахар (ммоль/л)',            example: 0.0 },
      { key: 'leukocytes',           header: 'Лейкоциты (кол-во)',         example: 2 },
      { key: 'epithelium',           header: 'Эпителий (кол-во)',          example: 1 },
      { key: 'microbialBodies',      header: 'Микробные тела (кол-во)',    example: 0 },
      { key: 'erythrocytes',         header: 'Эритроциты (кол-во)',        example: 0 },
      { key: 'saltCrystals',         header: 'Соли/кристаллы',             example: 0 },
      { key: 'amount',               header: 'Объём (л/сутки)',            example: 5.0 },
    ],
  },

  'diagnostics/feces-exam': {
    sheet: 'Feces Exam',
    cols: [
      { key: 'animalId',             header: 'ID животного',              example: 'uuid-here', width: 38 },
      { key: 'fecesColorId',         header: 'ID цвета кала',             example: 'uuid-here', width: 38 },
      { key: 'fecesSmellId',         header: 'ID запаха кала',            example: 'uuid-here', width: 38 },
      { key: 'fecesConsistencyId',   header: 'ID консистенции кала',      example: 'uuid-here', width: 38 },
      { key: 'fecesFormId',          header: 'ID формы кала',             example: 'uuid-here', width: 38 },
      { key: 'amount',               header: 'Количество (кг/сутки)',     example: 15 },
      { key: 'undigestedFood',       header: 'Непереваренный корм (%)',   example: 5 },
    ],
  },

  'diagnostics/mucosa-exam': {
    sheet: 'Mucosa Exam',
    cols: [
      { key: 'animalId',             header: 'ID животного',              example: 'uuid-here', width: 38 },
      { key: 'mucosaTypeId',         header: 'ID типа слизистой',         example: 'uuid-here', width: 38 },
      { key: 'mucosaAppearanceId',   header: 'ID вида слизистой',         example: 'uuid-here', width: 38 },
    ],
  },

  'diagnostics/clinical-exam': {
    sheet: 'Clinical Exam',
    cols: [
      { key: 'animalId',             header: 'ID животного',                   example: 'uuid-here', width: 38 },
      { key: 'pulse',                header: 'Пульс (уд/мин)',                  example: 72,          width: 18 },
      { key: 'temperature',          header: 'Температура (°C)',                example: 38.5,        width: 20 },
      { key: 'respiratoryRate',      header: 'Частота дыхания (вдохов/мин)',    example: 18,          width: 28 },
      { key: 'rumination',           header: 'Жвачка',                          example: 1,           width: 14 },
      { key: 'rumenInfusoriaCount',  header: 'Инфузории рубца',                 example: 500,         width: 20 },
      { key: 'bodyTypeId',           header: 'ID состояния тела',               example: 'uuid-here', width: 38 },
      { key: 'obesityId',            header: 'ID упитанности',                  example: 'uuid-here', width: 38 },
      { key: 'bodyPositionId',       header: 'ID позы тела',                    example: 'uuid-here', width: 38 },
      { key: 'constitutionId',       header: 'ID конституции',                  example: 'uuid-here', width: 38 },
      { key: 'temperamentId',        header: 'ID темперамента',                 example: 'uuid-here', width: 38 },
      { key: 'woolId',               header: 'ID шерсти',                       example: 'uuid-here', width: 38 },
      { key: 'downId',               header: 'ID пуха',                         example: 'uuid-here', width: 38 },
      { key: 'hairId',               header: 'ID волос',                        example: 'uuid-here', width: 38 },
      { key: 'feathersId',           header: 'ID перьев',                       example: 'uuid-here', width: 38 },
      { key: 'skinColorId',          header: 'ID цвета кожи',                   example: 'uuid-here', width: 38 },
      { key: 'skinHumidityId',       header: 'ID влажности кожи',               example: 'uuid-here', width: 38 },
      { key: 'skinSmellId',          header: 'ID запаха кожи',                  example: 'uuid-here', width: 38 },
      { key: 'skinTempId',           header: 'ID температуры кожи',             example: 'uuid-here', width: 38 },
      { key: 'skinSurfaceId',        header: 'ID поверхности кожи',             example: 'uuid-here', width: 38 },
      { key: 'skinElasticityId',     header: 'ID эластичности кожи',            example: 'uuid-here', width: 38 },
      { key: 'skinSensitivityId',    header: 'ID чувствительности кожи',        example: 'uuid-here', width: 38 },
      { key: 'skinPainId',           header: 'ID болезненности кожи',           example: 'uuid-here', width: 38 },
      { key: 'lymphSizeId',          header: 'ID размера лимфоузла',            example: 'uuid-here', width: 38 },
      { key: 'lymphShapeId',         header: 'ID формы лимфоузла',              example: 'uuid-here', width: 38 },
      { key: 'lymphSurfaceId',       header: 'ID поверхности лимфоузла',        example: 'uuid-here', width: 38 },
      { key: 'lymphConsistencyId',   header: 'ID консистенции лимфоузла',       example: 'uuid-here', width: 38 },
      { key: 'lymphTempId',          header: 'ID температуры лимфоузла',        example: 'uuid-here', width: 38 },
      { key: 'lymphPainId',          header: 'ID болезненности лимфоузла',      example: 'uuid-here', width: 38 },
      { key: 'lymphMobilityId',      header: 'ID подвижности лимфоузла',        example: 'uuid-here', width: 38 },
      { key: 'rumenFluidStateId',    header: 'ID состояния жидкости рубца',     example: 'uuid-here', width: 38 },
    ],
  },

  // ── Inventory ───────────────────────────────────────────────────────────────
  'inventory/animal': {
    sheet: 'Animals',
    cols: [
      { key: 'animalNameCode',  header: 'Код/Имя животного',              example: 'KOV-001',   width: 24 },
      { key: 'arrivalDate',     header: 'Дата поступления (ГГГГ-ММ-ДД)', example: '2024-01-15', width: 28 },
      { key: 'birthYear',       header: 'Год рождения',                   example: 2022,         width: 14 },
      { key: 'birthMonth',      header: 'Месяц рождения (1-12)',          example: 6,            width: 22 },
      { key: 'farmerId',        header: 'ID фермера',                     example: 'uuid-here',  width: 38 },
      { key: 'animalTypeId',    header: 'ID типа животного',              example: 'uuid-here',  width: 38 },
      { key: 'animalBreedId',   header: 'ID породы',                      example: 'uuid-here',  width: 38 },
      { key: 'animalColorId',   header: 'ID масти',                       example: 'uuid-here',  width: 38 },
    ],
  },

  'inventory/animal-type': {
    sheet: 'Animal Types',
    cols: [
      { key: 'name_ru',       header: 'Название (рус)',        example: 'Корова' },
      { key: 'name_uz',       header: 'Название (уз)',         example: 'Sigir' },
      { key: 'modelKey',      header: 'Ключ модели',           example: 'cow',   width: 18 },
      { key: 'parentId',      header: 'ID родителя',           example: '',      width: 38 },
      { key: 'minAgeMonths',  header: 'Мин. возраст (мес)',    example: 0,       width: 20 },
      { key: 'maxAgeMonths',  header: 'Макс. возраст (мес)',   example: 24,      width: 20 },
    ],
  },

  'inventory/animal-breed': { sheet: 'Animal Breeds', cols: NAME_ONLY },
  'inventory/animal-color': { sheet: 'Animal Colors', cols: NAME_ONLY },

  // ── Management ──────────────────────────────────────────────────────────────
  'management/region': { sheet: 'Regions', cols: NAME_ONLY },

  'management/district': {
    sheet: 'Districts',
    cols: [
      { key: 'name_ru',   header: 'Название (рус)', example: 'Юнусабад' },
      { key: 'name_uz',   header: 'Название (уз)',  example: 'Yunusobod' },
      { key: 'regionId',  header: 'ID региона',     example: 'uuid-here', width: 38 },
    ],
  },

  'management/vet-station': {
    sheet: 'Vet Stations',
    cols: [
      { key: 'name_ru',    header: 'Название (рус)', example: 'Ветстанция №1' },
      { key: 'name_uz',    header: 'Название (уз)',  example: 'Vet stansiya №1' },
      { key: 'address',    header: 'Адрес',          example: 'ул. Ленина 1',   width: 30 },
      { key: 'districtId', header: 'ID района',      example: 'uuid-here',      width: 38 },
    ],
  },

  // ── Medical ─────────────────────────────────────────────────────────────────
  'medical/disease-category': {
    sheet: 'Disease Categories',
    cols: [
      { key: 'name_ru',   header: 'Название (рус)',         example: 'Инфекционные болезни' },
      { key: 'name_uz',   header: 'Название (уз)',          example: 'Yuqumli kasalliklar' },
      { key: 'parentId',  header: 'ID родителя (необязат.)', example: '', width: 38 },
    ],
  },

  'medical/disease': {
    sheet: 'Diseases',
    cols: [
      { key: 'name_ru',            header: 'Название (рус)',         example: 'Ящур' },
      { key: 'name_uz',            header: 'Название (уз)',          example: 'Tarvaqay' },
      { key: 'diseaseCategoryId',  header: 'ID категории болезни',   example: 'uuid-here', width: 38 },
    ],
  },

  'medical/prophylaxis-item': {
    sheet: 'Prophylaxis Items',
    cols: [
      { key: 'name_ru', header: 'Название (рус)',                       example: 'Вакцина ящура' },
      { key: 'name_uz', header: 'Название (уз)',                        example: 'Tarvaqay vaktsinasi' },
      { key: 'type',    header: 'Тип (VACCINE/DEWORMING/TREATMENT)',    example: 'VACCINE', width: 32 },
    ],
  },

  'medical/prophylaxis-detail': {
    sheet: 'Prophylaxis Details',
    cols: [
      { key: 'name_ru', header: 'Название (рус)', example: 'Доза 2мл' },
      { key: 'name_uz', header: 'Название (уз)',  example: '2ml doza' },
      { key: 'itemId',  header: 'ID препарата',   example: 'uuid-here', width: 38 },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function colsToTs(cols) {
  return cols.map((c) => {
    const parts = [`key: '${c.key}'`, `header: '${c.header}'`];
    if (c.example !== undefined) {
      parts.push(`example: ${typeof c.example === 'string' ? `'${c.example}'` : c.example}`);
    }
    if (c.width !== undefined) parts.push(`width: ${c.width}`);
    return `      { ${parts.join(', ')} }`;
  }).join(',\n');
}

function buildParseFileCols(cols) {
  return cols.map((c) => `      { key: '${c.key}', header: '${c.header}' }`).join(',\n');
}

// ─── Update controllers ───────────────────────────────────────────────────────

function updateController(modulePath, { sheet, cols }) {
  // Find the controller file
  const parts = modulePath.split('/');
  const slug = parts[parts.length - 1];
  const ctrlPath = path.join(SRC, 'modules', modulePath, `${slug}.controller.ts`);

  if (!fs.existsSync(ctrlPath)) {
    console.log(`SKIP (not found): ${ctrlPath}`);
    return;
  }

  let content = fs.readFileSync(ctrlPath, 'utf-8');

  // ── 1. Replace generateTemplate columns block ─────────────────────────────
  // Match the array literal inside generateTemplate([ ... ], 'Sheet Name')
  const tplRegex = /(\bthis\.excelService\.generateTemplate\(\s*\[)([\s\S]*?)(\],\s*'[^']+'\s*\))/;
  const newColsTs = colsToTs(cols);
  content = content.replace(tplRegex, (_, open, _oldCols, close) => {
    return `${open}\n${newColsTs},\n    ${close}`;
  });

  // ── 2. Replace parseFile call + optional mapped block ─────────────────────
  // Pattern A: complex controllers with const rows = ...; const mapped = ...; return ...service.import(mapped)
  // Pattern B: simple controllers: const rows = ...; return ...service.import(rows)

  const parseFileColsTs = buildParseFileCols(cols);

  // Try to match and replace the entire importFromExcel body
  // We look for: parseFile(file, [...]) up to and including the return statement
  const complexImportRegex = /(\bconst rows = await this\.excelService\.parseFile\(file,\s*\[)[\s\S]*?(\]\s*\);)\s*(?:\/\/[^\n]*)?\s*const mapped = rows\.map[\s\S]*?;\s*(return await this\.\w+\.importFromExcel\(mapped\);)/;
  const simpleImportRegex = /(\bconst rows = await this\.excelService\.parseFile\(file,\s*\[)[\s\S]*?(\]\s*\);)\s*(return await this\.\w+\.importFromExcel\(rows\);)/;

  if (complexImportRegex.test(content)) {
    content = content.replace(complexImportRegex, (_, _open, _close, ret) => {
      // Convert ret from importFromExcel(mapped) to importFromExcel(rows)
      const newRet = ret.replace('(mapped)', '(rows)');
      return `const rows = await this.excelService.parseFile(file, [\n${parseFileColsTs},\n    ]);\n    ${newRet}`;
    });
  } else if (simpleImportRegex.test(content)) {
    content = content.replace(simpleImportRegex, (_, _open, _close, ret) => {
      return `const rows = await this.excelService.parseFile(file, [\n${parseFileColsTs},\n    ]);\n    ${ret}`;
    });
  } else {
    console.log(`  WARN: could not update parseFile call in ${slug}.controller.ts`);
  }

  fs.writeFileSync(ctrlPath, content, 'utf-8');
  console.log(`✓ ${slug}.controller.ts`);
}

// ─── Generate Excel files ─────────────────────────────────────────────────────

async function generateExcel(filename, sheetName, columns) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);
  sheet.columns = columns.map((c) => ({ header: c.header, key: c.key, width: c.width ?? 22 }));
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3E8F5' } };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 20;
  const exampleData = {};
  columns.forEach((c) => { exampleData[c.key] = c.example ?? ''; });
  sheet.addRow(exampleData);
  await workbook.xlsx.writeFile(path.join(TEMPLATES_DIR, filename));
}

async function main() {
  console.log('=== Updating controllers ===');
  for (const [modulePath, spec] of Object.entries(MODULES)) {
    updateController(modulePath, spec);
  }

  console.log('\n=== Regenerating Excel templates ===');
  for (const [modulePath, { sheet, cols }] of Object.entries(MODULES)) {
    const slug = modulePath.split('/').pop();
    await generateExcel(`${slug}.xlsx`, sheet, cols);
    console.log(`✓ ${slug}.xlsx`);
  }

  console.log('\nDone.');
}

main().catch(console.error);

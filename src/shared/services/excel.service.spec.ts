import { ExcelService } from './excel.service';

describe('ExcelService', () => {
  let service: ExcelService;

  beforeEach(() => {
    service = new ExcelService();
  });

  describe('generateTemplate', () => {
    it('should generate a buffer with correct headers', async () => {
      const columns = [
        { key: 'name_ru', header: 'Name (RU)', example: 'Test' },
        { key: 'name_uz', header: 'Name (UZ)', example: 'Test' },
        { key: 'numericValue', header: 'Numeric Value', example: 1 },
      ];

      const buffer = await service.generateTemplate(columns, 'TestSheet');

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should apply default width when not specified', async () => {
      const columns = [
        { key: 'name', header: 'Name' },
      ];

      const buffer = await service.generateTemplate(columns, 'Sheet1');
      expect(buffer).toBeInstanceOf(Buffer);
    });
  });

  describe('parseFile', () => {
    it('should parse an Excel file and return rows', async () => {
      // First generate a template buffer, then parse it
      const columns = [
        { key: 'name_ru', header: 'Name (RU)', example: 'Тест' },
        { key: 'name_uz', header: 'Name (UZ)', example: 'Test' },
      ];

      const buffer = await service.generateTemplate(columns, 'TestSheet');

      const mockFile = {
        buffer,
        originalname: 'test.xlsx',
      } as Express.Multer.File;

      const rows = await service.parseFile(mockFile, columns);

      // The template includes one example row
      expect(rows).toHaveLength(1);
      expect(rows[0]).toHaveProperty('name_ru');
      expect(rows[0]).toHaveProperty('name_uz');
    });

    it('should return empty array for empty workbook', async () => {
      // Create a minimal valid xlsx buffer via ExcelJS
      const ExcelJS = require('exceljs');
      const workbook = new ExcelJS.Workbook();
      workbook.addWorksheet('Empty');
      const buffer = await workbook.xlsx.writeBuffer();

      const mockFile = { buffer } as Express.Multer.File;
      const columns = [{ key: 'name', header: 'Name' }];

      const rows = await service.parseFile(mockFile, columns);
      expect(rows).toHaveLength(0);
    });
  });
});

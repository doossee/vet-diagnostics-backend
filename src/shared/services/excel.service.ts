import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

export interface ExcelColumn {
  key: string;
  header: string;
  example?: string | number;
  width?: number;
}

@Injectable()
export class ExcelService {
  async generateTemplate(
    columns: ExcelColumn[],
    sheetName: string,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(sheetName);

    sheet.columns = columns.map((c) => ({
      header: c.header,
      key: c.key,
      width: c.width ?? 22,
    }));

    // Style header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3E8F5' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;

    // Add example row
    const exampleData: Record<string, any> = {};
    columns.forEach((c) => {
      exampleData[c.key] = c.example ?? '';
    });
    sheet.addRow(exampleData);

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as unknown as Buffer;
  }

  async parseFile(
    file: Express.Multer.File,
    columns: ExcelColumn[],
  ): Promise<Record<string, any>[]> {
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(file.buffer as any);

    const sheet = workbook.worksheets[0];
    if (!sheet) return [];

    const rows: Record<string, any>[] = [];
    const headerRow = sheet.getRow(1);

    // Build header-text → key mapping
    const headerToKey: Record<string, string> = {};
    columns.forEach((c) => {
      headerToKey[c.header] = c.key;
    });

    // Map column number → field key
    const headerMap: Record<number, string> = {};
    headerRow.eachCell((cell, colNumber) => {
      const headerVal = String(cell.value ?? '').trim();
      const key = headerToKey[headerVal];
      if (key) {
        headerMap[colNumber] = key;
      }
    });

    sheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return; // skip header
      const rowData: Record<string, any> = {};
      row.eachCell((cell, colNumber) => {
        const fieldKey = headerMap[colNumber];
        if (fieldKey) {
          rowData[fieldKey] = cell.value;
        }
      });
      // Skip completely empty rows
      if (
        Object.values(rowData).some(
          (v) => v !== null && v !== undefined && v !== '',
        )
      ) {
        rows.push(rowData);
      }
    });

    return rows;
  }
}

#!/usr/bin/env node

/**
 * Fixed Test Generator Script
 */

const fs = require('fs');
const path = require('path');

const generateServiceTest = (modulePath, serviceName, prismaModel, fileName) => {
  const testTemplate = `import { Test, TestingModule } from '@nestjs/testing';
import { ${serviceName} } from './${fileName}.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

describe('${serviceName}', () => {
  let service: ${serviceName};
  let prismaService: PrismaService;

  const mockPrismaService = {
    ${prismaModel}: {
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockPaginationService = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ${serviceName},
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).compile();

    service = module.get<${serviceName}>(${serviceName});
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a record', async () => {
      const dto = { name: 'Test' };
      const mockRecord = { id: 'uuid', ...dto };
      
      mockPrismaService.${prismaModel}.create.mockResolvedValue(mockRecord);
      
      const result = await service.create(dto as any);
      
      expect(result).toEqual(mockRecord);
    });
  });

  describe('findOne', () => {
    it('should return a record', async () => {
      const mockRecord = { id: 'uuid', name: 'Test' };
      mockPrismaService.${prismaModel}.findUniqueOrThrow.mockResolvedValue(mockRecord);
      
      const result = await service.findOne('uuid');
      
      expect(result).toEqual(mockRecord);
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const dto = { name: 'Updated' };
      const mockRecord = { id: 'uuid', ...dto };
      
      mockPrismaService.${prismaModel}.update.mockResolvedValue(mockRecord);
      
      const result = await service.update('uuid', dto as any);
      
      expect(result).toEqual(mockRecord);
    });
  });

  describe('delete', () => {
    it('should delete a record', async () => {
      const mockRecord = { id: 'uuid' };
      mockPrismaService.${prismaModel}.delete.mockResolvedValue(mockRecord);
      
      const result = await service.delete('uuid');
      
      expect(result).toEqual(mockRecord);
    });
  });
});
`;

  const testFilePath = path.join(modulePath, `${fileName}.service.spec.ts`);
  fs.writeFileSync(testFilePath, testTemplate);
  console.log(`Generated: ${testFilePath}`);
};

// Medical Module Tests
const medicalModules = [
  ['src/modules/medical/disease', 'DiseaseService', 'disease', 'disease'],
  ['src/modules/medical/disease-category', 'DiseaseCategoryService', 'diseaseCategory', 'disease-category'],
  ['src/modules/medical/prophylaxis', 'ProphylaxisService', 'prophylaxis', 'prophylaxis'],
  ['src/modules/medical/prophylaxis-item', 'ProphylaxisItemService', 'prophylaxisItem', 'prophylaxis-item'],
  ['src/modules/medical/prophylaxis-detail', 'ProphylaxisDetailService', 'prophylaxisDetail', 'prophylaxis-detail'],
];

// Diagnostics Reference Data Tests
const diagnosticsRefModules = [
  ['src/modules/diagnostics/urine-color', 'UrineColorService', 'urineColor', 'urine-color'],
  ['src/modules/diagnostics/urine-smell', 'UrineSmellService', 'urineSmell', 'urine-smell'],
  ['src/modules/diagnostics/urine-clarity', 'UrineClarityService', 'urineClarity', 'urine-clarity'],
  ['src/modules/diagnostics/urine-consistency', 'UrineConsistencyService', 'urineConsistency', 'urine-consistency'],
  ['src/modules/diagnostics/feces-color', 'FecesColorService', 'fecesColor', 'feces-color'],
  ['src/modules/diagnostics/feces-smell', 'FecesSmellService', 'fecesSmell', 'feces-smell'],
  ['src/modules/diagnostics/feces-consistency', 'FecesConsistencyService', 'fecesConsistency', 'feces-consistency'],
  ['src/modules/diagnostics/feces-form', 'FecesFormService', 'fecesForm', 'feces-form'],
  ['src/modules/diagnostics/mucosa-appearance', 'MucosaAppearanceService', 'mucosaAppearance', 'mucosa-appearance'],
];

// Diagnostics Exam Tests
const diagnosticsExamModules = [
  ['src/modules/diagnostics/clinical-exam', 'ClinicalExamService', 'clinicalExam', 'clinical-exam'],
  ['src/modules/diagnostics/blood-exam', 'BloodExamService', 'bloodExam', 'blood-exam'],
  ['src/modules/diagnostics/urine-exam', 'UrineExamService', 'urineExam', 'urine-exam'],
  ['src/modules/diagnostics/feces-exam', 'FecesExamService', 'fecesExam', 'feces-exam'],
  ['src/modules/diagnostics/mucosa-exam', 'MucosaExamService', 'mucosaExam', 'mucosa-exam'],
];

console.log('Generating Medical Module Tests...');
medicalModules.forEach(([path, service, model, fileName]) => generateServiceTest(path, service, model, fileName));

console.log('\nGenerating Diagnostics Reference Data Tests...');
diagnosticsRefModules.forEach(([path, service, model, fileName]) => generateServiceTest(path, service, model, fileName));

console.log('\nGenerating Diagnostics Exam Tests...');
diagnosticsExamModules.forEach(([path, service, model, fileName]) => generateServiceTest(path, service, model, fileName));

console.log('\nAll tests generated successfully!');

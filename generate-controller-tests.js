#!/usr/bin/env node

/**
 * Controller Test Generator Script
 */

const fs = require('fs');
const path = require('path');

const generateControllerTest = (modulePath, controllerName, serviceName, fileName) => {
  const testTemplate = `import { Test, TestingModule } from '@nestjs/testing';
import { ${controllerName} } from './${fileName}.controller';
import { ${serviceName} } from './${fileName}.service';

describe('${controllerName}', () => {
  let controller: ${controllerName};
  let service: ${serviceName};

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [${controllerName}],
      providers: [
        {
          provide: ${serviceName},
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<${controllerName}>(${controllerName});
    service = module.get<${serviceName}>(${serviceName});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a record', async () => {
      const dto = { name: 'Test' };
      const result = { id: 'uuid', ...dto };
      
      mockService.create.mockResolvedValue(result);
      
      expect(await controller.create(dto as any)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all records', async () => {
      const result = {
        data: [{ id: 'uuid', name: 'Test' }],
        meta: { page: 1, perPage: 10, total: 1, totalPages: 1 },
      };
      
      mockService.findAll.mockResolvedValue(result);
      
      expect(await controller.findAll({} as any)).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single record', async () => {
      const result = { id: 'uuid', name: 'Test' };
      
      mockService.findOne.mockResolvedValue(result);
      
      expect(await controller.findOne('uuid')).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith('uuid');
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const dto = { name: 'Updated' };
      const result = { id: 'uuid', ...dto };
      
      mockService.update.mockResolvedValue(result);
      
      expect(await controller.update('uuid', dto as any)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('delete', () => {
    it('should delete a record', async () => {
      const result = { id: 'uuid' };
      
      mockService.delete.mockResolvedValue(result);
      
      expect(await controller.delete('uuid')).toEqual(result);
      expect(service.delete).toHaveBeenCalledWith('uuid');
    });
  });
});
`;

  const testFilePath = path.join(modulePath, `${fileName}.controller.spec.ts`);
  fs.writeFileSync(testFilePath, testTemplate);
  console.log(`Generated: ${testFilePath}`);
};

// Auth Module
const authModules = [
  ['src/auth', 'AuthController', 'AuthService', 'auth'],
  ['src/auth/users', 'UsersController', 'UsersService', 'users'],
];

// Management Module
const managementModules = [
  ['src/modules/management/region', 'RegionController', 'RegionService', 'region'],
  ['src/modules/management/district', 'DistrictController', 'DistrictService', 'district'],
  ['src/modules/management/vet-station', 'VetStationController', 'VetStationService', 'vet-station'],
];

// Inventory Module
const inventoryModules = [
  ['src/modules/inventory/animal', 'AnimalController', 'AnimalService', 'animal'],
  ['src/modules/inventory/animal-type', 'AnimalTypeController', 'AnimalTypeService', 'animal-type'],
  ['src/modules/inventory/animal-breed', 'AnimalBreedController', 'AnimalBreedService', 'animal-breed'],
  ['src/modules/inventory/animal-color', 'AnimalColorController', 'AnimalColorService', 'animal-color'],
];

// Medical Module
const medicalModules = [
  ['src/modules/medical/disease', 'DiseaseController', 'DiseaseService', 'disease'],
  ['src/modules/medical/disease-category', 'DiseaseCategoryController', 'DiseaseCategoryService', 'disease-category'],
  ['src/modules/medical/prophylaxis', 'ProphylaxisController', 'ProphylaxisService', 'prophylaxis'],
  ['src/modules/medical/prophylaxis-item', 'ProphylaxisItemController', 'ProphylaxisItemService', 'prophylaxis-item'],
  ['src/modules/medical/prophylaxis-detail', 'ProphylaxisDetailController', 'ProphylaxisDetailService', 'prophylaxis-detail'],
];

// Diagnostics Reference Data
const diagnosticsRefModules = [
  ['src/modules/diagnostics/urine-color', 'UrineColorController', 'UrineColorService', 'urine-color'],
  ['src/modules/diagnostics/urine-smell', 'UrineSmellController', 'UrineSmellService', 'urine-smell'],
  ['src/modules/diagnostics/urine-clarity', 'UrineClarityController', 'UrineClarityService', 'urine-clarity'],
  ['src/modules/diagnostics/urine-consistency', 'UrineConsistencyController', 'UrineConsistencyService', 'urine-consistency'],
  ['src/modules/diagnostics/feces-color', 'FecesColorController', 'FecesColorService', 'feces-color'],
  ['src/modules/diagnostics/feces-smell', 'FecesSmellController', 'FecesSmellService', 'feces-smell'],
  ['src/modules/diagnostics/feces-consistency', 'FecesConsistencyController', 'FecesConsistencyService', 'feces-consistency'],
  ['src/modules/diagnostics/feces-form', 'FecesFormController', 'FecesFormService', 'feces-form'],
  ['src/modules/diagnostics/mucosa-appearance', 'MucosaAppearanceController', 'MucosaAppearanceService', 'mucosa-appearance'],
];

// Diagnostics Exam
const diagnosticsExamModules = [
  ['src/modules/diagnostics/clinical-exam', 'ClinicalExamController', 'ClinicalExamService', 'clinical-exam'],
  ['src/modules/diagnostics/blood-exam', 'BloodExamController', 'BloodExamService', 'blood-exam'],
  ['src/modules/diagnostics/urine-exam', 'UrineExamController', 'UrineExamService', 'urine-exam'],
  ['src/modules/diagnostics/feces-exam', 'FecesExamController', 'FecesExamService', 'feces-exam'],
  ['src/modules/diagnostics/mucosa-exam', 'MucosaExamController', 'MucosaExamService', 'mucosa-exam'],
];

console.log('Generating Auth Controller Tests...');
authModules.forEach(([path, controller, service, fileName]) => generateControllerTest(path, controller, service, fileName));

console.log('\nGenerating Management Controller Tests...');
managementModules.forEach(([path, controller, service, fileName]) => generateControllerTest(path, controller, service, fileName));

console.log('\nGenerating Inventory Controller Tests...');
inventoryModules.forEach(([path, controller, service, fileName]) => generateControllerTest(path, controller, service, fileName));

console.log('\nGenerating Medical Controller Tests...');
medicalModules.forEach(([path, controller, service, fileName]) => generateControllerTest(path, controller, service, fileName));

console.log('\nGenerating Diagnostics Reference Controller Tests...');
diagnosticsRefModules.forEach(([path, controller, service, fileName]) => generateControllerTest(path, controller, service, fileName));

console.log('\nGenerating Diagnostics Exam Controller Tests...');
diagnosticsExamModules.forEach(([path, controller, service, fileName]) => generateControllerTest(path, controller, service, fileName));

console.log('\nAll controller tests generated successfully!');

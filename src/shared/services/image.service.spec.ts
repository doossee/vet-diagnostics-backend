import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { ConfigService } from '@nestjs/config';

describe('ImageService', () => {
  let service: ImageService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'BASE_URL') return 'http://localhost:3000';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    service = module.get<ImageService>(ImageService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getImageUrl', () => {
    it('should return null for null input', () => {
      expect(service.getImageUrl(null)).toBeNull();
    });

    it('should return absolute URL as-is', () => {
      const url = 'http://example.com/image.jpg';
      expect(service.getImageUrl(url)).toBe(url);
    });

    it('should return https URL as-is', () => {
      const url = 'https://example.com/image.jpg';
      expect(service.getImageUrl(url)).toBe(url);
    });

    it('should prepend base URL to relative path', () => {
      const result = service.getImageUrl('uploads/image.jpg');
      expect(result).toBe('http://localhost:3000/uploads/image.jpg');
    });

    it('should strip leading slash from relative path', () => {
      const result = service.getImageUrl('/uploads/image.jpg');
      expect(result).toBe('http://localhost:3000/uploads/image.jpg');
    });
  });
});

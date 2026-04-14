import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let service: PaginationService;

  beforeEach(() => {
    service = new PaginationService();
  });

  const createMockModel = (totalCount: number, data: any[]) => ({
    count: jest.fn().mockResolvedValue(totalCount),
    findMany: jest.fn().mockResolvedValue(data),
  });

  describe('paginate', () => {
    it('should return first page with correct meta', async () => {
      const mockData = [{ id: '1' }, { id: '2' }];
      const model = createMockModel(20, mockData);

      const result = await service.paginate(model, {}, { page: 1, perPage: 2 });

      expect(result.data).toEqual(mockData);
      expect(result.meta.total).toBe(20);
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.perPage).toBe(2);
      expect(result.meta.lastPage).toBe(10);
      expect(result.meta.prev).toBeNull();
      expect(result.meta.next).toBe(2);
    });

    it('should return middle page with prev and next', async () => {
      const model = createMockModel(30, []);

      const result = await service.paginate(
        model,
        {},
        { page: 2, perPage: 10 },
      );

      expect(result.meta.currentPage).toBe(2);
      expect(result.meta.prev).toBe(1);
      expect(result.meta.next).toBe(3);
    });

    it('should return last page with no next', async () => {
      const model = createMockModel(20, []);

      const result = await service.paginate(
        model,
        {},
        { page: 2, perPage: 10 },
      );

      expect(result.meta.currentPage).toBe(2);
      expect(result.meta.lastPage).toBe(2);
      expect(result.meta.prev).toBe(1);
      expect(result.meta.next).toBeNull();
    });

    it('should use default perPage of 10', async () => {
      const model = createMockModel(5, []);

      const result = await service.paginate(model, {}, {});

      expect(result.meta.perPage).toBe(10);
      expect(model.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10, skip: 0 }),
      );
    });

    it('should default to page 1', async () => {
      const model = createMockModel(5, []);

      const result = await service.paginate(model, {}, {});

      expect(result.meta.currentPage).toBe(1);
    });

    it('should calculate skip correctly for page 3', async () => {
      const model = createMockModel(50, []);

      await service.paginate(model, {}, { page: 3, perPage: 5 });

      expect(model.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 5 }),
      );
    });

    it('should handle empty results', async () => {
      const model = createMockModel(0, []);

      const result = await service.paginate(
        model,
        {},
        { page: 1, perPage: 10 },
      );

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(result.meta.lastPage).toBe(0);
      expect(result.meta.prev).toBeNull();
      expect(result.meta.next).toBeNull();
    });

    it('should pass where clause to count and findMany', async () => {
      const model = createMockModel(1, [{ id: '1' }]);
      const where = { name: 'test' };

      await service.paginate(model, { where }, { page: 1, perPage: 10 });

      expect(model.count).toHaveBeenCalledWith({ where });
      expect(model.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where }),
      );
    });

    it('should handle string page and perPage values', async () => {
      const model = createMockModel(20, []);

      const result = await service.paginate(
        model,
        {},
        { page: '2' as any, perPage: '5' as any },
      );

      expect(result.meta.currentPage).toBe(2);
      expect(result.meta.perPage).toBe(5);
    });
  });
});

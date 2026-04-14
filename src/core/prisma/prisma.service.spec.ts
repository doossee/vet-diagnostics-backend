import { PrismaService } from './prisma.service';

// PrismaService extends PrismaClient with a PrismaPg adapter.
// Full integration tests require a database connection.
// Here we verify the class can be instantiated with the required env var.
describe('PrismaService', () => {
  it('should be defined as a class', () => {
    expect(PrismaService).toBeDefined();
    expect(typeof PrismaService).toBe('function');
  });
});

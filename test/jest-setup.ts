// Jest setup file to ensure Prisma client is properly initialized

// Set DATABASE_URL for tests if not already set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://postgres:postgres@localhost:5432/vet_diagnostics_test?schema=public';
}

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Initialize Prisma client to ensure enums are loaded
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Clean up
afterAll(async () => {
  await prisma.$disconnect();
});

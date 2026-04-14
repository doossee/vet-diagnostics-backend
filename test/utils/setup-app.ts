import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { CoreModule } from '../../src/core/core.module';
import { PrismaExceptionFilter } from '../../src/shared/filters';

export async function setupApp(): Promise<{
  app: INestApplication<App>;
  module: TestingModule;
}> {
  const module = await Test.createTestingModule({
    imports: [CoreModule],
  }).compile();

  const app = module.createNestApplication();

  // Match src/main.ts global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Match src/main.ts global filters
  app.useGlobalFilters(new PrismaExceptionFilter());

  // CORS is not needed for e2e tests (supertest bypasses HTTP layer)
  // Swagger is not needed for e2e tests
  // ResponseTransformInterceptor is applied via APP_INTERCEPTOR in CoreModule

  await app.init();

  return { app, module };
}

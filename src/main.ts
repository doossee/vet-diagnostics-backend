import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core/core.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaExceptionFilter } from './shared/filters';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(CoreModule);

  const config = app.get(ConfigService);

  // Serve static files from uploads directory with /uploads prefix
  const uploadsPath = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads',
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());

  const swagger = new DocumentBuilder()
    .setTitle('TableTap Backend')
    .setDescription('TableTap Backend API')
    .setVersion('1.0')
    .addTag('/', 'Development server')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swagger);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'), '0.0.0.0');
}
void bootstrap();

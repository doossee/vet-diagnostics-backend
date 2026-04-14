import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from 'src/shared/utils';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseTransformInterceptor } from 'src/shared/interceptors';
import { DiagnosticsModule } from 'src/modules/diagnostics/diagnostics.module';
import { MedicalModule } from 'src/modules/medical/medical.module';
import { InventoryModule } from 'src/modules/inventory/inventory.module';
import { ManagementModule } from 'src/modules/management/management.module';
import { HealthModule } from 'src/health/health.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    ServeStaticModule.forRootAsync({
      useFactory: () => [
        {
          rootPath: join(__dirname, '..', '..', 'uploads'),
          serveRoot: '/uploads',
        },
      ],
    }),
    SharedModule,
    PrismaModule,
    AuthModule,
    HealthModule,
    DiagnosticsModule,
    MedicalModule,
    InventoryModule,
    ManagementModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class CoreModule {}

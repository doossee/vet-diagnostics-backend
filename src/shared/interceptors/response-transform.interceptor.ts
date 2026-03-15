import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Decimal } from '@prisma/client/runtime/client';

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface ImageHolder {
  image?: string | null;
  [key: string]: JsonValue | undefined;
}

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return next.handle().pipe(map((data) => this.transformData(data)));
  }

  private transformData(data: JsonValue): JsonValue {
    if (!data) return data;

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map((item) => this.transformData(item));
    }

    // Handle Decimal objects from Prisma
    if (data instanceof Decimal) {
      return data.toNumber();
    }

    // Handle Date objects
    if (data instanceof Date) {
      return data.toISOString();
    }

    // Handle objects
    if (typeof data === 'object' && data !== null) {
      const transformed: ImageHolder = { ...data };

      // Transform image field if present
      if (this.hasImageProperty(transformed)) {
        transformed.image = this.getImageUrl(transformed.image);
      }

      // Recursively transform nested objects and arrays
      Object.keys(transformed).forEach((key) => {
        const value = transformed[key];
        if (value && (typeof value === 'object' || Array.isArray(value))) {
          transformed[key] = this.transformData(value);
        }
      });

      return transformed as JsonValue;
    }

    return data;
  }

  private hasImageProperty(
    obj: ImageHolder,
  ): obj is ImageHolder & { image: string | null } {
    return (
      'image' in obj && (typeof obj.image === 'string' || obj.image === null)
    );
  }

  private getImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null;

    // If path already starts with http, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    const baseUrl = this.configService.get<string>('BASE_URL');
    // Ensure path doesn't start with slash for consistency
    const cleanPath = imagePath.startsWith('/')
      ? imagePath.substring(1)
      : imagePath;

    return `${baseUrl}/${cleanPath}`;
  }
}

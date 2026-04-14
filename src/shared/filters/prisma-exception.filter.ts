import { Prisma } from 'src/generated/prisma/client';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface PrismaErrorInfo {
  status: number;
  message: string;
}

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  // Only errors that are deemed safe to show to the client are mapped here.
  private errorMapping: Record<string, PrismaErrorInfo> = {
    P2000: {
      status: HttpStatus.BAD_REQUEST,
      message: 'The provided value is too long.',
    },
    P2001: {
      status: HttpStatus.NOT_FOUND,
      message: 'Record not found.',
    },
    P2002: {
      status: HttpStatus.CONFLICT,
      message: 'A record with this value already exists.',
    },
    P2003: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Foreign key constraint failed.',
    },
    P2014: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Required relation constraint violated.',
    },
    P2015: {
      status: HttpStatus.NOT_FOUND,
      message: 'A related record could not be found.',
    },
    P2018: {
      status: HttpStatus.NOT_FOUND,
      message: 'Required connected records were not found.',
    },
    P2020: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Value out of range for the field.',
    },
    P2025: {
      status: HttpStatus.NOT_FOUND,
      message: 'Record not found.',
    },
    P2034: {
      status: HttpStatus.CONFLICT,
      message: 'Write conflict or deadlock detected. Please retry.',
    },
  };

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Log the full error details for internal diagnostics.
    this.logger.error(exception);

    const errorInfo = this.errorMapping[exception.code];
    if (errorInfo) {
      response.status(errorInfo.status).json({
        statusCode: errorInfo.status,
        message: errorInfo.message,
      });
    } else {
      // For any unmapped errors, send a generic message.
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred.',
      });
    }
  }
}

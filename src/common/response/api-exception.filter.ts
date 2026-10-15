import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from './api-response.js';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const httpContext = host.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException
      ? exception.getResponse()
      : undefined;
    const message = this.getMessage(exception, exceptionResponse);
    const errors = this.getErrors(exceptionResponse);

    if (!isHttpException) {
      this.logger.error(
        `${request.method} ${request.url} failed`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response
      .status(statusCode)
      .json(ApiResponse.error(message, statusCode, request.url, errors));
  }

  private getMessage(exception: unknown, exceptionResponse: unknown): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (this.isExceptionResponse(exceptionResponse)) {
      if (Array.isArray(exceptionResponse.message)) {
        return 'Validation failed';
      }

      if (typeof exceptionResponse.message === 'string') {
        return exceptionResponse.message;
      }
    }

    if (exception instanceof HttpException && exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }

  private getErrors(exceptionResponse: unknown): unknown {
    if (
      this.isExceptionResponse(exceptionResponse) &&
      Array.isArray(exceptionResponse.message)
    ) {
      return exceptionResponse.message;
    }

    return undefined;
  }

  private isExceptionResponse(
    value: unknown,
  ): value is { message?: string | string[] } {
    return typeof value === 'object' && value !== null && 'message' in value;
  }
}

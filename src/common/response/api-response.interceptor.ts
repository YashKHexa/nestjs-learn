import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, map } from 'rxjs';
import { ApiResponse } from './api-response.js';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      map((data: unknown) =>
        ApiResponse.success(
          data,
          this.getMessage(request.method),
          response.statusCode,
          request.url,
        ),
      ),
    );
  }

  private getMessage(method: string): string {
    switch (method.toUpperCase()) {
      case 'POST':
        return 'Resource created successfully';
      case 'PATCH':
      case 'PUT':
        return 'Resource updated successfully';
      case 'DELETE':
        return 'Resource deleted successfully';
      default:
        return 'Request successful';
    }
  }
}

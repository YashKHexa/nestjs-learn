import { ApiResponseStatus } from './api-response-status.enum.js';
import type { ApiResponse as ApiResponseDto } from './api-response.interface.js';

export const ApiResponse = {
  success<T>(
    data: T | undefined,
    message: string,
    statusCode: number,
    path?: string,
  ): ApiResponseDto<T> {
    return {
      status: ApiResponseStatus.SUCCESS,
      statusCode,
      message,
      ...(data !== undefined ? { data } : {}),
      timestamp: new Date().toISOString(),
      ...(path ? { path } : {}),
    };
  },

  error(
    message: string,
    statusCode: number,
    path?: string,
    errors?: unknown,
  ): ApiResponseDto {
    return {
      status: ApiResponseStatus.ERROR,
      statusCode,
      message,
      ...(errors !== undefined ? { errors } : {}),
      timestamp: new Date().toISOString(),
      ...(path ? { path } : {}),
    };
  },
};

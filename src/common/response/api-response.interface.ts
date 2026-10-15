import { ApiResponseStatus } from './api-response-status.enum.js';

export interface ApiResponse<T = unknown> {
  status: ApiResponseStatus;
  statusCode: number;
  message: string;
  data?: T;
  errors?: unknown;
  timestamp: string;
  path?: string;
}

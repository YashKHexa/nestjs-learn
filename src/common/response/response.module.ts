import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiExceptionFilter } from './api-exception.filter.js';
import { ApiResponseInterceptor } from './api-response.interceptor.js';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
})
export class ResponseModule {}

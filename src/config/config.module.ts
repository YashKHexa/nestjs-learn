import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration.js';
import { validateEnvironment } from './env.js';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
      validate: validateEnvironment,
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}

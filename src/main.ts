import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    logger.log('Starting backend...');

    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('app.port');
    const nodeEnv = configService.getOrThrow<string>('app.nodeEnv');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strips away any properties that do not have decorators in the DTO
        forbidNonWhitelisted: true, // Throws an error if unwanted/unknown properties are sent
        transform: true, // Automatically transforms payloads into DTO instances and handles type conversions
      }),
    );

    // Runs onModuleDestroy hooks (e.g. Prisma $disconnect) on SIGTERM/SIGINT
    app.enableShutdownHooks();
    logger.log(`Environment: ${nodeEnv}`);
    logger.log('Global validation pipe configured');

    await app.listen(port);
    logger.log(`Backend is running on ${await app.getUrl()}`);
  } catch (error) {
    logger.error(
      'Backend failed to start',
      error instanceof Error ? error.stack : String(error),
    );
    throw error;
  }
}
await bootstrap();

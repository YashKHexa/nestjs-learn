import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away any properties that do not have decorators in the DTO
      forbidNonWhitelisted: true, // Throws an error if unwanted/unknown properties are sent
      transform: true, // Automatically transforms payloads into DTO instances and handles type conversions
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    // Prisma 7 requires a driver adapter.
    super({
      adapter: new PrismaPg({
        connectionString: configService.getOrThrow<string>('database.url'),
      }),
    });
  }

  async onModuleInit() {
    this.logger.log('Connecting to database...');

    try {
      await this.$connect();
      this.logger.log('Database connection established');
    } catch (error) {
      this.logger.error(
        'Database connection failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');

    try {
      await this.$disconnect();
      this.logger.log('Database connection closed');
    } catch (error) {
      this.logger.error(
        'Database disconnect failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}

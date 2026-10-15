import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { TaskModule } from './task/task.module.js';

@Module({
  imports: [AppConfigModule, PrismaModule, TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

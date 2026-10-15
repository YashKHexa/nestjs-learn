import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { TaskModule } from './task/task.module.js';

@Module({
  imports: [PrismaModule, TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
      },
    });
  }

  async getAll() {
    return await this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.getOne(id);

    return await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async delete(id: string) {
    await this.getOne(id);

    return await this.prisma.task.delete({
      where: { id },
    });
  }
}

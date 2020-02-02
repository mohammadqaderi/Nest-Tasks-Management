import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepoistory } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepoistory) private taskRepository: TaskRepoistory,
  ) {}
  async getAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getAllTasks(filterDto, user);
  }

  async findTask(id: number, user: User): Promise<Task> {
    const task: Task = await this.taskRepository.findOne({
      where: {
        id,
        userId: user.id
      }
    });
    if (!task) {
      throw new NotFoundException(`Task with id: ${id} is not found `);
    }
    return task;
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({
      id,
      userId: user.id
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id: ${id} is not found `);
    }
  }
  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task: Task = await this.findTask(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}

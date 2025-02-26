import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepoistory extends Repository<Task> {
  private logger = new Logger('TaskRepoistory');

  async getAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    // query.orderBy('task.id', "DESC");
    // query.limit(2);
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user ${
          user.username
        }, Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
      task.user = user;
      try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user ${
          user.username
        }, Data: ${JSON.stringify(createTaskDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
    return task;
  }
}

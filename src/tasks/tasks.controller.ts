import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetAuthenticatedUser } from '../auth/get-user.decorator';
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetAuthenticatedUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.username} retrieving all tasks. Filter: ${JSON.stringify(
        filterDto,
      )} `,
    );
    return this.tasksService.getAllTasks(filterDto, user);
  }

  @Get(':id')
  getTask(
    @Param('id', ParseIntPipe) id: number,
    @GetAuthenticatedUser() user: User,
  ): Promise<Task> {
    return this.tasksService.findTask(id, user);
  }
  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetAuthenticatedUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} creating a new task. Data : ${JSON.stringify(
        createTaskDto,
      )} `,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete(':id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetAuthenticatedUser() user: User,
  ): Promise<void> {
    this.logger.verbose(
      `User ${user.username} deleting a task with id: ${id} `,
    );
    return this.tasksService.deleteTask(id, user);
  }

  @Patch(':id/status')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetAuthenticatedUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} updating a task with id: ${id} `,
    );
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}

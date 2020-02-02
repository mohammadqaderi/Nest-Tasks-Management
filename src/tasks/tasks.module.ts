import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepoistory } from './task.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepoistory]),
  AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}

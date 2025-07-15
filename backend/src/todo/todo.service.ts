import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from 'src/schemas/todo.schema';
import { CreateTodoDto, FilterTodoDto, UpdateTodoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    const createdTodo = new this.todoModel({
      ...createTodoDto,
      userId,
    });
    return createdTodo.save();
  }

  async findOne(id: string, userId: string): Promise<Todo> {
    const todo = await this.todoModel.findById(id).exec();
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return todo;
  }

  async findAll(userId: string, filterDto: FilterTodoDto): Promise<Todo[]> {
    const filter: any = { userId };

    if (filterDto.status) {
      filter.status = filterDto.status;
    }

    if (filterDto.dueDateFrom || filterDto.dueDateTo) {
      filter.dueDate = {};
      if (filterDto.dueDateFrom) {
        filter.dueDate.$gte = new Date(filterDto.dueDateFrom);
      }
      if (filterDto.dueDateTo) {
        filter.dueDate.$lte = new Date(filterDto.dueDateTo);
      }
    }

    const sortBy = filterDto.sortBy || 'createdAt';
    const sortOrder = filterDto.sortOrder === 'asc' ? 1 : -1;

    return this.todoModel
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .exec();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: string, userId: string): Promise<void> {
    // const todo = await this.findOne(id, userId);
    await this.todoModel.findByIdAndDelete(id).exec();
  }

  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId: string
  ): Promise<any> {
    // const todo = await this.findOne(id, userId);
    // Object.assign(todo, updateTodoDto);
    // return todo.save();
    await this.todoModel.findByIdAndUpdate(id, updateTodoDto).exec();
  }
}

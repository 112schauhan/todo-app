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
    console.log('Control came here ', createTodoDto);
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

  async findAll(
    userId: string,
    filterDto: FilterTodoDto
  ): Promise<{
    todos: Todo[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
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

    if (filterDto.search) {
      filter.$or = [
        { title: { $regex: filterDto.search, $options: 'i' } },
        { description: { $regex: filterDto.search, $options: 'i' } },
      ];
    }

    const sortBy = filterDto.sortBy || 'createdAt';
    const sortOrder = filterDto.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder as 1 | -1 };
    const page = Math.max(1, filterDto.page || 1);
    const limit = Math.min(50, Math.max(1, filterDto.limit || 10));
    const skip = (page - 1) * limit;

    const [todos, total] = await Promise.all([
      this.todoModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.todoModel.countDocuments(filter).exec(),
    ]);

    return {
      todos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: string, userId: string): Promise<void> {
    // const todo = await this.findOne(id, userId);
    await this.todoModel.findByIdAndDelete(id).exec();
  }

  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
    userId: string
  ): Promise<any> {
    await this.findOne(id, userId);
    const updated = await this.todoModel
      .findByIdAndUpdate(id, updateTodoDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Todo not found');
    return updated;
  }

  async fetchStatistics(userId: string): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
  }> {
    const now = new Date();
    const [total, pending, inProgress, completed, overdue] = await Promise.all([
      this.todoModel.countDocuments({ userId }).exec(),
      this.todoModel.countDocuments({ userId, status: 'pending' }).exec(),
      this.todoModel.countDocuments({ userId, status: 'in_progress' }).exec(),
      this.todoModel.countDocuments({ userId, status: 'completed' }).exec(),
      this.todoModel
        .countDocuments({
          userId,
          status: { $ne: 'completed' },
          dueDate: { $lt: now },
        })
        .exec(),
    ]);

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
    };
  }
}

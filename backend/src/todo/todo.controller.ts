import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { TodoService } from './todo.service';
import { CreateTodoDto, FilterTodoDto, UpdateTodoDto } from './dto/todo.dto';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Request() req: any) {
    return this.todoService.create(createTodoDto, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req: any
  ) {
    return this.todoService.update(id, updateTodoDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.todoService.remove(id, req.user.userId);
  }

  @Get()
  findAll(@Request() req: any, @Query() filterDto: FilterTodoDto) {
    return this.todoService.findAll(req.user.userId, filterDto);
  }

  @Get()
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.todoService.findOne(id, req.user.userId);
  }

  @Get('statistics')
  fetchStatistics(@Request() req: any) {
    return this.todoService.fetchStatistics(req.user.userId);
  }
}

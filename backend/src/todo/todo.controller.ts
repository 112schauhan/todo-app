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
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { TodoService } from './todo.service';
import { CreateTodoDto, FilterTodoDto, UpdateTodoDto } from './dto/todo.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('todos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Create todo' })
  @ApiResponse({ status: 201, description: 'Todo created' })
  create(@Body() createTodoDto: CreateTodoDto, @Request() req: any) {
    console.log('Control came here ', createTodoDto);
    console.log('User ID:', req.user);
    return this.todoService.create(createTodoDto, req.user.userId);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Fetch todo statistics' })
  @ApiResponse({ status: 200, description: 'Statistics found' })
  fetchStatistics(@Request() req: any) {
    return this.todoService.fetchStatistics(req.user.userId);
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check for todo module' })
  async healthCheck() {
    console.log('📋 Todo module health check called');
    return {
      status: 'OK',
      module: 'TodoModule',
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'in_progress', 'completed'],
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Todos found',
    schema: {
      type: 'object',
      properties: {
        todos: { type: 'array', items: { type: 'object' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  findAll(@Request() req: any, @Query() filterDto: FilterTodoDto) {
    return this.todoService.findAll(req.user.userId, filterDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get todo by id',
    description: 'Returns todo with specified id',
  })
  @ApiResponse({ status: 200, description: 'Todo found' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.todoService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update todo' })
  @ApiResponse({ status: 200, description: 'Todo updated' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req: any
  ) {
    return this.todoService.update(id, updateTodoDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete todo' })
  @ApiResponse({ status: 200, description: 'Todo deleted' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.todoService.remove(id, req.user.userId);
  }
}

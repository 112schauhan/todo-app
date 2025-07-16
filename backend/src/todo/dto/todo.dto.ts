import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { TodoStatus } from '../../schemas/todo.schema';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({ example: 'Buy groceries' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Buy groceries for the week' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2023-08-01T23:59:59.000Z' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional({ enum: TodoStatus, example: TodoStatus.PENDING })
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}

export class UpdateTodoDto {
  @ApiPropertyOptional({ example: 'Updated task title' })
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated task description' })
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({ example: '2023-08-01T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ enum: TodoStatus })
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}

export class FilterTodoDto {
  @ApiPropertyOptional({ enum: TodoStatus })
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;

  @ApiPropertyOptional({ example: '2023-08-01T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @ApiPropertyOptional({ example: '2023-08-01T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  dueDateTo?: string;

  @ApiPropertyOptional({
    enum: ['title', 'dueDate', 'status', 'createdAt'],
    default: 'createdAt',
  })
  @IsOptional()
  sortBy?: 'title' | 'dueDate' | 'status' | 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ example: 'grocery' })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 50, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number;
}

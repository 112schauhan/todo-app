import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { TodoStatus } from 'src/schemas/todo.schema';
import { Type } from 'class-transformer';

export class CreateTodoDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsDateString()
  dueDate: Date;

  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}

export class UpdateTodoDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}

export class FilterTodoDto {
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;

  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @IsOptional()
  @IsDateString()
  dueDateTo?: string;

  @IsOptional()
  sortBy?: 'title' | 'dueDate' | 'status' | 'createdAt';

  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number;
}

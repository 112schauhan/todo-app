import React, { useState } from 'react';
import { todoService } from '../services/todoService';
import { TodoContext } from './todo';
import toast from 'react-hot-toast';

const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  const fetchTodos = async (currentFilters = filters) => {
    try {
      console.log('Fetching todos with filters:', currentFilters);
      setLoading(true);
      const response = await todoService.getTodos(currentFilters);
      setTodos(response.todos || response || []);
      return response;
    } catch (error) {
      toast.error('Failed to fetch todos');
      console.error('Error fetching todos:', error);
      return { todos: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      console.log('Fetching statistics...');
      const stats = await todoService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const createTodo = async (todoData) => {
    try {
      const newTodo = await todoService.createTodo(todoData);
      await fetchTodos();
      fetchStatistics();
      toast.success('Todo created successfully');
      return newTodo;
    } catch (error) {
      toast.error('Failed to create todo');
      throw error;
    }
  };

  const updateTodo = async (id, todoData) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, todoData);
      await fetchTodos();
      fetchStatistics();
      toast.success('Todo updated successfully');
      return updatedTodo;
    } catch (error) {
      toast.error('Failed to update todo');
      throw error;
    }
  };

  const deleteTodo = async (id) => {
    try {
      await todoService.deleteTodo(id);
      await fetchTodos();
      fetchStatistics();
      toast.success('Todo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete todo');
      throw error;
    }
  };

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
  };

  const value = {
    todos,
    statistics,
    loading,
    filters,
    fetchTodos,
    fetchStatistics,
    createTodo,
    updateTodo,
    deleteTodo,
    updateFilters,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;
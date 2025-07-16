import React, { createContext, useContext, useState, useEffect } from 'react';
import { todoService } from '../services/todoService';
import toast from 'react-hot-toast';

const TodoContext = createContext();

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [statistics, setStatistics] = useState(null);
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
      setLoading(true);
      const response = await todoService.getTodos(currentFilters);
      setTodos(response.todos || []);
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
      const stats = await todoService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const createTodo = async (todoData) => {
    try {
      const newTodo = await todoService.createTodo(todoData);
      setTodos(prev => [newTodo, ...prev]);
      toast.success('Todo created successfully');
      fetchStatistics(); // Refresh stats
      return newTodo;
    } catch (error) {
      toast.error('Failed to create todo');
      throw error;
    }
  };

  const updateTodo = async (id, todoData) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, todoData);
      setTodos(prev => prev.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
      toast.success('Todo updated successfully');
      fetchStatistics(); // Refresh stats
      return updatedTodo;
    } catch (error) {
      toast.error('Failed to update todo');
      throw error;
    }
  };

  const deleteTodo = async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
      toast.success('Todo deleted successfully');
      fetchStatistics(); // Refresh stats
    } catch (error) {
      toast.error('Failed to delete todo');
      throw error;
    }
  };

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchTodos(updatedFilters);
  };

  useEffect(() => {
    fetchTodos();
    fetchStatistics();
  }, []);

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
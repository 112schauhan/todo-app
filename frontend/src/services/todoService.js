import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/api';

export const todoService = {
  async getTodos(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    return apiClient.get(`${API_ENDPOINTS.todos.base}?${params.toString()}`);
  },

  async getTodo(id) {
    return apiClient.get(`${API_ENDPOINTS.todos.base}/${id}`);
  },

  async createTodo(todoData) {
    return apiClient.post(API_ENDPOINTS.todos.base, todoData);
  },

  async updateTodo(id, todoData) {
    return apiClient.patch(`${API_ENDPOINTS.todos.base}/${id}`, todoData);
  },

  async deleteTodo(id) {
    return apiClient.delete(`${API_ENDPOINTS.todos.base}/${id}`);
  },

  async getStatistics() {
    return apiClient.get(API_ENDPOINTS.todos.statistics);
  },
};
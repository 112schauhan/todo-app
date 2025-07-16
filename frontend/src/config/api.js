export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  auth: {
    signin: '/auth/signin',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  todos: {
    base: '/todos',
    statistics: '/todos/statistics',
  },
};
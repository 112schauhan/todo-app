import axios from 'axios';
import { API_BASE_URL } from '../config/api';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    this.refreshTokenPromise = null;
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async refreshAccessToken() {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = this.performTokenRefresh();
    
    try {
      const accessToken = await this.refreshTokenPromise;
      return accessToken;
    } finally {
      this.refreshTokenPromise = null;
    }
  }

  async performTokenRefresh() {
     if (!this.client) {
      throw new Error('API client not initialized');
    }
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return accessToken;
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Generic request methods
  async get(url, params) {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async post(url, data) {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async patch(url, data) {
    const response = await this.client.patch(url, data);
    return response.data;
  }

  async delete(url) {
    const response = await this.client.delete(url);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
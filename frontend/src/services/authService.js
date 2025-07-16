import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/api';

export const authService = {
  async signup(userData) {
    return apiClient.post(API_ENDPOINTS.auth.signup, userData);
  },

  async signin(credentials) {
    return apiClient.post(API_ENDPOINTS.auth.signin, credentials);
  },

  async logout() {
    return apiClient.post(API_ENDPOINTS.auth.logout);
  },

  async refreshToken() {
    return apiClient.post(API_ENDPOINTS.auth.refresh);
  },

  async getProfile() {
    return apiClient.get(API_ENDPOINTS.auth.profile);
  },
};
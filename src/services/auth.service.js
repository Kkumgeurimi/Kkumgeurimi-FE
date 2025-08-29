import http from './http.js';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../config/constants.js';

export const authService = {
  // 회원가입
  async signup(userData) {
    const response = await http.post('/auth/signup', userData);
    return response.data;
  },

  // 로그인
  async login(credentials) {
    const response = await http.post('/auth/login', credentials);
    const { accessToken } = response.data;
    
    // 토큰을 로컬 스토리지에 저장
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    
    return response.data;
  },

  // 로그아웃
  async logout() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      await http.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // 토큰 갱신
  async refreshToken() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await http.post('/auth/refresh', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const { accessToken } = response.data;
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    
    return { accessToken };
  },

  // 현재 토큰 확인
  getCurrentToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // 로그인 상태 확인
  isAuthenticated() {
    return !!this.getCurrentToken();
  }
};

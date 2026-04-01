import axios from 'axios';

const envBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const BASE_URL =
  envBase ||
  (import.meta.env.PROD ? 'https://www.modotodo.co.kr' : 'http://140.245.76.239:8080');

// axios 인스턴스
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true, // refresh Token 전달용
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터 (요청 전 처리)
api.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 항상 헤더에 추가
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;


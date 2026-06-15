import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/auth';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? '/api',
  timeout: 15_000,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  cfg.headers['X-Request-Id'] = crypto.randomUUID();
  if (cfg.method && ['post', 'patch', 'put', 'delete'].includes(cfg.method)) {
    cfg.headers['Idempotency-Key'] ??= crypto.randomUUID();
  }
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export type ApiError = { code: string; message: string; details?: unknown };

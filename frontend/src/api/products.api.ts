import { httpClient } from './httpClient';

export const productsApi = {
  getAll: (params?: string) =>
    httpClient.get(`/api/products${params ? `?${params}` : ''}`),

  getById: (id: string) =>
    httpClient.get(`/api/products/${id}`),

  create: (data: unknown) =>
    httpClient.post('/api/products', data),

  update: (id: string, data: unknown) =>
    httpClient.put(`/api/products/${id}`, data),

  delete: (id: string) =>
    httpClient.delete(`/api/products/${id}`),
};

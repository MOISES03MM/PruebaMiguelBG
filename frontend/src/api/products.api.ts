import { httpClient } from './httpClient';
import type { Product, ProductLot, PaginatedResponse } from '../types/product.types';

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  name?: string;
  category?: string;
  sku?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  category: string;
  sku: string;
  stock: number;
}

export interface CreateLotData {
  lotNumber: string;
  price: number;
  entryDate: string;
  quantity: number;
  notes?: string;
}

export const productsApi = {
  getAll: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
    if (filters.name) params.set('name', filters.name);
    if (filters.category) params.set('category', filters.category);
    if (filters.sku) params.set('sku', filters.sku);
    const query = params.toString();
    return httpClient.get<PaginatedResponse<Product>>(`/api/products${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    httpClient.get<Product>(`/api/products/${id}`),

  create: (data: CreateProductData) =>
    httpClient.post<Product>('/api/products', data),

  update: (id: string, data: CreateProductData) =>
    httpClient.put<Product>(`/api/products/${id}`, data),

  delete: (id: string) =>
    httpClient.delete(`/api/products/${id}`),

  getLots: (productId: string) =>
    httpClient.get<ProductLot[]>(`/api/products/${productId}/lots`),

  createLot: (productId: string, data: CreateLotData) =>
    httpClient.post<ProductLot>(`/api/products/${productId}/lots`, data),

  updateLot: (productId: string, lotId: string, data: CreateLotData) =>
    httpClient.put<ProductLot>(`/api/products/${productId}/lots/${lotId}`, data),

  deleteLot: (productId: string, lotId: string) =>
    httpClient.delete(`/api/products/${productId}/lots/${lotId}`),
};

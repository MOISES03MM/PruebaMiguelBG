import { productsApi } from '../api/products.api';
import type { ProductFilters, CreateProductData, CreateLotData } from '../api/products.api';

export const productService = {
  getAll: (filters: ProductFilters = {}) => productsApi.getAll(filters),
  getById: (id: string) => productsApi.getById(id),
  create: (data: CreateProductData) => productsApi.create(data),
  update: (id: string, data: CreateProductData) => productsApi.update(id, data),
  delete: (id: string) => productsApi.delete(id),
  getLots: (productId: string) => productsApi.getLots(productId),
  createLot: (productId: string, data: CreateLotData) => productsApi.createLot(productId, data),
  updateLot: (productId: string, lotId: string, data: CreateLotData) => productsApi.updateLot(productId, lotId, data),
  deleteLot: (productId: string, lotId: string) => productsApi.deleteLot(productId, lotId),
};

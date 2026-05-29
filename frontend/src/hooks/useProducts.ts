import { useState, useCallback } from 'react';
import { productService } from '../services/product.service';
import type { Product, PaginatedResponse } from '../types/product.types';
import type { ProductFilters, CreateProductData } from '../api/products.api';
import toast from 'react-hot-toast';

export function useProducts() {
  const [products, setProducts] = useState<PaginatedResponse<Product>>({
    data: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async (filters: ProductFilters = {}) => {
    setLoading(true);
    try {
      const result = await productService.getAll(filters);
      setProducts(result);
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (data: CreateProductData) => {
    try {
      await productService.create(data);
      toast.success('Producto creado');
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear producto';
      toast.error(msg);
      return false;
    }
  };

  const updateProduct = async (id: string, data: CreateProductData) => {
    try {
      await productService.update(id, data);
      toast.success('Producto actualizado');
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar producto';
      toast.error(msg);
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productService.delete(id);
      toast.success('Producto eliminado');
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar producto';
      toast.error(msg);
      return false;
    }
  };

  return { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct };
}

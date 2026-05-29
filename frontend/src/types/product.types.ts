export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lots?: ProductLot[];
}

export interface ProductLot {
  id: string;
  productId: string;
  lotNumber: string;
  price: number;
  entryDate: string;
  quantity: number;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

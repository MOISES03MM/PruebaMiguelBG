import { httpClient } from './httpClient';

export interface DashboardStats {
  totalProducts: number;
  totalLots: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  productsByCategory: { category: string; count: number }[];
  recentLots: {
    productName: string;
    lotNumber: string;
    quantity: number;
    price: number;
    entryDate: string;
  }[];
}

export const dashboardApi = {
  getStats: () => httpClient.get<DashboardStats>('/api/dashboard/stats'),
};

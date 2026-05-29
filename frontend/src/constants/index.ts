export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ROLES = {
  ADMIN: 'Admin',
  VIEWER: 'Viewer',
} as const;

export const PAGE_SIZE = 10;

export const CATEGORIES = [
  'Electronica',
  'Muebles',
  'Ropa',
  'Calzado',
  'Alimentos',
  'Bebidas',
  'Herramientas',
  'Papeleria',
  'Limpieza',
  'Deportes',
  'Juguetes',
  'Otros',
] as const;

export type Category = typeof CATEGORIES[number];

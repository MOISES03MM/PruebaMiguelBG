import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200),
  description: z.string().max(500).optional().default(''),
  category: z.string().min(1, 'La categoría es requerida').max(100),
  sku: z.string().min(1, 'El SKU es requerido').max(50),
  stock: z.coerce.number().int().min(0, 'El stock debe ser mayor o igual a 0'),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const lotSchema = z.object({
  lotNumber: z.string().min(1, 'El número de lote es requerido').max(50),
  price: z.coerce.number().min(0.01, 'El precio debe ser mayor a 0'),
  entryDate: z.string().min(1, 'La fecha es requerida'),
  quantity: z.coerce.number().int().min(1, 'La cantidad debe ser al menos 1'),
  notes: z.string().max(300).optional().default(''),
});

export type LotFormData = z.infer<typeof lotSchema>;

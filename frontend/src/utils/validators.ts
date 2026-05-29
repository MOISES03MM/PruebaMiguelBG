import { z } from 'zod';
import { CATEGORIES } from '../constants';

export const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

const LETTERS_NUMBERS_SPACES = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/;
const LETTERS_NUMBERS        = /^[a-zA-Z0-9]+$/;
const LETTERS_NUMBERS_HYPHEN = /^[a-zA-Z0-9-]+$/;
const MSG_SPACES    = 'Solo se permiten letras y números';
const MSG_NO_SPACES = 'Solo se permiten letras y números';

export const productSchema = z.object({
  name: z.string().trim()
    .min(1, 'El nombre es requerido')
    .max(200)
    .regex(LETTERS_NUMBERS_SPACES, MSG_SPACES),
  description: z.string().trim()
    .max(500)
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]*$/, MSG_SPACES)
    .optional().default(''),
  category: z.enum(CATEGORIES, { error: 'Selecciona una categoría válida' }),
  sku: z.string().trim()
    .min(1, 'El SKU es requerido')
    .max(50)
    .regex(LETTERS_NUMBERS, MSG_NO_SPACES),
  stock: z.coerce.number().int().min(0, 'El stock debe ser mayor o igual a 0'),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const lotSchema = z.object({
  lotNumber: z.string().trim()
    .min(1, 'El número de lote es requerido')
    .max(50)
    .regex(LETTERS_NUMBERS_HYPHEN, 'Solo se permiten letras, números y guion medio'),
  price: z.coerce.number().min(0.01, 'El precio debe ser mayor a 0'),
  entryDate: z.string()
    .min(1, 'La fecha es requerida')
    .refine(val => {
      const selected = new Date(val);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return selected <= today;
    }, 'La fecha de ingreso no puede ser futura'),
  quantity: z.coerce.number().int().min(1, 'La cantidad debe ser al menos 1'),
  notes: z.string().trim().max(300).optional().default(''),
});

export type LotFormData = z.infer<typeof lotSchema>;

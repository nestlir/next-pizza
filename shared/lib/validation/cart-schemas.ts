import { z } from 'zod';
export const addCartItemSchema = z.object({
  productItemId: z.string(),
  ingredients: z.array(z.string()).optional(),
});
export const updateQuantitySchema = z.object({
  quantity: z.number().int().positive(),
});
export const cartTokenSchema = z.object({
  cartToken: z.string().optional(),
});

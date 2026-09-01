import { z } from 'zod';

export const addCartItemSchema = z.object({
  productItemId: z.string().min(1).max(100),
  ingredients: z.array(z.string().min(1).max(100)).max(20).optional(),
});

export const updateQuantitySchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

export const cartTokenSchema = z.object({
  cartToken: z.string().uuid().optional(),
});

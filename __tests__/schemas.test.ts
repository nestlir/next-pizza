import { describe, it, expect } from 'vitest';
import { checkoutFormSchema } from '@/shared/constants/checkout-form-schema';
import { addCartItemSchema, updateQuantitySchema } from '@/shared/lib/validation/cart-schemas';

describe('Zod schemas', () => {
  it('validates checkout form', () => {
    const valid = checkoutFormSchema.safeParse({ firstName: 'John', email: 'john@example.com', phone: '+123', address: '123', comment: '' });
    expect(valid.success).toBe(true);
    const invalid = checkoutFormSchema.safeParse({ email: 'invalid' });
    expect(invalid.success).toBe(false);
  });
  it('validates add cart item', () => {
    const valid = addCartItemSchema.safeParse({ productItemId: '123', ingredients: ['a'] });
    expect(valid.success).toBe(true);
  });
  it('validates update quantity', () => {
    const valid = updateQuantitySchema.safeParse({ quantity: 3 });
    expect(valid.success).toBe(true);
    const invalid = updateQuantitySchema.safeParse({ quantity: 0 });
    expect(invalid.success).toBe(false);
  });
});

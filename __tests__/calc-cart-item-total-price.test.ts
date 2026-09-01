import { describe, it, expect } from 'vitest';
import { calcCartItemTotalPrice } from '@/shared/lib/calc-cart-item-total-price';

describe('calcCartItemTotalPrice', () => {
  it('calculates total with base and ingredients', () => {
    const item = {
      quantity: 2,
      productItem: { price: 100 },
      selectedIngredients: [
        { ingredient: { price: 20 }, quantity: 1 },
        { ingredient: { price: 30 }, quantity: 2 },
      ],
    } as any;
    expect(calcCartItemTotalPrice(item)).toBe((100 + 20 + 60) * 2);
  });
  it('handles empty ingredients', () => {
    const item = { quantity: 3, productItem: { price: 50 }, selectedIngredients: [] } as any;
    expect(calcCartItemTotalPrice(item)).toBe(150);
  });
});

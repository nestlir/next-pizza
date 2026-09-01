import { describe, expect, it } from 'vitest';
import { calculateOrderTotal } from '@/shared/lib/order-total';

describe('calculateOrderTotal', () => {
  it('calculates base and ingredient totals in kopecks', () => {
    expect(
      calculateOrderTotal([
        { quantity: 2, price: 50000, ingredients: [{ price: 5000, quantity: 1 }] },
        { quantity: 1, price: 60000, ingredients: [{ price: 7000, quantity: 2 }] },
      ]),
    ).toBe(132000);
  });

  it('rejects invalid money or quantity values', () => {
    expect(() => calculateOrderTotal([{ quantity: 0, price: 100, ingredients: [] }])).toThrow('Invalid quantity');
    expect(() => calculateOrderTotal([{ quantity: 1, price: 10.5, ingredients: [] }])).toThrow('Invalid price');
  });
});

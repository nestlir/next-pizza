export type OrderLine = {
  quantity: number;
  price: number;
  ingredients: Array<{ price: number; quantity?: number | null }>;
};

/** Calculates totals using integer minor currency units only. */
export function calculateOrderTotal(lines: OrderLine[]): number {
  return lines.reduce((total, line) => {
    if (!Number.isSafeInteger(line.quantity) || line.quantity <= 0) throw new Error('Invalid quantity');
    if (!Number.isSafeInteger(line.price) || line.price < 0) throw new Error('Invalid price');

    const ingredientsTotal = line.ingredients.reduce((sum, ingredient) => {
      const quantity = ingredient.quantity ?? 1;
      if (!Number.isSafeInteger(quantity) || quantity <= 0) throw new Error('Invalid ingredient quantity');
      if (!Number.isSafeInteger(ingredient.price) || ingredient.price < 0) throw new Error('Invalid ingredient price');
      return sum + ingredient.price * quantity;
    }, 0);

    return total + (line.price + ingredientsTotal) * line.quantity;
  }, 0);
}

'use client';

import { useCartStore } from '@/shared/store/cart';
import { CartDrawerItem } from './CartDrawerItem';

export const CartDrawer = () => {
  const { items, totalAmount, removeCartItem, updateItemQuantity } = useCartStore();

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-4 z-50">
      <h2 className="text-xl font-bold mb-4">Корзина</h2>
      {items.map((item) => (
        <CartDrawerItem
          key={item.id}
          item={item}
          onQuantityChange={(q) => updateItemQuantity(item.id, q)}
          onRemove={() => removeCartItem(item.id)}
        />
      ))}
      <div className="border-t pt-4 mt-4">
        <p className="text-lg font-semibold">Итого: {totalAmount} ₽</p>
      </div>
    </div>
  );
};

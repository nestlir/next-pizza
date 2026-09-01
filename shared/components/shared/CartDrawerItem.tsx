'use client';

import { CartItem } from '@prisma/client';

interface Props {
  item: CartItem & { productItem: any; selectedIngredients: any[] };
  onQuantityChange: (q: number) => void;
  onRemove: () => void;
}

export const CartDrawerItem = ({ item, onQuantityChange, onRemove }: Props) => {
  return (
    <div className="flex gap-4 border-b py-3">
      <div className="flex-1">
        <p className="font-medium">{item.productItem?.product?.name}</p>
        <p className="text-sm text-gray-500">
          {item.productItem?.attributes?.size} см, {item.productItem?.attributes?.type}
        </p>
        <p className="text-sm text-gray-500">
          Ингредиенты: {item.selectedIngredients?.map((i) => i.ingredient?.name).join(', ')}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <button onClick={() => onQuantityChange(item.quantity - 1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => onQuantityChange(item.quantity + 1)}>+</button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold">{item.quantity * item.productItem?.price} ₽</p>
        <button onClick={onRemove} className="text-red-500 text-sm">Удалить</button>
      </div>
    </div>
  );
};

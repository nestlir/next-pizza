'use client';
import { Product, ProductItem } from '@prisma/client';
import { PizzaSize, PizzaType, mapPizzaType } from '@/shared/constants';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

interface Props {
  product: Product & { items: ProductItem[] };
}

export const ProductCard = ({ product }: Props) => {
  const [size, setSize] = useState<PizzaSize>(PizzaSize.MEDIUM);
  const [type, setType] = useState<PizzaType>(PizzaType.TRADITIONAL);
  const availableItems = product.items.filter(
    (item) => item.attributes?.size === size && item.attributes?.type === type
  );
  const currentItem = availableItems[0] || product.items[0];

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <div className="relative w-full h-48">
        <Image src={product.imageUrl || '/placeholder.png'} alt={product.name} fill className="object-cover rounded" />
      </div>
      <h3 className="text-lg font-bold mt-2">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.description}</p>
      <div className="mt-3 space-y-2">
        <div className="flex gap-2">
          {Object.values(PizzaSize).map((s) => (
            <button key={s} className={cn('px-3 py-1 border rounded', size === s ? 'bg-primary text-white' : 'bg-gray-100')} onClick={() => setSize(s)}>{s} см</button>
          ))}
        </div>
        <div className="flex gap-2">
          {Object.entries(mapPizzaType).map(([typeKey, label]) => (
            <button key={typeKey} className={cn('px-3 py-1 border rounded', type === Number(typeKey) ? 'bg-primary text-white' : 'bg-gray-100')} onClick={() => setType(Number(typeKey) as PizzaType)}>{label}</button>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xl font-bold">{currentItem?.price} ₽</span>
        <button onClick={() => console.log('Add to cart:', currentItem?.id)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Добавить</button>
      </div>
    </div>
  );
};

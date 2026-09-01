'use client';
import { Product, ProductItem, Ingredient } from '@prisma/client';
import { useState } from 'react';
import Image from 'next/image';

interface Props {
  product: Product & { items: ProductItem[]; ingredients: Ingredient[] };
}

export const ProductForm = ({ product }: Props) => {
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(product.items[0] || null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const totalPrice = (selectedItem?.price || 0) + product.ingredients
    .filter(ing => selectedIngredients.includes(ing.id))
    .reduce((sum, ing) => sum + ing.price, 0);

  const toggleIngredient = (id: string) => {
    setSelectedIngredients(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 relative h-80">
          <Image src={product.imageUrl || '/placeholder.png'} alt={product.name} fill className="object-cover rounded-lg" />
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <div className="space-y-2">
            <h3 className="font-semibold">Выберите вариант:</h3>
            <div className="flex flex-wrap gap-2">
              {product.items.map((item) => (
                <button key={item.id} className={`px-4 py-2 border rounded ${selectedItem?.id === item.id ? 'bg-primary text-white' : 'bg-gray-100'}`} onClick={() => setSelectedItem(item)}>
                  {item.attributes?.size || ''} {item.attributes?.type || ''} – {item.price} ₽
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Ингредиенты:</h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing) => (
                <button key={ing.id} className={`px-3 py-1 border rounded ${selectedIngredients.includes(ing.id) ? 'bg-green-200' : 'bg-gray-100'}`} onClick={() => toggleIngredient(ing.id)}>
                  {ing.name} (+{ing.price} ₽)
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-2xl font-bold">{totalPrice} ₽</span>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" onClick={() => console.log({ productItemId: selectedItem?.id, ingredients: selectedIngredients })}>Добавить в корзину</button>
          </div>
        </div>
      </div>
    </div>
  );
};

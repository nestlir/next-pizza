import { prisma } from '@/prisma/prisma-client';
import Link from 'next/link';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ include: { items: true } });
  return (
    <div>
      <h1>Товары</h1>
      <Link href="/dashboard/products/new" className="bg-blue-600 text-white p-2 inline-block mb-4">Добавить</Link>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - {p.price} ₽</li>
        ))}
      </ul>
    </div>
  );
}

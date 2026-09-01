import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/shared/components/shared/ProductForm';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { title: 'Товар не найден' };
  return {
    title: `${product.name} | Next Pizza`,
    description: product.description || `Купить ${product.name}`,
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { items: true, ingredients: true },
  });
  if (!product) notFound();
  return <ProductForm product={product} />;
}

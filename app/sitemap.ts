import { MetadataRoute } from 'next';
import { prisma } from '@/prisma/prisma-client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://next-pizza.example.com';
  const products = await prisma.product.findMany({ select: { id: true, updatedAt: true } });
  const productUrls = products.map(p => ({ url: `${baseUrl}/product/${p.id}`, lastModified: p.updatedAt }));
  return [{ url: baseUrl, lastModified: new Date() }, ...productUrls];
}

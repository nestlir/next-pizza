import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { items: true, ingredients: true },
  });
  return NextResponse.json(product);
}

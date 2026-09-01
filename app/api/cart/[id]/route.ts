import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateQuantitySchema } from '@/shared/lib/validation/cart-schemas';
import { z } from 'zod';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { quantity } = updateQuantitySchema.parse(body);

    const cookieStore = await cookies();
    const cartToken = cookieStore.get('cartToken')?.value;
    if (!cartToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: { cart: true },
    });
    if (!cartItem || cartItem.cart.token !== cartToken) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { selectedIngredients: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const cartToken = cookieStore.get('cartToken')?.value;
    if (!cartToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: { cart: true },
    });
    if (!cartItem || cartItem.cart.token !== cartToken) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.cartItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

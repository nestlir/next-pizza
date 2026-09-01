import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { z } from 'zod';
import { prisma } from '@/prisma/prisma-client';
import { addCartItemSchema } from '@/shared/lib/validation/cart-schemas';

const CART_COOKIE = 'cartToken';
const cartTokenSchema = z.string().uuid();

async function getOrCreateCart(token: string) {
  return prisma.cart.upsert({
    where: { token },
    create: { token },
    update: {},
    include: {
      items: {
        include: {
          productItem: true,
          selectedIngredients: { include: { ingredient: true } },
        },
      },
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productItemId, ingredients = [] } = addCartItemSchema.parse(body);
    const ingredientIds = [...new Set(ingredients)];

    const productItem = await prisma.productItem.findUnique({
      where: { id: productItemId },
      include: { product: { select: { id: true } } },
    });
    if (!productItem) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    if (productItem.stock <= 0) return NextResponse.json({ error: 'Product is out of stock' }, { status: 409 });

    const validIngredients = ingredientIds.length
      ? await prisma.ingredient.findMany({ where: { id: { in: ingredientIds } } })
      : [];
    if (validIngredients.length !== ingredientIds.length) {
      return NextResponse.json({ error: 'Invalid ingredient' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const existingToken = cookieStore.get(CART_COOKIE)?.value;
    const cartToken = existingToken ? cartTokenSchema.parse(existingToken) : crypto.randomUUID();
    const cart = await getOrCreateCart(cartToken);

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productItemId,
        selectedIngredients: {
          create: validIngredients.map((ingredient) => ({ ingredientId: ingredient.id })),
        },
      },
      include: {
        productItem: true,
        selectedIngredients: { include: { ingredient: true } },
      },
    });

    const response = NextResponse.json({ cartItem });
    if (!existingToken) {
      response.cookies.set(CART_COOKIE, cartToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.issues }, { status: 400 });
    }
    console.error('cart_add_failed', { error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(CART_COOKIE)?.value;
    if (!rawToken) return NextResponse.json({ items: [] });
    const token = cartTokenSchema.parse(rawToken);

    const cart = await prisma.cart.findUnique({
      where: { token },
      include: {
        items: {
          include: {
            productItem: true,
            selectedIngredients: { include: { ingredient: true } },
          },
        },
      },
    });

    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid cart token' }, { status: 400 });
    console.error('cart_get_failed', { error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

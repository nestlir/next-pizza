'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/prisma/prisma-client';
import { checkoutFormSchema } from '@/shared/constants/checkout-form-schema';
import { createPayment } from '@/shared/lib/create-payment';
import { sendOrderEmail } from '@/shared/lib/send-email';

const cartTokenSchema = z.string().uuid();

/** Creates an order snapshot and payment without destroying the cart on payment failure. */
export async function createOrder(input: unknown) {
  const data = checkoutFormSchema.parse(input);
  const cookieStore = await cookies();
  const rawToken = cookieStore.get('cartToken')?.value;

  if (!rawToken) throw new Error('Cart not found');
  const cartToken = cartTokenSchema.parse(rawToken);

  const cart = await prisma.cart.findUnique({
    where: { token: cartToken },
    include: {
      items: {
        include: {
          productItem: true,
          selectedIngredients: { include: { ingredient: true } },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

  const total = cart.items.reduce((sum, item) => {
    const ingredientTotal = item.selectedIngredients.reduce(
      (ingredientSum, selected) =>
        ingredientSum + selected.ingredient.price * (selected.quantity ?? 1),
      0,
    );
    return sum + (item.productItem.price + ingredientTotal) * item.quantity;
  }, 0);

  if (!Number.isSafeInteger(total) || total <= 0) throw new Error('Invalid order total');

  try {
    const order = await prisma.order.create({
      data: {
        userId: cart.userId,
        total,
        status: 'PAYMENT_PENDING',
        address: data.address.trim(),
        comment: data.comment?.trim() || null,
        items: {
          create: cart.items.map((item) => ({
            productItemId: item.productItemId,
            quantity: item.quantity,
            price: item.productItem.price,
            selectedIngredients: item.selectedIngredients.map((selected) => ({
              ingredientId: selected.ingredientId,
              quantity: selected.quantity,
            })),
          })),
        },
      },
    });

    try {
      const payment = await createPayment({
        amount: total,
        description: `Заказ #${order.id}`,
        orderId: order.id,
      });

      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { paymentId: payment.id },
        }),
        prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
      ]);

      void sendOrderEmail({ orderId: order.id, email: data.email, paymentUrl: payment.confirmation_url }).catch(
        (error) => console.error('order_email_failed', { orderId: order.id, error }),
      );

      revalidatePath('/profile');
      return { url: payment.confirmation_url, orderId: order.id };
    } catch (paymentError) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAYMENT_FAILED' },
      });
      throw paymentError;
    }
  } catch (error) {
    console.error('create_order_failed', { cartId: cart.id, error });
    throw new Error('Unable to create order');
  }
}

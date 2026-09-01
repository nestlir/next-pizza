'use server';

import { prisma } from '@/prisma/prisma-client';
import { cookies } from 'next/headers';
import { CheckoutFormValues } from '@/shared/constants/checkout-form-schema';
import { createPayment } from '@/shared/lib/create-payment';
import { sendOrderEmail } from '@/shared/lib/send-email';
import { revalidatePath } from 'next/cache';

export async function createOrder(data: CheckoutFormValues) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('cartToken')?.value;
  if (!cartToken) throw new Error('Cart not found');

  // Находим корзину
  const cart = await prisma.cart.findUnique({
    where: { token: cartToken },
    include: { items: { include: { productItem: true, selectedIngredients: true } } },
  });
  if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

  // Вычисляем общую сумму
  const total = cart.items.reduce((sum, item) => {
    const basePrice = item.productItem?.price || 0;
    const ingredientsPrice = item.selectedIngredients?.reduce(
      (s, si) => s + (si.ingredient?.price || 0) * (si.quantity || 1), 0
    ) || 0;
    return sum + (basePrice + ingredientsPrice) * item.quantity;
  }, 0);

  // Создаём заказ в транзакции
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: cart.userId || 'anonymous',
        total,
        status: 'PENDING',
        address: data.address,
        comment: data.comment,
        items: {
          create: cart.items.map((item) => ({
            productItemId: item.productItemId,
            quantity: item.quantity,
            price: item.productItem?.price || 0,
            selectedIngredients: item.selectedIngredients,
          })),
        },
      },
    });

    // Очищаем корзину
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return newOrder;
  });

  // Создаём платёж (YooKassa)
  const payment = await createPayment({
    amount: total,
    description: `Заказ #${order.id}`,
    orderId: order.id,
  });

  // Обновляем заказ с paymentId
  await prisma.order.update({
    where: { id: order.id },
    data: { paymentId: payment.id },
  });

  // Отправляем email (асинхронно, можно без await)
  sendOrderEmail({ order, paymentUrl: payment.confirmation_url });

  revalidatePath('/profile');
  return { url: payment.confirmation_url };
}
EOFcat > shared/lib/create-payment.ts <<'EOF'
import { YooKassa } from '@yookassa/sdk';

const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_STORE_ID!,
  secretKey: process.env.YOOKASSA_API_KEY!,
});

export const createPayment = async (data: { amount: number; description: string; orderId: string }) => {
  const response = await yooKassa.createPayment({
    amount: { value: data.amount, currency: 'RUB' },
    description: data.description,
    confirmation: { type: 'redirect', return_url: process.env.YOOKASSA_CALLBACK_URL! },
    metadata: { orderId: data.orderId },
  });
  return { id: response.id, confirmation_url: response.confirmation.confirmation_url };
};

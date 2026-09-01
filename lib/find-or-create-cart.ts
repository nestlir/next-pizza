import { prisma } from '@/prisma/prisma-client';
import { cookies } from 'next/headers';

export async function findOrCreateCart() {
  const cookieStore = await cookies();
  let cartToken = cookieStore.get('cartToken')?.value;

  if (!cartToken) {
    cartToken = crypto.randomUUID();
    // Установим cookie (в реальном коде это делается через response)
    // Здесь возвращаем только объект, а установку cookie делаем в обработчике
  }

  let cart = await prisma.cart.findUnique({
    where: { userId: cartToken }, // или используем специальное поле? 
    include: { items: { include: { productItem: true, selectedIngredients: true } } },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: cartToken, // временно используем userId как токен
        // В реальной модели Cart поле userId уникально, но мы можем хранить токен в отдельном поле,
        // для упрощения используем userId как хранилище cartToken.
      },
      include: { items: { include: { productItem: true, selectedIngredients: true } } },
    });
  }

  return { cart, cartToken };
}
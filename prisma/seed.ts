import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.verificationCode.deleteMany();
  await prisma.productItem.deleteMany();
  await prisma.productIngredient.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.storyItem.deleteMany();
  await prisma.story.deleteMany();
  await prisma.user.deleteMany();

  await prisma.category.createMany({
    data: [
      { name: 'Пицца', slug: 'pizza' },
      { name: 'Закуски', slug: 'snacks' },
      { name: 'Напитки', slug: 'drinks' },
    ],
  });

  await prisma.ingredient.createMany({
    data: [
      { name: 'Сыр', price: 5000 },
      { name: 'Бекон', price: 7000 },
      { name: 'Грибы', price: 4000 },
      { name: 'Помидоры', price: 3000 },
    ],
  });

  const pizzaCategory = await prisma.category.findUnique({ where: { slug: 'pizza' } });
  if (!pizzaCategory) throw new Error('Pizza category was not created');

  const margherita = await prisma.product.create({
    data: {
      name: 'Маргарита',
      slug: 'margherita',
      description: 'Классическая пицца с томатным соусом и сыром',
      price: 50000,
      categoryId: pizzaCategory.id,
    },
  });

  const pepperoni = await prisma.product.create({
    data: {
      name: 'Пепперони',
      slug: 'pepperoni',
      description: 'Пицца с пепперони и сыром',
      price: 60000,
      categoryId: pizzaCategory.id,
    },
  });

  await prisma.productItem.createMany({
    data: [
      { sku: 'MARG-S', price: 40000, stock: 10, productId: margherita.id, attributes: { size: 'small' } },
      { sku: 'MARG-M', price: 50000, stock: 15, productId: margherita.id, attributes: { size: 'medium' } },
      { sku: 'PEPP-M', price: 60000, stock: 8, productId: pepperoni.id, attributes: { size: 'medium' } },
    ],
  });

  const cheese = await prisma.ingredient.findFirst({ where: { name: 'Сыр' } });
  const bacon = await prisma.ingredient.findFirst({ where: { name: 'Бекон' } });
  if (!cheese || !bacon) throw new Error('Required ingredients were not created');

  await prisma.productIngredient.createMany({
    data: [
      { productId: margherita.id, ingredientId: cheese.id, quantity: 1 },
      { productId: pepperoni.id, ingredientId: cheese.id, quantity: 1 },
      { productId: pepperoni.id, ingredientId: bacon.id, quantity: 2 },
    ],
  });

  await prisma.story.create({
    data: {
      title: 'Акция дня',
      items: {
        create: [
          { mediaUrl: '/stories/1.jpg', description: 'Скидка 20% на пиццу', order: 0 },
          { mediaUrl: '/stories/2.jpg', description: 'Новый вкус!', order: 1 },
        ],
      },
    },
  });

  await prisma.story.create({
    data: {
      title: 'Новинки',
      items: {
        create: [{ mediaUrl: '/stories/3.jpg', description: 'Попробуйте пепперони', order: 0 }],
      },
    },
  });

  const hashedPassword = await hash('password123', 10);
  await prisma.user.createMany({
    data: [
      {
        email: 'user@example.com',
        passwordHash: hashedPassword,
        name: 'Тестовый пользователь',
        phone: '+1234567890',
      },
      {
        email: 'admin@example.com',
        passwordHash: hashedPassword,
        name: 'Админ',
        phone: '+0987654321',
      },
    ],
  });

  console.info('Seed completed successfully');
}

main()
  .catch((error) => {
    console.error('Seed failed', { error });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

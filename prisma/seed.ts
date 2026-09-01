import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Удаляем старые данные (опционально)
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

  // 1. Категории
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Пицца', slug: 'pizza' },
      { name: 'Закуски', slug: 'snacks' },
      { name: 'Напитки', slug: 'drinks' },
    ],
  });

  // 2. Ингредиенты
  const ingredients = await prisma.ingredient.createMany({
    data: [
      { name: 'Сыр', price: 50 },
      { name: 'Бекон', price: 70 },
      { name: 'Грибы', price: 40 },
      { name: 'Помидоры', price: 30 },
    ],
  });

  // 3. Продукты (связываем с категориями)
  const pizzaCategory = await prisma.category.findUnique({ where: { slug: 'pizza' } });
  const snackCategory = await prisma.category.findUnique({ where: { slug: 'snacks' } });

  // Создаём продукты и их варианты (productItems)
  const margherita = await prisma.product.create({
    data: {
      name: 'Маргарита',
      slug: 'margherita',
      description: 'Классическая пицца с томатным соусом и сыром',
      price: 500,
      categoryId: pizzaCategory.id,
    },
  });

  const pepperoni = await prisma.product.create({
    data: {
      name: 'Пепперони',
      slug: 'pepperoni',
      description: 'Пицца с пепперони и сыром',
      price: 600,
      categoryId: pizzaCategory.id,
    },
  });

  // Варианты товаров (размеры)
  await prisma.productItem.createMany({
    data: [
      { sku: 'MARG-S', price: 400, stock: 10, productId: margherita.id, attributes: { size: 'small' } },
      { sku: 'MARG-M', price: 500, stock: 15, productId: margherita.id, attributes: { size: 'medium' } },
      { sku: 'PEPP-M', price: 600, stock: 8, productId: pepperoni.id, attributes: { size: 'medium' } },
    ],
  });

  // 4. Связываем продукты с ингредиентами (ProductIngredient)
  const cheese = await prisma.ingredient.findFirst({ where: { name: 'Сыр' } });
  const bacon = await prisma.ingredient.findFirst({ where: { name: 'Бекон' } });

  await prisma.productIngredient.createMany({
    data: [
      { productId: margherita.id, ingredientId: cheese.id, quantity: 1 },
      { productId: pepperoni.id, ingredientId: cheese.id, quantity: 1 },
      { productId: pepperoni.id, ingredientId: bacon.id, quantity: 2 },
    ],
  });

  // 5. Истории (Stories)
  const story1 = await prisma.story.create({
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

  const story2 = await prisma.story.create({
    data: {
      title: 'Новинки',
      items: {
        create: [{ mediaUrl: '/stories/3.jpg', description: 'Попробуйте пепперони', order: 0 }],
      },
    },
  });

  // 6. Тестовые пользователи (только для разработки)
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

  console.log('✅ Seed завершён успешно!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOFmkdir -p shared/lib && cat > shared/lib/find-or-create-cart.ts <<'EOF'
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
EOFcat > prisma/schema.prisma <<'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String              @id @default(cuid())
  email             String              @unique
  passwordHash      String
  name              String?
  phone             String?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  cart              Cart?
  orders            Order[]
  verificationCodes VerificationCode[]
}

model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  imageUrl    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  products    Product[]
}

model Product {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  price       Float
  imageUrl    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  items       ProductItem[]
  ingredients ProductIngredient[]
}

model ProductItem {
  id          String    @id @default(cuid())
  sku         String    @unique
  price       Float
  stock       Int       @default(0)
  attributes  Json?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  productId   String
  product     Product   @relation(fields: [productId], references: [id])
  cartItems   CartItem[]
}

model Ingredient {
  id          String    @id @default(cuid())
  name        String
  price       Float     @default(0)
  imageUrl    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  products    ProductIngredient[]
  cartItems   CartItemIngredient[]
}

model ProductIngredient {
  productId    String
  ingredientId String
  quantity     Int?
  product      Product    @relation(fields: [productId], references: [id])
  ingredient   Ingredient @relation(fields: [ingredientId], references: [id])
  @@id([productId, ingredientId])
}

model Cart {
  id          String    @id @default(cuid())
  userId      String    @unique
  user        User      @relation(fields: [userId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  items       CartItem[]
}

model CartItem {
  id            String   @id @default(cuid())
  quantity      Int      @default(1)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  cartId        String
  cart          Cart     @relation(fields: [cartId], references: [id])
  productItemId String
  productItem   ProductItem @relation(fields: [productItemId], references: [id])
  selectedIngredients CartItemIngredient[]
}

model CartItemIngredient {
  cartItemId   String
  ingredientId String
  quantity     Int?
  cartItem     CartItem   @relation(fields: [cartItemId], references: [id])
  ingredient   Ingredient @relation(fields: [ingredientId], references: [id])
  @@id([cartItemId, ingredientId])
}

model Order {
  id          String    @id @default(cuid())
  total       Float
  status      OrderStatus @default(PENDING)
  address     String?
  comment     String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  items       OrderItem[]
}

model OrderItem {
  id            String   @id @default(cuid())
  quantity      Int
  price         Float
  createdAt     DateTime @default(now())
  orderId       String
  order         Order    @relation(fields: [orderId], references: [id])
  productItemId String
  productItem   ProductItem @relation(fields: [productItemId], references: [id])
  selectedIngredients Json?
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}

model VerificationCode {
  id          String    @id @default(cuid())
  code        String
  type        CodeType  @default(EMAIL)
  expiresAt   DateTime
  used        Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], references: [id])
}

enum CodeType {
  EMAIL
  PHONE
}

model Story {
  id          String    @id @default(cuid())
  title       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  items       StoryItem[]
}

model StoryItem {
  id          String    @id @default(cuid())
  mediaUrl    String
  description String?
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  storyId     String
  story       Story     @relation(fields: [storyId], references: [id])
}
EOFcat > prisma/schema.prisma <<'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String              @id @default(cuid())
  email             String              @unique
  passwordHash      String
  name              String?
  phone             String?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  cart              Cart?
  orders            Order[]
  verificationCodes VerificationCode[]
}

model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  imageUrl    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  products    Product[]
}

model Product {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  price       Float
  imageUrl    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  items       ProductItem[]
  ingredients ProductIngredient[]
}

model ProductItem {
  id          String    @id @default(cuid())
  sku         String    @unique
  price       Float
  stock       Int       @default(0)
  attributes  Json?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  productId   String
  product     Product   @relation(fields: [productId], references: [id])
  cartItems   CartItem[]
}

model Ingredient {
  id          String    @id @default(cuid())
  name        String
  price       Float     @default(0)
  imageUrl    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  products    ProductIngredient[]
  cartItems   CartItemIngredient[]
}

model ProductIngredient {
  productId    String
  ingredientId String
  quantity     Int?
  product      Product    @relation(fields: [productId], references: [id])
  ingredient   Ingredient @relation(fields: [ingredientId], references: [id])
  @@id([productId, ingredientId])
}

model Cart {
  id          String    @id @default(cuid())
  userId      String    @unique
  user        User      @relation(fields: [userId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  items       CartItem[]
}

model CartItem {
  id            String   @id @default(cuid())
  quantity      Int      @default(1)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  cartId        String
  cart          Cart     @relation(fields: [cartId], references: [id])
  productItemId String
  productItem   ProductItem @relation(fields: [productItemId], references: [id])
  selectedIngredients CartItemIngredient[]
}

model CartItemIngredient {
  cartItemId   String
  ingredientId String
  quantity     Int?
  cartItem     CartItem   @relation(fields: [cartItemId], references: [id])
  ingredient   Ingredient @relation(fields: [ingredientId], references: [id])
  @@id([cartItemId, ingredientId])
}

model Order {
  id          String    @id @default(cuid())
  total       Float
  status      OrderStatus @default(PENDING)
  address     String?
  comment     String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  items       OrderItem[]
}

model OrderItem {
  id            String   @id @default(cuid())
  quantity      Int
  price         Float
  createdAt     DateTime @default(now())
  orderId       String
  order         Order    @relation(fields: [orderId], references: [id])
  productItemId String
  productItem   ProductItem @relation(fields: [productItemId], references: [id])
  selectedIngredients Json?
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}

model VerificationCode {
  id          String    @id @default(cuid())
  code        String
  type        CodeType  @default(EMAIL)
  expiresAt   DateTime
  used        Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], references: [id])
}

enum CodeType {
  EMAIL
  PHONE
}

model Story {
  id          String    @id @default(cuid())
  title       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  items       StoryItem[]
}

model StoryItem {
  id          String    @id @default(cuid())
  mediaUrl    String
  description String?
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  storyId     String
  story       Story     @relation(fields: [storyId], references: [id])
}

-- Audit hardening: guest carts, integer money, payment state and nullable guest orders.

ALTER TABLE "Cart" ADD COLUMN "token" TEXT;
UPDATE "Cart" SET "token" = md5("id" || random()::text) WHERE "token" IS NULL;
ALTER TABLE "Cart" ALTER COLUMN "token" SET NOT NULL;
CREATE UNIQUE INDEX "Cart_token_key" ON "Cart"("token");

ALTER TABLE "Cart" ALTER COLUMN "userId" DROP NOT NULL;

ALTER TABLE "Product" ALTER COLUMN "price" TYPE INTEGER USING ROUND("price" * 100)::INTEGER;
ALTER TABLE "ProductItem" ALTER COLUMN "price" TYPE INTEGER USING ROUND("price" * 100)::INTEGER;
ALTER TABLE "Ingredient" ALTER COLUMN "price" TYPE INTEGER USING ROUND("price" * 100)::INTEGER;
ALTER TABLE "Order" ALTER COLUMN "total" TYPE INTEGER USING ROUND("total" * 100)::INTEGER;
ALTER TABLE "OrderItem" ALTER COLUMN "price" TYPE INTEGER USING ROUND("price" * 100)::INTEGER;

ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "Order" ADD COLUMN "paymentId" TEXT;
CREATE UNIQUE INDEX "Order_paymentId_key" ON "Order"("paymentId");

ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PAYMENT_PENDING';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PAYMENT_FAILED';

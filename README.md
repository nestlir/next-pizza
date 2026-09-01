# Next Pizza

Next.js pizza delivery application with PostgreSQL, Prisma, NextAuth, YooKassa and Resend.

## Requirements

- Node.js 20+
- PostgreSQL 16+
- npm

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the required secrets.
2. Install dependencies:

```bash
npm ci
```

3. Start PostgreSQL:

```bash
docker compose up -d
```

4. Generate Prisma Client and apply migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

5. For local development data, run:

```bash
npm run prisma:seed
```

6. Start the application:

```bash
npm run dev
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs the same quality gates against PostgreSQL.

## Money model

All monetary values are stored as integer minor units (kopecks). YooKassa receives a formatted RUB amount with two decimal places.

## Checkout and payments

Guest carts are identified by a signed-by-application, HTTP-only `cartToken` cookie and do not require a `User` row. Orders snapshot cart prices before payment. The cart is cleared only after YooKassa payment creation succeeds; payment failure leaves the cart intact and marks the order as `PAYMENT_FAILED`.

Payment webhooks validate their shape, match both the order ID and payment ID, and only perform allowed state transitions.

## Production

The repository includes a standalone Next.js `Dockerfile`. Configure all variables from `.env.example` in the deployment environment. Never commit `.env.local` or real provider credentials.

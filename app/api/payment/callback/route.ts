import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const webhookSchema = z.object({
  event: z.string(),
  object: z.object({
    id: z.string().min(1),
    status: z.string(),
    metadata: z.object({ orderId: z.string().min(1) }).optional(),
  }),
});

const PAYMENT_EVENTS = new Set(['payment.succeeded', 'payment.canceled']);

export async function POST(req: NextRequest) {
  try {
    const payload = webhookSchema.parse(await req.json());
    if (!PAYMENT_EVENTS.has(payload.event)) return NextResponse.json({ success: true });

    const order = await prisma.order.findUnique({ where: { id: payload.object.metadata?.orderId } });
    if (!order || order.paymentId !== payload.object.id) {
      return NextResponse.json({ error: 'Payment/order mismatch' }, { status: 400 });
    }

    const nextStatus = payload.event === 'payment.succeeded' ? 'PAID' : 'PAYMENT_FAILED';
    const validTransition =
      nextStatus === 'PAID'
        ? ['PAYMENT_PENDING', 'PENDING'].includes(order.status)
        : ['PAYMENT_PENDING', 'PENDING'].includes(order.status);

    if (validTransition) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: nextStatus },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }
    console.error('payment_webhook_failed', { error });
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

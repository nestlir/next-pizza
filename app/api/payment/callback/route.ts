import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { sendSuccessOrderEmail } from '@/shared/lib/send-email';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { event, object } = body;

  if (event === 'payment.succeeded') {
    const paymentId = object.id;
    const order = await prisma.order.findFirst({
      where: { paymentId },
    });
    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'SUCCEEDED' },
      });
      await sendSuccessOrderEmail(order);
    }
  }

  return NextResponse.json({ success: true });
}

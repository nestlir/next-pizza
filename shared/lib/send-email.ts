import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.ORDER_EMAIL_FROM;

export type OrderEmailInput = {
  orderId: string;
  email: string;
  paymentUrl: string;
};

/** Sends a non-blocking checkout email; checkout itself must not depend on email delivery. */
export async function sendOrderEmail(input: OrderEmailInput): Promise<void> {
  if (!apiKey || !from) {
    console.warn('order_email_skipped', { reason: 'email_not_configured', orderId: input.orderId });
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: input.email,
    subject: `Заказ #${input.orderId}`,
    html: `<p>Спасибо за заказ #${input.orderId}.</p><p><a href="${input.paymentUrl}">Перейти к оплате</a></p>`,
  });

  if (error) throw new Error(`Email delivery failed: ${error.message}`);
}

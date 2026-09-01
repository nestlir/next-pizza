import { YooKassa } from '@yookassa/sdk';

const shopId = process.env.YOOKASSA_STORE_ID;
const secretKey = process.env.YOOKASSA_API_KEY;
const returnUrl = process.env.YOOKASSA_CALLBACK_URL;

if (!shopId || !secretKey || !returnUrl) {
  throw new Error('YooKassa environment variables are not configured');
}

const yooKassa = new YooKassa({ shopId, secretKey });

export type CreatePaymentInput = {
  amount: number;
  description: string;
  orderId: string;
};

export type CreatedPayment = {
  id: string;
  confirmation_url: string;
};

/** Creates a redirect payment using integer kopecks as the internal money unit. */
export async function createPayment(data: CreatePaymentInput): Promise<CreatedPayment> {
  if (!Number.isSafeInteger(data.amount) || data.amount <= 0) {
    throw new Error('Payment amount must be a positive integer');
  }

  const response = await yooKassa.createPayment({
    amount: { value: (data.amount / 100).toFixed(2), currency: 'RUB' },
    description: data.description,
    confirmation: { type: 'redirect', return_url: returnUrl },
    metadata: { orderId: data.orderId },
  });

  const confirmationUrl = response.confirmation?.confirmation_url;
  if (!response.id || !confirmationUrl) {
    throw new Error('YooKassa returned an incomplete payment response');
  }

  return { id: response.id, confirmation_url: confirmationUrl };
}

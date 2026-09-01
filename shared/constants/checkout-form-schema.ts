import { z } from 'zod';

export const checkoutFormSchema = z.object({
  firstName: z.string().min(1, 'Введите имя'),
  lastName: z.string().optional(),
  email: z.string().email('Некорректный email'),
  phone: z.string().min(10, 'Введите телефон'),
  address: z.string().min(1, 'Введите адрес'),
  comment: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

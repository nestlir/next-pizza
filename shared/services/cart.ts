import { instance } from './instance';

export const cartApi = {
  getCart: () => instance.get('/cart'),
  addCartItem: (data: { productItemId: string; ingredients?: string[] }) =>
    instance.post('/cart', data),
  updateItemQuantity: (id: string, quantity: number) =>
    instance.patch(`/cart/${id}`, { quantity }),
  removeCartItem: (id: string) => instance.delete(`/cart/${id}`),
};

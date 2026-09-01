import { instance } from './instance';

export const productsApi = {
  getProduct: (id: string) => instance.get(`/product/${id}`),
  getProducts: (params?: any) => instance.get('/products', { params }),
};

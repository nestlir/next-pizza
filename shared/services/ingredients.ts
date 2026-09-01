import { instance } from './instance';

export const ingredientsApi = {
  getAll: () => instance.get('/ingredients'),
};

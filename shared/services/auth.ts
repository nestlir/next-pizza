import { instance } from './instance';

export const authApi = {
  login: (data: { email: string; password: string }) =>
    instance.post('/auth/login', data),
  register: (data: { email: string; password: string; name: string }) =>
    instance.post('/auth/register', data),
  verify: (code: string) => instance.post('/auth/verify', { code }),
};

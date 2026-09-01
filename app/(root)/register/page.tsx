'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/shared/services/auth';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authApi.register({ name, email, password });
    router.push('/verify');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Регистрация</h1>
      <input type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2" />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2" />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2" />
      <button type="submit" className="w-full bg-blue-600 text-white p-2">Зарегистрироваться</button>
    </form>
  );
}

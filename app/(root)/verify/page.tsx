'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/shared/services/auth';

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authApi.verify(code);
    router.push('/login');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Подтверждение email</h1>
      <p>Введите код из письма</p>
      <input type="text" placeholder="Код" value={code} onChange={(e) => setCode(e.target.value)} className="w-full border p-2" />
      <button type="submit" className="w-full bg-blue-600 text-white p-2">Подтвердить</button>
    </form>
  );
}

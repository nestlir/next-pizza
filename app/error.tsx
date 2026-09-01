'use client';
import { useEffect } from 'react';
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Ошибка приложения</h1>
      <p className="text-gray-500 mt-2">Произошла непредвиденная ошибка</p>
      <button onClick={reset} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Попробовать снова</button>
    </div>
  );
}

'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-2xl font-bold">Что-то пошло не так</h1>
      <p className="text-gray-500 mt-2">Попробуйте обновить страницу</p>
      <button onClick={reset} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Попробовать снова
      </button>
    </div>
  );
}

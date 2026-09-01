import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-gray-500">Страница оформления не найдена</p>
      <Link href="/" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">На главную</Link>
    </div>
  );
}

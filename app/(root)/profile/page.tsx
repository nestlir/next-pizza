import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/constants/auth-options';
import { prisma } from '@/prisma/prisma-client';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { orders: true },
  });

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Профиль</h1>
      <p>Имя: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <h2 className="text-xl font-semibold mt-6">Заказы</h2>
      {user?.orders.length === 0 && <p>Нет заказов</p>}
      {user?.orders.map((order) => (
        <div key={order.id} className="border p-4 my-2">
          <p>Заказ #{order.id}</p>
          <p>Сумма: {order.total} ₽</p>
          <p>Статус: {order.status}</p>
        </div>
      ))}
    </div>
  );
}

import { prisma } from '@/prisma/prisma-client';
import { OrderStatus } from '@prisma/client';

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: OrderStatus }> }) {
  const { status } = await searchParams;
  const orders = await prisma.order.findMany({
    where: status ? { status } : {},
    include: { user: true },
  });

  return (
    <div>
      <h1>Заказы</h1>
      <div className="flex gap-2 my-4">
        <a href="?status=PENDING" className="border p-1">В ожидании</a>
        <a href="?status=SUCCEEDED" className="border p-1">Оплачены</a>
        <a href="?status=CANCELLED" className="border p-1">Отменены</a>
        <a href="?" className="border p-1">Все</a>
      </div>
      <table className="w-full border">
        <thead>
          <tr><th>ID</th><th>Клиент</th><th>Статус</th><th>Сумма</th><th>Дата</th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user?.email || 'Аноним'}</td>
              <td>{o.status}</td>
              <td>{o.total}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

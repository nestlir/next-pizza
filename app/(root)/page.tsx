import { prisma } from '@/prisma/prisma-client';
import { TopBar, Stories, Filters, ProductList } from '@/shared/components/shared';

export default async function HomePage() {
  // Получаем категории с продуктами (только те, у которых есть товары)
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          items: true,
          ingredients: true,
        },
      },
    },
  });

  // Фильтруем категории, где есть продукты
  const filteredCategories = categories.filter(
    (category) => category.products.length > 0
  );

  return (
    <>
      <TopBar categories={filteredCategories} />
      <Stories />
      <Filters />
      <ProductList categories={filteredCategories} />
    </>
  );
}

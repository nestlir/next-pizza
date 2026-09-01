import { Product, ProductItem } from '@prisma/client';
import { ProductCard } from './ProductCard';

interface Props {
  categories: (Category & { products: (Product & { items: ProductItem[] })[] })[];
}

export const ProductList = ({ categories }: Props) => {
  return (
    <div className="space-y-12">
      {categories.map((cat) => (
        <section key={cat.id} id={cat.slug}>
          <h2 className="text-2xl font-bold mb-4">{cat.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cat.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

import { cn } from '@/shared/lib/utils';
import { Container } from './Container';
import { Category } from '@prisma/client';

interface Props {
  categories: Category[];
  className?: string;
}

export const TopBar = ({ categories, className }: Props) => {
  return (
    <div className={cn('sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10', className)}>
      <Container className="flex items-center justify-between overflow-x-auto">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`#${cat.slug}`}
            className="px-4 py-2 font-medium text-gray-700 hover:text-primary transition-colors whitespace-nowrap"
          >
            {cat.name}
          </a>
        ))}
      </Container>
    </div>
  );
};

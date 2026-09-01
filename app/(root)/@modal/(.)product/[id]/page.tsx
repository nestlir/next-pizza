'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProductForm } from '@/shared/components/shared/ProductForm';
import { Dialog } from '@/shared/components/ui';

export default function ProductModal({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const { id } = await params;

  useEffect(() => {
    // Загружаем данные продукта на клиенте (можно использовать SWR или fetch)
    fetch(`/api/product/${id}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(console.error);
  }, [id]);

  const handleClose = () => {
    router.back();
  };

  if (!product) return <Dialog open onOpenChange={handleClose}>Loading...</Dialog>;

  return (
    <Dialog open onOpenChange={handleClose}>
      <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg">
        <ProductForm product={product} />
      </div>
    </Dialog>
  );
}

export const CartSkeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="flex gap-4 border-b py-3">
      <div className="w-16 h-16 bg-gray-200 rounded"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="w-12 h-6 bg-gray-200 rounded"></div>
    </div>
  </div>
);

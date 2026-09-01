export const ProductCardSkeleton = () => (
  <div className="border rounded-lg p-4 animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded"></div>
    <div className="h-4 bg-gray-200 mt-2 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 mt-1 rounded w-1/2"></div>
    <div className="flex justify-between mt-4">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

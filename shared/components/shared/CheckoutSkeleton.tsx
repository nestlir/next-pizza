export const CheckoutSkeleton = () => (
  <div className="animate-pulse grid grid-cols-2 gap-8">
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

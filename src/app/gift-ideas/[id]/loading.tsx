export default function GiftIdeaLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-6">
          <div>
            <div className="mb-2 h-4 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          
          <div>
            <div className="mb-2 h-4 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          
          <div>
            <div className="mb-2 h-4 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-20 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          
          <div className="flex gap-4">
            <div className="h-10 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-10 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
} 
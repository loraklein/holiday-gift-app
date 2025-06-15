import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
}

export function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex animate-pulse flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
      
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 h-6 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 h-6 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
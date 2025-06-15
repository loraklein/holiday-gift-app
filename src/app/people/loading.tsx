export default function PeopleLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">People</h1>
        <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex animate-pulse flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mb-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-auto flex justify-between">
              <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
import Card from '@/components/ui/Card';

export default function BirthdaysLoading() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-[120px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-10 w-[120px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 
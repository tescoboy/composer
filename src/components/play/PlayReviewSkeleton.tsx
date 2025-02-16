export default function PlayReviewSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[70vh] bg-gray-200 dark:bg-gray-800" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[3/2] bg-gray-200 dark:bg-gray-800 rounded" />
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-xl p-6 h-96" />
          </aside>
        </div>
      </div>
    </div>
  );
} 
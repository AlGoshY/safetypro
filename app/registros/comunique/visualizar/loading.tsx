export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 mb-6 animate-pulse">
        <div className="h-8 w-64 bg-white/20 rounded mb-2"></div>
        <div className="h-4 w-96 bg-white/20 rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
            <div className="flex items-center">
              <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full mr-3 h-10 w-10"></div>
              <div>
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden animate-pulse">
        <div className="h-12 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700"></div>
        <div className="h-96 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    </div>
  )
}

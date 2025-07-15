export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
      <p className="ml-4 text-gray-900 dark:text-gray-100">Loading...</p>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-full" />
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  )
}

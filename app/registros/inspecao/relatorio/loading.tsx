import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Skeleton className="h-8 w-64 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>

      <div className="flex justify-end mb-6">
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="h-8 w-full mb-4" />
      <Skeleton className="h-64 w-full" />

      <div className="flex justify-between items-center mt-6">
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-12" />
          <Skeleton className="h-10 w-12" />
          <Skeleton className="h-10 w-12" />
          <Skeleton className="h-10 w-12" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  )
}

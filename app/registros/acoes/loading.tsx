import { Skeleton } from "@/components/ui/skeleton"
import { MainLayout } from "@/components/layout/main-layout"

export default function Loading() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
        </div>

        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-40" />
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="space-y-4">
          <div className="flex space-x-1">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-10 flex-1" />
              ))}
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-8 w-64" />
          </div>

          <Skeleton className="h-[400px] w-full" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-8 w-8 rounded-full" />
                ))}
            </div>

            <Skeleton className="h-5 w-40" />

            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

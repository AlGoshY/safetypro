import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <Skeleton className="h-8 w-64 mb-6" />

        {/* Identificação da ISS */}
        <div className="mb-8">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="col-span-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="col-span-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        <Skeleton className="h-px w-full my-8" />

        {/* Equipe de Inspeção */}
        <div className="mb-8">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-64 w-full rounded-md" />

          <div className="mt-6 flex gap-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>

        <Skeleton className="h-px w-full my-8" />

        {/* Exportar */}
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  )
}

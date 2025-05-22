import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Carregando...</h3>
        <p className="mt-1 text-sm text-gray-500">Aguarde enquanto carregamos os dados.</p>
      </div>
    </div>
  )
}

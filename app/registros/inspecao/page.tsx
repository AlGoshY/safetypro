import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function InspecaoPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Inspeção</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/registros/inspecao/cadastrar-item">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-24 text-lg">Cadastrar Item</Button>
        </Link>

        <Link href="/registros/inspecao/realizar">
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-24 text-lg">Realizar Inspeção</Button>
        </Link>

        <Link href="/registros/inspecao/consultar">
          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white h-24 text-lg">
            Consultar Inspeções
          </Button>
        </Link>
      </div>
    </div>
  )
}

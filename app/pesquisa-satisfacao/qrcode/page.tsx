"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { QRCodePesquisa } from "@/components/pesquisa-satisfacao/qr-code-pesquisa"

export default function QRCodePesquisaPage() {
  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-4">
        <Button variant="outline" className="w-fit flex items-center gap-2" onClick={() => window.history.back()}>
          <ArrowLeft size={16} />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">QR Code da Pesquisa</h1>
      </div>
      <QRCodePesquisa />
    </div>
  )
}

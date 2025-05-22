"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Dados fictícios para demonstração
const unidades = [
  { id: 1, nome: "Diretoria Demonstração" },
  { id: 2, nome: "Unidade São Paulo" },
  { id: 3, nome: "Unidade Rio de Janeiro" },
  { id: 4, nome: "Unidade Belo Horizonte" },
  { id: 5, nome: "Unidade Brasília" },
]

export function Compartilhamento() {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<number | null>(1)
  const [qrCodeGerado, setQrCodeGerado] = useState<boolean>(false)
  const [copiado, setCopiado] = useState<boolean>(false)
  const { toast } = useToast()

  const handleGerarQRCode = () => {
    if (!unidadeSelecionada) {
      toast({
        title: "Erro",
        description: "Selecione uma unidade para gerar o QR Code",
        variant: "destructive",
      })
      return
    }

    setQrCodeGerado(true)
    toast({
      title: "QR Code gerado",
      description: "QR Code gerado com sucesso!",
    })
  }

  const handleDownloadQRCode = () => {
    // Em uma implementação real, isso baixaria o QR Code
    toast({
      title: "Download iniciado",
      description: "O QR Code está sendo baixado",
    })
  }

  const handleCopiarLink = () => {
    // Em uma implementação real, isso copiaria o link para a área de transferência
    const unidadeNome = unidades.find((u) => u.id === unidadeSelecionada)?.nome || ""
    const linkFormatado = encodeURIComponent(unidadeNome)
    const link = `https://hml-comunique.dotsebr.com/?unidade=${linkFormatado}`

    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopiado(true)
        toast({
          title: "Link copiado",
          description: "Link copiado para a área de transferência",
        })

        setTimeout(() => {
          setCopiado(false)
        }, 2000)
      })
      .catch(() => {
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link",
          variant: "destructive",
        })
      })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Compartilhamento</h1>

        <div className="space-y-6">
          {/* Seleção de unidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unidade</label>
            <div className="relative">
              <select
                value={unidadeSelecionada || ""}
                onChange={(e) => setUnidadeSelecionada(Number(e.target.value))}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Selecione uma unidade</option>
                {unidades.map((unidade) => (
                  <option key={unidade.id} value={unidade.id}>
                    {unidade.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botão de gerar QR Code */}
          <div className="flex justify-center">
            <Button onClick={handleGerarQRCode} className="bg-red-600 hover:bg-red-700 text-white">
              GERAR QR CODE
            </Button>
          </div>

          {/* QR Code */}
          {qrCodeGerado && (
            <div className="mt-8 space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <img src="/qr-code-example.png" alt="QR Code" className="w-64 h-64 mx-auto" />

                  <Button
                    onClick={handleDownloadQRCode}
                    className="absolute -bottom-4 right-0 bg-gray-700 hover:bg-gray-800 text-white"
                    size="sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    BAIXAR QR CODE
                  </Button>
                </div>
              </div>

              {/* Link de compartilhamento */}
              <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">Link de compartilhamento</h2>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={`https://hml-comunique.dotsebr.com/?unidade=${encodeURIComponent(
                      unidades.find((u) => u.id === unidadeSelecionada)?.nome || "",
                    )}`}
                    className="flex-1 rounded-l-md border border-gray-300 bg-gray-50 py-2 px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <Button
                    onClick={handleCopiarLink}
                    className="rounded-l-none bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  >
                    {copiado ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

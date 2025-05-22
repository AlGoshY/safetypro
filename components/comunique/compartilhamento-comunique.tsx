"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Copy, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

// Dados fictícios para demonstração
const unidades = [
  { id: 1, nome: "Diretoria Demonstração" },
  { id: 2, nome: "Unidade São Paulo" },
  { id: 3, nome: "Unidade Rio de Janeiro" },
  { id: 4, nome: "Unidade Belo Horizonte" },
  { id: 5, nome: "Unidade Brasília" },
]

export function CompartilhamentoComunique() {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>("")
  const [qrCodeGerado, setQrCodeGerado] = useState<boolean>(false)
  const [copiado, setCopiado] = useState<boolean>(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("/qr-code-example.png")
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const linkRef = useRef<HTMLInputElement>(null)
  const qrCodeRef = useRef<HTMLImageElement>(null)
  const { toast } = useToast()

  // Função para gerar o QR Code
  const gerarQRCode = () => {
    if (!unidadeSelecionada) {
      toast({
        title: "Erro",
        description: "Selecione uma unidade para gerar o QR Code",
        variant: "destructive",
      })
      return
    }

    // Em um ambiente real, aqui você faria uma chamada à API para gerar o QR Code
    // Por enquanto, estamos apenas usando uma imagem estática
    setQrCodeUrl("/qr-code-example.png")
    setQrCodeGerado(true)
    toast({
      title: "QR Code gerado",
      description: "QR Code gerado com sucesso!",
    })
  }

  // Função para baixar o QR Code
  const baixarQRCode = () => {
    if (!qrCodeRef.current) {
      toast({
        title: "Erro",
        description: "Não foi possível baixar o QR Code",
        variant: "destructive",
      })
      return
    }

    setIsDownloading(true)

    // Verifica se a imagem está completamente carregada
    if (!qrCodeRef.current.complete) {
      qrCodeRef.current.onload = handleDownload
    } else {
      handleDownload()
    }
  }

  // Função para lidar com o download após a imagem estar carregada
  const handleDownload = () => {
    try {
      const img = qrCodeRef.current
      if (!img) return

      // Cria um canvas com as dimensões corretas da imagem
      const canvas = document.createElement("canvas")
      // Usa as dimensões naturais da imagem em vez das dimensões CSS
      canvas.width = img.naturalWidth || 300
      canvas.height = img.naturalHeight || 300

      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Não foi possível criar o contexto do canvas")

      // Preenche o canvas com fundo branco para garantir que não haja transparência
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Desenha a imagem no canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Obtém o nome da unidade selecionada para o nome do arquivo
      const unidade = unidades.find((u) => u.id.toString() === unidadeSelecionada)
      const nomeArquivo = unidade ? `qrcode-${unidade.nome.replace(/\s+/g, "-").toLowerCase()}.png` : "qrcode.png"

      // Usa o método toBlob para melhor compatibilidade
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("Não foi possível gerar o blob da imagem")
          }

          // Cria uma URL para o blob
          const url = URL.createObjectURL(blob)

          // Cria um link para download
          const link = document.createElement("a")
          link.href = url
          link.download = nomeArquivo
          document.body.appendChild(link)
          link.click()

          // Limpa recursos
          document.body.removeChild(link)
          URL.revokeObjectURL(url)

          setIsDownloading(false)
          toast({
            title: "Download concluído",
            description: `QR Code salvo como ${nomeArquivo}`,
          })
        },
        "image/png",
        1.0,
      )
    } catch (error) {
      console.error("Erro ao baixar QR Code:", error)
      setIsDownloading(false)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao baixar o QR Code",
        variant: "destructive",
      })
    }
  }

  // Função para copiar o link
  const copiarLink = () => {
    if (linkRef.current) {
      linkRef.current.select()
      document.execCommand("copy")
      setCopiado(true)
      toast({
        title: "Link copiado",
        description: "Link copiado para a área de transferência",
      })

      // Reset do estado após 2 segundos
      setTimeout(() => {
        setCopiado(false)
      }, 2000)
    }
  }

  // Gera um link baseado na unidade selecionada
  const getLinkCompartilhamento = () => {
    const unidade = unidades.find((u) => u.id.toString() === unidadeSelecionada)
    if (!unidade) return ""

    // Codifica o nome da unidade para URL
    const nomeUnidadeCodificado = encodeURIComponent(unidade.nome)
    return `https://hml-comunique.dotsebr.com/?unidade=${nomeUnidadeCodificado}`
  }

  // Pré-carrega a imagem do QR Code
  useEffect(() => {
    if (qrCodeGerado) {
      const img = new Image()
      img.src = qrCodeUrl
      img.crossOrigin = "anonymous"
      img.onload = () => {
        // A imagem está carregada e pronta para uso
        console.log("QR Code image loaded successfully")
      }
    }
  }, [qrCodeGerado, qrCodeUrl])

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Compartilhamento de Comunique</h1>
        <p className="text-muted-foreground">Gere QR Codes e links para compartilhar informações do Comunique</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gerar QR Code</CardTitle>
            <CardDescription>Selecione uma unidade e gere um QR Code para compartilhar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Select value={unidadeSelecionada} onValueChange={setUnidadeSelecionada}>
                  <SelectTrigger id="unidade">
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map((unidade) => (
                      <SelectItem key={unidade.id} value={unidade.id.toString()}>
                        {unidade.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={gerarQRCode} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                GERAR QR CODE
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
            <CardDescription>Visualize e baixe o QR Code gerado</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {qrCodeGerado ? (
              <>
                <div className="mb-4 p-4 bg-white rounded-lg">
                  <img
                    ref={qrCodeRef}
                    src={qrCodeUrl || "/placeholder.svg"}
                    alt="QR Code"
                    className="w-64 h-64"
                    crossOrigin="anonymous"
                  />
                </div>
                <Button
                  onClick={baixarQRCode}
                  variant="outline"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <span className="animate-spin mr-2">⊚</span>
                      BAIXANDO...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      BAIXAR QR CODE
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Selecione uma unidade e clique em "GERAR QR CODE" para visualizar o QR Code
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {qrCodeGerado && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Link de compartilhamento</CardTitle>
            <CardDescription>Copie o link abaixo para compartilhar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input ref={linkRef} readOnly value={getLinkCompartilhamento()} className="flex-1" />
              <Button onClick={copiarLink} variant="outline" className={copiado ? "bg-green-600 text-white" : ""}>
                {copiado ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

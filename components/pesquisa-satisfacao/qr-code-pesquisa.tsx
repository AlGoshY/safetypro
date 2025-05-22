"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type { Pesquisa } from "@/types/pesquisa-satisfacao"
import { PesquisaSatisfacaoService } from "@/services/pesquisa-satisfacao-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Download, Copy, Share2 } from "lucide-react"

export function QRCodePesquisa() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const pesquisaId = searchParams.get("id")

  const [pesquisa, setPesquisa] = useState<Pesquisa | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    if (pesquisaId) {
      carregarPesquisa(pesquisaId)
    }
  }, [pesquisaId])

  const carregarPesquisa = async (id: string) => {
    try {
      setIsLoading(true)
      const data = await PesquisaSatisfacaoService.obterPesquisaPorId(id)

      if (!data) {
        throw new Error("Pesquisa não encontrada")
      }

      setPesquisa(data)
      setQrCodeUrl(data.qrCodeUrl || "/qr-code-generic.png")
    } catch (error) {
      console.error("Erro ao carregar pesquisa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da pesquisa",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copiarLink = () => {
    if (!pesquisa || !pesquisa.linkPublico) return

    const linkCompleto = `${window.location.origin}${pesquisa.linkPublico}`
    navigator.clipboard.writeText(linkCompleto)

    toast({
      title: "Link copiado",
      description: "Link da pesquisa copiado para a área de transferência",
      variant: "default",
    })
  }

  const compartilharPesquisa = async () => {
    if (!pesquisa || !pesquisa.linkPublico) return

    const linkCompleto = `${window.location.origin}${pesquisa.linkPublico}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: pesquisa.titulo,
          text: pesquisa.descricao,
          url: linkCompleto,
        })
      } catch (error) {
        console.error("Erro ao compartilhar:", error)
      }
    } else {
      copiarLink()
    }
  }

  const baixarQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `qrcode-pesquisa-${pesquisa?.id || "download"}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="flex justify-center">
          <Skeleton className="h-64 w-64" />
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    )
  }

  if (!pesquisa) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Pesquisa não encontrada</CardTitle>
          <CardDescription>A pesquisa solicitada não está disponível ou não existe.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Verifique se o link está correto ou entre em contato com o administrador.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.history.back()} className="w-full">
            Voltar
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>QR Code da Pesquisa</CardTitle>
        <CardDescription>{pesquisa.titulo}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-lg mb-4">
          <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code da Pesquisa" className="w-64 h-64 object-contain" />
        </div>

        <p className="text-sm text-center text-muted-foreground mb-4">
          Escaneie o QR Code acima ou compartilhe o link para responder à pesquisa.
          <br />
          Válido até {new Date(pesquisa.dataFim).toLocaleDateString("pt-BR")}.
        </p>

        <div className="flex flex-wrap justify-center gap-3 w-full">
          <Button variant="outline" onClick={copiarLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copiar Link
          </Button>

          <Button variant="outline" onClick={compartilharPesquisa}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>

          <Button variant="outline" onClick={baixarQRCode}>
            <Download className="h-4 w-4 mr-2" />
            Baixar QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

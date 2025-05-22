"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PesquisaSatisfacaoService } from "@/services/pesquisa-satisfacao-service"
import { useToast } from "@/hooks/use-toast"
import { CriarPesquisaForm } from "@/components/pesquisa-satisfacao/criar-pesquisa-form"

export default function EditarPesquisaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [pesquisaId, setPesquisaId] = useState<string | null>(null)
  const [pesquisaExiste, setPesquisaExiste] = useState(false)
  const [pesquisa, setPesquisa] = useState(null)

  useEffect(() => {
    const id = searchParams.get("id")
    if (!id) {
      toast({
        title: "Erro",
        description: "ID da pesquisa não fornecido",
        variant: "destructive",
      })
      router.push("/pesquisa-satisfacao/gerenciar")
      return
    }

    setPesquisaId(id)
    verificarPesquisa(id)
  }, [searchParams, router, toast])

  const verificarPesquisa = async (id: string) => {
    try {
      setIsLoading(true)

      // Verificar se a pesquisa existe
      console.log("Verificando pesquisa com ID:", id)

      // Obter a pesquisa diretamente pelo ID
      const pesquisaEncontrada = await PesquisaSatisfacaoService.obterPesquisaPorId(id)

      if (!pesquisaEncontrada) {
        console.error("Pesquisa não encontrada")
        toast({
          title: "Erro",
          description: "Pesquisa não encontrada",
          variant: "destructive",
        })
        router.push("/pesquisa-satisfacao/gerenciar")
        return
      }

      console.log("Pesquisa encontrada:", pesquisaEncontrada)

      // Verificar se a pesquisa está em status de rascunho
      if (pesquisaEncontrada.status !== "rascunho") {
        toast({
          title: "Atenção",
          description: "Apenas pesquisas em rascunho podem ser editadas",
          variant: "destructive",
        })
        router.push("/pesquisa-satisfacao/gerenciar")
        return
      }

      setPesquisa(pesquisaEncontrada)
      setPesquisaExiste(true)

      toast({
        title: "Pesquisa encontrada",
        description: "Carregando formulário de edição...",
        variant: "default",
      })
    } catch (error) {
      console.error("Erro ao verificar pesquisa:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao verificar a pesquisa",
        variant: "destructive",
      })
      router.push("/pesquisa-satisfacao/gerenciar")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium mb-4">Verificando pesquisa...</p>
        <Button variant="outline" onClick={() => router.push("/pesquisa-satisfacao/gerenciar")}>
          Cancelar
        </Button>
      </div>
    )
  }

  if (!pesquisaExiste) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg font-medium mb-4">Pesquisa não encontrada ou não pode ser editada</p>
        <Button onClick={() => router.push("/pesquisa-satisfacao/gerenciar")}>Voltar para Gerenciamento</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Editar Pesquisa de Satisfação</h1>
      {pesquisaId && <CriarPesquisaForm pesquisaId={pesquisaId} pesquisaData={pesquisa} />}
    </div>
  )
}

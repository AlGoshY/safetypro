"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { usePesquisa } from "@/contexts/pesquisa-context"
import { EditarPesquisaForm } from "@/components/pesquisa-satisfacao/editar-pesquisa-form"

export default function EditarPesquisaPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { getPesquisa, isLoading: isContextLoading } = usePesquisa()
  const [isLoading, setIsLoading] = useState(true)
  const [pesquisaEncontrada, setPesquisaEncontrada] = useState<any>(null)

  useEffect(() => {
    if (isContextLoading) return

    const id = params?.id as string
    if (!id) {
      toast({
        title: "Erro",
        description: "ID da pesquisa não fornecido",
        variant: "destructive",
      })
      router.push("/pesquisa-satisfacao/gerenciar")
      return
    }

    verificarPesquisa(id)
  }, [params, router, toast, isContextLoading])

  const verificarPesquisa = (id: string) => {
    try {
      setIsLoading(true)
      console.log("Verificando pesquisa com ID:", id)

      // Obter a pesquisa diretamente do contexto
      const pesquisa = getPesquisa(id)

      if (!pesquisa) {
        console.error("Pesquisa não encontrada")
        toast({
          title: "Erro",
          description: "Pesquisa não encontrada",
          variant: "destructive",
        })
        router.push("/pesquisa-satisfacao/gerenciar")
        return
      }

      // Verificar se a pesquisa está em status de rascunho
      if (pesquisa.status !== "rascunho") {
        toast({
          title: "Atenção",
          description: "Apenas pesquisas em rascunho podem ser editadas",
          variant: "destructive",
        })
        router.push("/pesquisa-satisfacao/gerenciar")
        return
      }

      console.log("Pesquisa encontrada para edição:", pesquisa)
      setPesquisaEncontrada(pesquisa)

      toast({
        title: "Pesquisa carregada",
        description: "Os dados da pesquisa foram carregados para edição",
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

  if (isContextLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium mb-4">Carregando dados da pesquisa...</p>
        <Button variant="outline" onClick={() => router.push("/pesquisa-satisfacao/gerenciar")}>
          Cancelar
        </Button>
      </div>
    )
  }

  if (!pesquisaEncontrada) {
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
      <EditarPesquisaForm pesquisa={pesquisaEncontrada} />
    </div>
  )
}

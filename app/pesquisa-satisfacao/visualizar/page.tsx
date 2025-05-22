"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PesquisaSatisfacaoService } from "@/services/pesquisa-satisfacao-service"
import type { Pesquisa, Pergunta } from "@/types/pesquisa-satisfacao"

// Pesquisa mockada para garantir que sempre haja algo para mostrar
const pesquisaMock: Pesquisa = {
  id: "preview-1",
  titulo: "Pesquisa de Satisfação - Serviços de SST",
  descricao: "Ajude-nos a melhorar nossos serviços respondendo a esta breve pesquisa.",
  status: "ativa",
  dataCriacao: new Date().toISOString(),
  dataAtualizacao: new Date().toISOString(),
  criadoPor: "Sistema",
  unidades: ["Matriz", "Filial A", "Filial B"],
  setores: ["Administrativo", "Operacional", "Segurança"],
  perguntas: [
    {
      id: "p1",
      texto: "Como você avalia a qualidade dos nossos serviços?",
      tipo: "escala",
      obrigatoria: true,
      ordem: 1,
    },
    {
      id: "p2",
      texto: "Qual aspecto do nosso atendimento você considera mais importante?",
      tipo: "multipla_escolha",
      obrigatoria: true,
      ordem: 2,
      opcoes: [
        { id: "o1", texto: "Rapidez no atendimento" },
        { id: "o2", texto: "Qualidade técnica" },
        { id: "o3", texto: "Comunicação clara" },
        { id: "o4", texto: "Resolução de problemas" },
      ],
    },
    {
      id: "p3",
      texto: "Quais melhorias você gostaria de ver em nossos serviços? (selecione todas que se aplicam)",
      tipo: "checkbox",
      obrigatoria: false,
      ordem: 3,
      opcoes: [
        { id: "o5", texto: "Mais treinamentos" },
        { id: "o6", texto: "Melhor documentação" },
        { id: "o7", texto: "Atendimento mais rápido" },
        { id: "o8", texto: "Mais opções de comunicação" },
      ],
    },
    {
      id: "p4",
      texto: "Deixe seus comentários ou sugestões adicionais:",
      tipo: "texto",
      obrigatoria: false,
      ordem: 4,
    },
  ],
}

export default function VisualizarPesquisaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const id = searchParams.get("id")
  const [pesquisa, setPesquisa] = useState<Pesquisa | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [respostas, setRespostas] = useState<Record<string, string | string[]>>({})

  useEffect(() => {
    const carregarPesquisa = async () => {
      if (!id) {
        toast({
          title: "ID não encontrado",
          description: "Redirecionando para a lista de pesquisas",
          variant: "destructive",
        })
        setTimeout(() => router.push("/pesquisa-satisfacao/gerenciar"), 2000)
        return
      }

      try {
        setIsLoading(true)
        // Tentar carregar a pesquisa real
        const data = await PesquisaSatisfacaoService.obterPesquisaPorId(id)

        if (data) {
          setPesquisa(data)

          // Inicializar respostas
          const respostasIniciais: Record<string, string | string[]> = {}
          data.perguntas.forEach((pergunta) => {
            if (pergunta.tipo === "checkbox") {
              respostasIniciais[pergunta.id] = []
            } else {
              respostasIniciais[pergunta.id] = ""
            }
          })
          setRespostas(respostasIniciais)
        } else {
          // Se não encontrar, usar a pesquisa mockada
          setPesquisa(pesquisaMock)

          // Inicializar respostas para a pesquisa mockada
          const respostasIniciais: Record<string, string | string[]> = {}
          pesquisaMock.perguntas.forEach((pergunta) => {
            if (pergunta.tipo === "checkbox") {
              respostasIniciais[pergunta.id] = []
            } else {
              respostasIniciais[pergunta.id] = ""
            }
          })
          setRespostas(respostasIniciais)

          toast({
            title: "Usando visualização de demonstração",
            description: "A pesquisa solicitada não foi encontrada. Exibindo modelo de demonstração.",
            variant: "default",
          })
        }
      } catch (error) {
        console.error("Erro ao carregar pesquisa:", error)
        setPesquisa(pesquisaMock)
        toast({
          title: "Erro ao carregar pesquisa",
          description: "Exibindo modelo de demonstração.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    carregarPesquisa()
  }, [id, router, toast])

  const renderPergunta = (pergunta: Pergunta) => {
    switch (pergunta.tipo) {
      case "escala":
        return (
          <div className="space-y-3">
            <RadioGroup value={respostas[pergunta.id] as string} onValueChange={() => {}} className="preview-mode">
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((valor) => (
                  <div key={valor} className="flex flex-col items-center">
                    <RadioGroupItem value={valor.toString()} id={`${pergunta.id}-${valor}`} />
                    <Label htmlFor={`${pergunta.id}-${valor}`} className="mt-1">
                      {valor}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Muito Insatisfeito</span>
                <span>Muito Satisfeito</span>
              </div>
            </RadioGroup>
          </div>
        )

      case "multipla_escolha":
        return (
          <div className="space-y-3">
            <RadioGroup value={respostas[pergunta.id] as string} onValueChange={() => {}} className="preview-mode">
              <div className="space-y-2">
                {pergunta.opcoes?.map((opcao) => (
                  <div key={opcao.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={opcao.id} id={`${pergunta.id}-${opcao.id}`} />
                    <Label htmlFor={`${pergunta.id}-${opcao.id}`}>{opcao.texto}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              {pergunta.opcoes?.map((opcao) => (
                <div key={opcao.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${pergunta.id}-${opcao.id}`}
                    checked={((respostas[pergunta.id] as string[]) || []).includes(opcao.id)}
                    onCheckedChange={() => {}}
                  />
                  <Label htmlFor={`${pergunta.id}-${opcao.id}`}>{opcao.texto}</Label>
                </div>
              ))}
            </div>
          </div>
        )

      case "texto":
        return (
          <div className="space-y-3">
            <Textarea
              value={respostas[pergunta.id] as string}
              onChange={() => {}}
              placeholder="Digite sua resposta"
              rows={3}
              className="preview-mode"
            />
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="container py-6">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!pesquisa) {
    return (
      <div className="container py-6">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Pesquisa não encontrada</CardTitle>
            <CardDescription>A pesquisa solicitada não está disponível ou não existe.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-center text-muted-foreground">
              Verifique se o link está correto ou entre em contato com o administrador.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/pesquisa-satisfacao/gerenciar")} className="w-full">
              Voltar para Gerenciamento
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Visualização da Pesquisa</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/pesquisa-satisfacao/gerenciar")}>
            Voltar
          </Button>
          <Button onClick={() => router.push(`/pesquisa-satisfacao/qrcode?id=${id}`)}>Gerar QR Code</Button>
        </div>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
        <p className="text-yellow-700">
          <strong>Modo de visualização:</strong> Esta é uma prévia de como sua pesquisa aparecerá para os respondentes.
          Os campos não são interativos nesta visualização.
        </p>
      </div>

      <Card className="w-full max-w-3xl mx-auto border-2 border-dashed border-gray-300">
        <CardHeader>
          <CardTitle>{pesquisa.titulo}</CardTitle>
          <CardDescription>{pesquisa.descricao}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Perguntas */}
          {pesquisa.perguntas.map((pergunta) => (
            <div key={pergunta.id} className="space-y-3">
              <Label htmlFor={pergunta.id} className="text-base font-medium flex items-start">
                {pergunta.texto}
                {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderPergunta(pergunta)}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled>
            Enviar Resposta
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

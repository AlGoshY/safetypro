"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { Pesquisa, Pergunta, Resposta } from "@/types/pesquisa-satisfacao"
import { PesquisaSatisfacaoService } from "@/services/pesquisa-satisfacao-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle } from "lucide-react"

export function FormularioResposta() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pesquisaId = searchParams.get("id")

  const [pesquisa, setPesquisa] = useState<Pesquisa | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [respostas, setRespostas] = useState<Record<string, string | string[]>>({})
  const [unidade, setUnidade] = useState<string>("")
  const [setor, setSetor] = useState<string>("")
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})

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

      if (data.status !== "ativa") {
        throw new Error("Esta pesquisa não está ativa")
      }

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
    } catch (error) {
      console.error("Erro ao carregar pesquisa:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRespostaChange = (perguntaId: string, valor: string | string[]) => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaId]: valor,
    }))

    // Limpar erro se existir
    if (erros[perguntaId]) {
      setErros((prev) => {
        const novosErros = { ...prev }
        delete novosErros[perguntaId]
        return novosErros
      })
    }
  }

  const handleCheckboxChange = (perguntaId: string, opcaoId: string, checked: boolean) => {
    setRespostas((prev) => {
      const valoresAtuais = (prev[perguntaId] as string[]) || []

      if (checked) {
        return {
          ...prev,
          [perguntaId]: [...valoresAtuais, opcaoId],
        }
      } else {
        return {
          ...prev,
          [perguntaId]: valoresAtuais.filter((id) => id !== opcaoId),
        }
      }
    })

    // Limpar erro se existir
    if (erros[perguntaId]) {
      setErros((prev) => {
        const novosErros = { ...prev }
        delete novosErros[perguntaId]
        return novosErros
      })
    }
  }

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {}
    let valido = true

    if (!pesquisa) return false

    // Validar perguntas obrigatórias
    pesquisa.perguntas.forEach((pergunta) => {
      if (pergunta.obrigatoria) {
        const resposta = respostas[pergunta.id]

        if (!resposta || (Array.isArray(resposta) && resposta.length === 0)) {
          novosErros[pergunta.id] = "Esta pergunta é obrigatória"
          valido = false
        }
      }
    })

    // Validar unidade e setor se a pesquisa tiver mais de uma opção
    if (pesquisa.unidades.length > 1 && !unidade) {
      novosErros["unidade"] = "Selecione uma unidade"
      valido = false
    }

    if (pesquisa.setores.length > 1 && !setor) {
      novosErros["setor"] = "Selecione um setor"
      valido = false
    }

    setErros(novosErros)
    return valido
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario() || !pesquisa) return

    try {
      setEnviando(true)

      // Preparar objeto de respostas
      const respostasArray: Omit<Resposta, "id">[] = Object.entries(respostas).map(([perguntaId, valor]) => ({
        pesquisaId: pesquisa.id,
        perguntaId,
        valor,
        dataResposta: new Date().toISOString(),
      }))

      // Enviar resposta
      await PesquisaSatisfacaoService.enviarResposta({
        pesquisaId: pesquisa.id,
        unidade: unidade || pesquisa.unidades[0],
        setor: setor || pesquisa.setores[0],
        respostas: respostasArray as Resposta[],
      })

      setEnviado(true)
    } catch (error) {
      console.error("Erro ao enviar resposta:", error)
    } finally {
      setEnviando(false)
    }
  }

  const renderPergunta = (pergunta: Pergunta) => {
    switch (pergunta.tipo) {
      case "escala":
        return (
          <div className="space-y-3">
            <RadioGroup
              value={respostas[pergunta.id] as string}
              onValueChange={(value) => handleRespostaChange(pergunta.id, value)}
            >
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
            {erros[pergunta.id] && <p className="text-sm text-red-500">{erros[pergunta.id]}</p>}
          </div>
        )

      case "multipla_escolha":
        return (
          <div className="space-y-3">
            <RadioGroup
              value={respostas[pergunta.id] as string}
              onValueChange={(value) => handleRespostaChange(pergunta.id, value)}
            >
              <div className="space-y-2">
                {pergunta.opcoes?.map((opcao) => (
                  <div key={opcao.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={opcao.id} id={`${pergunta.id}-${opcao.id}`} />
                    <Label htmlFor={`${pergunta.id}-${opcao.id}`}>{opcao.texto}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {erros[pergunta.id] && <p className="text-sm text-red-500">{erros[pergunta.id]}</p>}
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
                    onCheckedChange={(checked) => handleCheckboxChange(pergunta.id, opcao.id, checked as boolean)}
                  />
                  <Label htmlFor={`${pergunta.id}-${opcao.id}`}>{opcao.texto}</Label>
                </div>
              ))}
            </div>
            {erros[pergunta.id] && <p className="text-sm text-red-500">{erros[pergunta.id]}</p>}
          </div>
        )

      case "texto":
        return (
          <div className="space-y-3">
            <Textarea
              value={respostas[pergunta.id] as string}
              onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}
              placeholder="Digite sua resposta"
              rows={3}
            />
            {erros[pergunta.id] && <p className="text-sm text-red-500">{erros[pergunta.id]}</p>}
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
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
    )
  }

  if (!pesquisa) {
    return (
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
      </Card>
    )
  }

  if (enviado) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Resposta Enviada</CardTitle>
          <CardDescription>Obrigado por participar da nossa pesquisa de satisfação!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <p className="text-center text-muted-foreground mb-6">
            Sua resposta foi registrada com sucesso. Suas opiniões são muito importantes para nós.
          </p>
          <Button onClick={() => window.location.reload()}>Responder Novamente</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{pesquisa.titulo}</CardTitle>
          <CardDescription>{pesquisa.descricao}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seleção de Unidade e Setor */}
          {(pesquisa.unidades.length > 1 || pesquisa.setores.length > 1) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              {pesquisa.unidades.length > 1 && (
                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <select
                    id="unidade"
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 h-10"
                  >
                    <option value="">Selecione uma unidade</option>
                    {pesquisa.unidades.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  {erros["unidade"] && <p className="text-sm text-red-500">{erros["unidade"]}</p>}
                </div>
              )}

              {pesquisa.setores.length > 1 && (
                <div className="space-y-2">
                  <Label htmlFor="setor">Setor</Label>
                  <select
                    id="setor"
                    value={setor}
                    onChange={(e) => setSetor(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 h-10"
                  >
                    <option value="">Selecione um setor</option>
                    {pesquisa.setores.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {erros["setor"] && <p className="text-sm text-red-500">{erros["setor"]}</p>}
                </div>
              )}
            </div>
          )}

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
          <Button type="submit" className="w-full" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar Resposta"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import type { Pesquisa, Pergunta } from "@/types/pesquisa-satisfacao"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditorPergunta } from "./editor-pergunta"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Calendar, Trash2, Plus, MoveUp, MoveDown, AlertTriangle } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePesquisa } from "@/contexts/pesquisa-context"

interface EditarPesquisaFormProps {
  pesquisa: Pesquisa
}

export function EditarPesquisaForm({ pesquisa: pesquisaInicial }: EditarPesquisaFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { atualizarPesquisa } = usePesquisa()
  const [activeTab, setActiveTab] = useState("informacoes")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const tituloRef = useRef<HTMLInputElement>(null)
  const descricaoRef = useRef<HTMLTextAreaElement>(null)
  const dataInicioRef = useRef<HTMLInputElement>(null)
  const dataFimRef = useRef<HTMLInputElement>(null)

  const [pesquisa, setPesquisa] = useState<Pesquisa>(pesquisaInicial)

  // Lista de unidades e setores disponíveis (mockados)
  const unidadesDisponiveis = ["NOVA VENEZA - ABATE AVES", "FORTALEZA - PROCESSADOS", "ITAJAÍ - PESCADOS"]
  const setoresDisponiveis = ["Produção", "Administrativo", "Qualidade", "Manutenção", "Logística", "Todos"]

  // Função para converter string de data para objeto Date
  const parseDate = (dateString: string): Date => {
    // Verificar se a data está no formato DD/MM/YYYY
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/").map(Number)
      return new Date(year, month - 1, day)
    }
    // Caso contrário, assumir formato YYYY-MM-DD
    return new Date(dateString)
  }

  // Função para formatar data como YYYY-MM-DD para o input type="date"
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Função para verificar se a data de término é válida
  const isDataFimValida = (): boolean => {
    if (!pesquisa.dataInicio || !pesquisa.dataFim) return true

    const dataInicio = parseDate(pesquisa.dataInicio)
    const dataFim = parseDate(pesquisa.dataFim)

    return dataFim > dataInicio
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Atualizar o valor no estado
    setPesquisa((prev) => ({ ...prev, [name]: value }))

    // Limpar erro quando o campo for preenchido
    if (value && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }))
    }

    // Validação especial para datas
    if (name === "dataInicio" && pesquisa.dataFim) {
      const dataInicio = parseDate(value)
      const dataFim = parseDate(pesquisa.dataFim)

      if (dataFim <= dataInicio) {
        setErrors((prev) => ({ ...prev, dataFim: true, dataFimInvalida: true }))

        // Limpar a data de término se for inválida
        setPesquisa((prev) => ({ ...prev, dataFim: "" }))

        toast({
          title: "Data inválida",
          description: "A data de término deve ser posterior à data de início",
          variant: "destructive",
        })
      } else {
        setErrors((prev) => ({ ...prev, dataFim: false, dataFimInvalida: false }))
      }
    }

    if (name === "dataFim" && pesquisa.dataInicio) {
      const dataInicio = parseDate(pesquisa.dataInicio)
      const dataFim = parseDate(value)

      if (dataFim <= dataInicio) {
        setErrors((prev) => ({ ...prev, dataFim: true, dataFimInvalida: true }))

        toast({
          title: "Data inválida",
          description: "A data de término deve ser posterior à data de início",
          variant: "destructive",
        })

        // Não permitir a atualização da data inválida
        setTimeout(() => {
          if (dataFimRef.current) {
            dataFimRef.current.value = ""
            setPesquisa((prev) => ({ ...prev, dataFim: "" }))
          }
        }, 0)

        return
      } else {
        setErrors((prev) => ({ ...prev, dataFim: false, dataFimInvalida: false }))
      }
    }
  }

  const handleUnidadeChange = (value: string) => {
    setPesquisa((prev) => ({ ...prev, unidades: [value] }))
    setErrors((prev) => ({ ...prev, unidades: false }))
  }

  const handleSetorChange = (value: string) => {
    setPesquisa((prev) => ({ ...prev, setores: [value] }))
    setErrors((prev) => ({ ...prev, setores: false }))
  }

  const adicionarPergunta = () => {
    const novaPergunta: Pergunta = {
      id: uuidv4(),
      texto: "",
      tipo: "escala",
      obrigatoria: true,
      ordem: pesquisa.perguntas?.length || 0,
    }

    setPesquisa((prev) => ({
      ...prev,
      perguntas: [...(prev.perguntas || []), novaPergunta],
    }))
  }

  const atualizarPergunta = (id: string, perguntaAtualizada: Partial<Pergunta>) => {
    setPesquisa((prev) => ({
      ...prev,
      perguntas: prev.perguntas?.map((p) => (p.id === id ? { ...p, ...perguntaAtualizada } : p)),
    }))
  }

  const removerPergunta = (id: string) => {
    setPesquisa((prev) => ({
      ...prev,
      perguntas: prev.perguntas?.filter((p) => p.id !== id),
    }))
  }

  const moverPergunta = (id: string, direcao: "cima" | "baixo") => {
    const perguntas = [...(pesquisa.perguntas || [])]
    const index = perguntas.findIndex((p) => p.id === id)

    if (index === -1) return

    if (direcao === "cima" && index > 0) {
      const temp = perguntas[index]
      perguntas[index] = perguntas[index - 1]
      perguntas[index - 1] = temp
    } else if (direcao === "baixo" && index < perguntas.length - 1) {
      const temp = perguntas[index]
      perguntas[index] = perguntas[index + 1]
      perguntas[index + 1] = temp
    }

    // Atualizar a ordem
    const perguntasAtualizadas = perguntas.map((p, i) => ({ ...p, ordem: i }))

    setPesquisa((prev) => ({
      ...prev,
      perguntas: perguntasAtualizadas,
    }))
  }

  const validarInformacoes = () => {
    const novosErros: Record<string, boolean> = {}
    let isValid = true

    // Validar título
    if (!pesquisa.titulo) {
      novosErros.titulo = true
      isValid = false
      if (tituloRef.current) {
        tituloRef.current.focus()
      }
    }

    // Validar descrição
    if (!pesquisa.descricao) {
      novosErros.descricao = true
      isValid = false
      if (!novosErros.titulo && descricaoRef.current) {
        descricaoRef.current.focus()
      }
    }

    // Validar data de início
    if (!pesquisa.dataInicio) {
      novosErros.dataInicio = true
      isValid = false
    }

    // Validar data de término
    if (!pesquisa.dataFim) {
      novosErros.dataFim = true
      isValid = false
    }

    // Validar que a data de término é posterior à data de início
    if (pesquisa.dataInicio && pesquisa.dataFim) {
      const dataInicio = parseDate(pesquisa.dataInicio)
      const dataFim = parseDate(pesquisa.dataFim)

      if (dataFim <= dataInicio) {
        novosErros.dataFim = true
        novosErros.dataFimInvalida = true
        isValid = false
      }
    }

    // Validar unidade
    if (!pesquisa.unidades || pesquisa.unidades.length === 0) {
      novosErros.unidades = true
      isValid = false
    }

    // Validar setor
    if (!pesquisa.setores || pesquisa.setores.length === 0) {
      novosErros.setores = true
      isValid = false
    }

    setErrors(novosErros)

    if (!isValid) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios antes de continuar",
        variant: "destructive",
      })
    }

    return isValid
  }

  const handleProximo = () => {
    if (validarInformacoes()) {
      setActiveTab("perguntas")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarInformacoes()) {
      setActiveTab("informacoes")
      return
    }

    if (!pesquisa.perguntas || pesquisa.perguntas.length === 0) {
      toast({
        title: "Sem perguntas",
        description: "Adicione pelo menos uma pergunta à pesquisa",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Atualizar pesquisa existente usando o contexto
      const result = await atualizarPesquisa(pesquisa.id, pesquisa)

      if (result) {
        toast({
          title: "Pesquisa atualizada",
          description: "Pesquisa atualizada com sucesso!",
          variant: "default",
        })
        router.push("/pesquisa-satisfacao/gerenciar")
      } else {
        throw new Error("Não foi possível atualizar a pesquisa")
      }
    } catch (error) {
      console.error("Erro ao atualizar pesquisa:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a pesquisa",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const validarFormulario = () => {
    return (
      pesquisa.titulo &&
      pesquisa.descricao &&
      pesquisa.dataInicio &&
      pesquisa.dataFim &&
      isDataFimValida() &&
      pesquisa.unidades &&
      pesquisa.unidades.length > 0 &&
      pesquisa.setores &&
      pesquisa.setores.length > 0 &&
      pesquisa.perguntas &&
      pesquisa.perguntas.length > 0 &&
      pesquisa.perguntas.every((p) => p.texto)
    )
  }

  // Calcular a data mínima para o campo de data de término
  const getMinDataFim = (): string => {
    if (!pesquisa.dataInicio) return ""

    const dataInicio = parseDate(pesquisa.dataInicio)
    const minDataFim = new Date(dataInicio)
    minDataFim.setDate(dataInicio.getDate() + 1) // Adiciona um dia

    return formatDateForInput(minDataFim)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="informacoes">Informações Básicas</TabsTrigger>
          <TabsTrigger value="perguntas">Perguntas</TabsTrigger>
        </TabsList>

        <TabsContent value="informacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Editar Pesquisa</CardTitle>
              <CardDescription>Edite as informações da sua pesquisa de satisfação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo" className={errors.titulo ? "text-red-500" : ""}>
                  Título da Pesquisa *
                </Label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={pesquisa.titulo || ""}
                  onChange={handleChange}
                  placeholder="Ex: Pesquisa de Satisfação - Segurança do Trabalho"
                  ref={tituloRef}
                  className={errors.titulo ? "border-red-500 focus:ring-red-500" : ""}
                  required
                />
                {errors.titulo && <p className="text-sm text-red-500">O título da pesquisa é obrigatório</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className={errors.descricao ? "text-red-500" : ""}>
                  Descrição *
                </Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={pesquisa.descricao || ""}
                  onChange={handleChange}
                  placeholder="Descreva o objetivo desta pesquisa"
                  ref={descricaoRef}
                  className={errors.descricao ? "border-red-500 focus:ring-red-500" : ""}
                  rows={3}
                  required
                />
                {errors.descricao && <p className="text-sm text-red-500">A descrição da pesquisa é obrigatória</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataInicio" className={errors.dataInicio ? "text-red-500" : ""}>
                    Data de Início *
                  </Label>
                  <div className="relative">
                    <Input
                      id="dataInicio"
                      name="dataInicio"
                      type="date"
                      value={pesquisa.dataInicio || ""}
                      onChange={handleChange}
                      className={errors.dataInicio ? "border-red-500 focus:ring-red-500" : ""}
                      ref={dataInicioRef}
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-4 w-4" />
                  </div>
                  {errors.dataInicio && <p className="text-sm text-red-500">A data de início é obrigatória</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataFim" className={errors.dataFim ? "text-red-500" : ""}>
                    Data de Término *
                  </Label>
                  <div className="relative">
                    <Input
                      id="dataFim"
                      name="dataFim"
                      type="date"
                      value={pesquisa.dataFim || ""}
                      onChange={handleChange}
                      min={getMinDataFim()}
                      className={errors.dataFim ? "border-red-500 focus:ring-red-500" : ""}
                      ref={dataFimRef}
                      required
                      onFocus={() => {
                        if (!pesquisa.dataInicio) {
                          toast({
                            title: "Atenção",
                            description: "Selecione primeiro a data de início",
                            variant: "default",
                          })
                          if (dataInicioRef.current) {
                            dataInicioRef.current.focus()
                          }
                        }
                      }}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-4 w-4" />
                  </div>
                  {errors.dataFimInvalida ? (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />A data de término deve ser posterior à data de início
                    </p>
                  ) : errors.dataFim ? (
                    <p className="text-sm text-red-500">A data de término é obrigatória</p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidade" className={errors.unidades ? "text-red-500" : ""}>
                  Unidade *
                </Label>
                <Select value={pesquisa.unidades?.[0] || ""} onValueChange={handleUnidadeChange}>
                  <SelectTrigger className={errors.unidades ? "border-red-500 focus:ring-red-500" : ""}>
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidadesDisponiveis.map((unidade) => (
                      <SelectItem key={unidade} value={unidade}>
                        {unidade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unidades && <p className="text-sm text-red-500">Selecione uma unidade</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="setor" className={errors.setores ? "text-red-500" : ""}>
                  Setor *
                </Label>
                <Select value={pesquisa.setores?.[0] || ""} onValueChange={handleSetorChange}>
                  <SelectTrigger className={errors.setores ? "border-red-500 focus:ring-red-500" : ""}>
                    <SelectValue placeholder="Selecione um setor" />
                  </SelectTrigger>
                  <SelectContent>
                    {setoresDisponiveis.map((setor) => (
                      <SelectItem key={setor} value={setor}>
                        {setor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.setores && <p className="text-sm text-red-500">Selecione um setor</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={pesquisa.status === "ativa"}
                  onCheckedChange={(checked) =>
                    setPesquisa((prev) => ({ ...prev, status: checked ? "ativa" : "rascunho" }))
                  }
                />
                <Label htmlFor="status">
                  {pesquisa.status === "ativa" ? "Pesquisa Ativa" : "Salvar como Rascunho"}
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/pesquisa-satisfacao/gerenciar")}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleProximo}>
                Próximo
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="perguntas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Editar Perguntas</CardTitle>
              <CardDescription>Edite as perguntas da sua pesquisa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pesquisa.perguntas && pesquisa.perguntas.length > 0 ? (
                <div className="space-y-6">
                  {pesquisa.perguntas.map((pergunta, index) => (
                    <div key={pergunta.id} className="border rounded-lg p-4 relative">
                      <div className="absolute right-2 top-2 flex space-x-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => moverPergunta(pergunta.id, "cima")}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => moverPergunta(pergunta.id, "baixo")}
                          disabled={index === (pesquisa.perguntas?.length || 0) - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removerPergunta(pergunta.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>

                      <EditorPergunta
                        pergunta={pergunta}
                        onChange={(perguntaAtualizada) => atualizarPergunta(pergunta.id, perguntaAtualizada)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Nenhuma pergunta adicionada</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Adicione perguntas para compor sua pesquisa de satisfação
                  </p>
                </div>
              )}

              <Button type="button" variant="outline" className="w-full" onClick={adicionarPergunta}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Pergunta
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setActiveTab("informacoes")}>
                Voltar
              </Button>
              <Button type="submit" disabled={isSubmitting || !validarFormulario()}>
                {isSubmitting ? "Salvando..." : "Atualizar Pesquisa"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}

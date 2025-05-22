"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Trash2, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

// Dados mockados para demonstração
const UNIDADES = [
  { value: "unidade-1", label: "Unidade Dotse Demo" },
  { value: "unidade-2", label: "Unidade Central" },
  { value: "unidade-3", label: "Filial Norte" },
]

const SETORES = [
  { value: "setor-1", label: "Produção" },
  { value: "setor-2", label: "Administrativo" },
  { value: "setor-3", label: "Logística" },
  { value: "setor-4", label: "Manutenção" },
]

const ATIVIDADES = [
  {
    id: 1,
    descricao: "Os pisos dos setores possuem superfície antiderrapante?",
    processo: "Combinados 2023 - Queda de Mesmo Nível",
  },
  {
    id: 2,
    descricao: "Os pisos dos setores estão livres de resíduos (Carne, Sebo etc.)?",
    processo: "Combinados 2023 - Queda de Mesmo Nível",
  },
  {
    id: 3,
    descricao: "Os locais com risco de queda estão com sinalização (Placa 32 Book de Sinalização)?",
    processo: "Combinados 2023 - Queda de Mesmo Nível",
  },
  {
    id: 4,
    descricao: "Houve a Implantação da bota MaxiGripe nas tarefas mapeadas (Desossa, Bem.1° e 2°)?",
    processo: "Combinados 2023 - Queda de Mesmo Nível",
  },
  {
    id: 5,
    descricao:
      "Existe dispositivo que possibilite a realização de bloqueio físico de acesso junto aos pontos de água quente nas linhas de higienização?",
    processo: "Combinados 2023 - Água Quente",
  },
]

export function RotaInspecaoLancamentoForm() {
  const { toast } = useToast()
  const [unidade, setUnidade] = useState("")
  const [setor, setSetor] = useState("")
  const [data, setData] = useState("")
  const [responsavel, setResponsavel] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estado para as respostas das atividades
  const [respostas, setRespostas] = useState<Record<number, string>>({})
  const [observacoesAtividade, setObservacoesAtividade] = useState<Record<number, string>>({})

  // Função para atualizar a resposta de uma atividade
  const atualizarResposta = (atividadeId: number, valor: string) => {
    setRespostas((prev) => ({
      ...prev,
      [atividadeId]: valor,
    }))
  }

  // Função para atualizar a observação de uma atividade
  const atualizarObservacao = (atividadeId: number, texto: string) => {
    setObservacoesAtividade((prev) => ({
      ...prev,
      [atividadeId]: texto,
    }))
  }

  // Função para salvar o lançamento
  const salvarLancamento = () => {
    // Validação básica
    if (!unidade || !setor || !data || !responsavel) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios para continuar.",
        variant: "destructive",
      })
      return
    }

    // Verificar se todas as atividades foram respondidas
    const todasRespondidas = ATIVIDADES.every((atividade) => respostas[atividade.id])
    if (!todasRespondidas) {
      toast({
        title: "Atividades incompletas",
        description: "Responda todas as atividades antes de salvar.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulação de envio para API
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Lançamento salvo com sucesso!",
        description: "O lançamento de inspeção foi registrado no sistema.",
        variant: "success",
      })

      // Redirecionar ou limpar o formulário
      // Em um cenário real, você redirecionaria para a lista de lançamentos
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <Link
          href="/registros/rota-inspecao/lancamento"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mt-2">Novo Lançamento de Inspeção</h1>
        <p className="text-gray-500 mt-1">Preencha os dados abaixo para registrar uma nova inspeção de rota</p>
      </div>

      {/* Formulário principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="unidade" className="flex items-center">
                Unidade<span className="text-red-500 ml-1">*</span>
              </Label>
              <Select value={unidade} onValueChange={setUnidade}>
                <SelectTrigger id="unidade">
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {UNIDADES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="setor" className="flex items-center">
                Setor<span className="text-red-500 ml-1">*</span>
              </Label>
              <Select value={setor} onValueChange={setSetor}>
                <SelectTrigger id="setor">
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {SETORES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data" className="flex items-center">
                Data da Inspeção<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavel" className="flex items-center">
                Responsável<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="responsavel"
                placeholder="Nome do responsável pela inspeção"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacoes">Observações Gerais</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações gerais sobre a inspeção"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de atividades */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Atividades de Inspeção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {ATIVIDADES.map((atividade) => (
              <div key={atividade.id} className="border rounded-lg p-4 space-y-4">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    {atividade.processo}
                  </div>
                  <h3 className="text-base font-medium text-gray-800">{atividade.descricao}</h3>
                </div>

                <div>
                  <Label className="mb-2 block">
                    Avaliação<span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup
                    value={respostas[atividade.id] || ""}
                    onValueChange={(value) => atualizarResposta(atividade.id, value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="conforme" id={`conforme-${atividade.id}`} />
                      <Label
                        htmlFor={`conforme-${atividade.id}`}
                        className="flex items-center cursor-pointer text-green-700"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Conforme
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao-conforme" id={`nao-conforme-${atividade.id}`} />
                      <Label
                        htmlFor={`nao-conforme-${atividade.id}`}
                        className="flex items-center cursor-pointer text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Não Conforme
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao-se-aplica" id={`nao-se-aplica-${atividade.id}`} />
                      <Label
                        htmlFor={`nao-se-aplica-${atividade.id}`}
                        className="flex items-center cursor-pointer text-gray-700"
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Não se Aplica
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor={`obs-${atividade.id}`} className="mb-2 block">
                    Observações
                  </Label>
                  <Textarea
                    id={`obs-${atividade.id}`}
                    placeholder="Observações sobre esta atividade"
                    value={observacoesAtividade[atividade.id] || ""}
                    onChange={(e) => atualizarObservacao(atividade.id, e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botões de ação */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => {
            // Limpar formulário
            setUnidade("")
            setSetor("")
            setData("")
            setResponsavel("")
            setObservacoes("")
            setRespostas({})
            setObservacoesAtividade({})
          }}
        >
          <Trash2 className="h-4 w-4" />
          Limpar
        </Button>

        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
          onClick={salvarLancamento}
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Salvando..." : "Salvar Lançamento"}
        </Button>
      </div>
    </div>
  )
}

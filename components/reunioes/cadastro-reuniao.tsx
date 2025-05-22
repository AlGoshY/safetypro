"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Clock, Users, Save, X, BarChart3 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

// Tipos
type Participante = {
  id: string
  nome: string
  cargo: string
  setor: string
  selecionado: boolean
  papel: "Participante" | "Dono 1" | "Dono 2"
  ativo: boolean
}

type TipoReuniao = {
  id: string
  nome: string
}

type Local = {
  id: string
  nome: string
}

type Frequencia = {
  id: string
  nome: string
}

type Indicador = {
  id: string
  codigo: string
  nome: string
  valor: string
  meta: string
  unidade: string
  tipo: string
  observacao: string
  ativo: boolean
}

export function CadastroReuniao() {
  const router = useRouter()
  const { toast } = useToast()

  // Estados
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [tipoReuniao, setTipoReuniao] = useState("")
  const [local, setLocal] = useState("")
  const [dataInicio, setDataInicio] = useState<Date | undefined>(new Date())
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined)
  const [horaInicio, setHoraInicio] = useState("")
  const [horaFim, setHoraFim] = useState("")
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [participantesFiltrados, setParticipantesFiltrados] = useState<Participante[]>([])
  const [termoBusca, setTermoBusca] = useState("")
  const [participantesSelecionados, setParticipantesSelecionados] = useState<Participante[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showNovoTipoModal, setShowNovoTipoModal] = useState(false)
  const [novoTipoNome, setNovoTipoNome] = useState("")
  const [salvandoNovoTipo, setSalvandoNovoTipo] = useState(false)
  const [showNovoParticipanteForm, setShowNovoParticipanteForm] = useState(false)
  const [novoParticipanteNome, setNovoParticipanteNome] = useState("")
  const [novoParticipanteCargo, setNovoParticipanteCargo] = useState("")
  const [novoParticipanteSetor, setNovoParticipanteSetor] = useState("")
  const [novoParticipanteEmail, setNovoParticipanteEmail] = useState("")
  const [frequencia, setFrequencia] = useState("")
  const [mostrarCamposRecorrencia, setMostrarCamposRecorrencia] = useState(false)
  const [dataFimRecorrencia, setDataFimRecorrencia] = useState<Date | undefined>(undefined)
  const [diaSemana, setDiaSemana] = useState<string>("")

  // Estado para indicadores selecionados (múltiplos)
  const [indicadoresSelecionados, setIndicadoresSelecionados] = useState<string[]>([])

  // Estado para controlar a visibilidade da lista de indicadores
  const [mostrarListaIndicadores, setMostrarListaIndicadores] = useState(false)
  const [filtroIndicador, setFiltroIndicador] = useState("")

  // Adicione após os outros estados
  const [indicadorParaExcluir, setIndicadorParaExcluir] = useState<string | null>(null)
  const [mostrarListaParticipantes, setMostrarListaParticipantes] = useState(false)

  // Adicione estes novos estados após os outros estados
  const [participanteSelecionandoPapel, setParticipanteSelecionandoPapel] = useState<Participante | null>(null)
  const [papelTemporario, setPapelTemporario] = useState<"Participante" | "Dono 1" | "Dono 2">("Participante")

  // Dados mockados
  const [tiposReuniao, setTiposReuniao] = useState<TipoReuniao[]>([
    { id: "1", nome: "CIPA" },
    { id: "2", nome: "Segurança" },
    { id: "3", nome: "Operacional" },
    { id: "4", nome: "Administrativa" },
    { id: "5", nome: "Treinamento" },
  ])

  const locais: Local[] = [
    { id: "1", nome: "Sala de Reuniões 1" },
    { id: "2", nome: "Sala de Reuniões 2" },
    { id: "3", nome: "Auditório" },
    { id: "4", nome: "Sala de Treinamento" },
    { id: "5", nome: "Videoconferência" },
  ]

  const frequencias: Frequencia[] = [
    { id: "1", nome: "Diária" },
    { id: "2", nome: "Semanal" },
    { id: "3", nome: "Quinzenal" },
    { id: "4", nome: "Mensal" },
    { id: "5", nome: "Outro" },
  ]

  const diasSemana = [
    { id: "0", nome: "Domingo" },
    { id: "1", nome: "Segunda" },
    { id: "2", nome: "Terça" },
    { id: "3", nome: "Quarta" },
    { id: "4", nome: "Quinta" },
    { id: "5", nome: "Sexta" },
    { id: "6", nome: "Sábado" },
  ]

  const tiposIndicador = [
    { id: "1", codigo: "IND-001", nome: "Desempenho", ativo: true },
    { id: "2", codigo: "IND-002", nome: "Segurança", ativo: true },
    { id: "3", codigo: "IND-003", nome: "Qualidade", ativo: true },
    { id: "4", codigo: "IND-004", nome: "Financeiro", ativo: false },
    { id: "5", codigo: "IND-005", nome: "Produtividade", ativo: true },
    { id: "6", codigo: "IND-006", nome: "Outro", ativo: false },
  ]

  // Simula carregamento de participantes do banco de dados
  useState(() => {
    const participantesMock: Participante[] = [
      {
        id: "1",
        nome: "João Silva",
        cargo: "Gerente de Operações",
        setor: "Operações",
        selecionado: false,
        papel: "Participante",
        ativo: true,
      },
      {
        id: "2",
        nome: "Maria Oliveira",
        cargo: "Analista de Segurança",
        setor: "Segurança",
        selecionado: false,
        papel: "Participante",
        ativo: true,
      },
      {
        id: "3",
        nome: "Carlos Santos",
        cargo: "Técnico de Segurança",
        setor: "Segurança",
        selecionado: false,
        papel: "Participante",
        ativo: false,
      },
      {
        id: "4",
        nome: "Ana Costa",
        cargo: "Coordenadora de RH",
        setor: "Recursos Humanos",
        selecionado: false,
        papel: "Participante",
        ativo: true,
      },
      {
        id: "5",
        nome: "Roberto Almeida",
        cargo: "Engenheiro",
        setor: "Engenharia",
        selecionado: false,
        papel: "Participante",
        ativo: true,
      },
      {
        id: "6",
        nome: "Fernanda Lima",
        cargo: "Analista de Qualidade",
        setor: "Qualidade",
        selecionado: false,
        papel: "Participante",
        ativo: false,
      },
      {
        id: "7",
        nome: "Paulo Mendes",
        cargo: "Supervisor",
        setor: "Produção",
        selecionado: false,
        papel: "Participante",
        ativo: true,
      },
      {
        id: "8",
        nome: "Luciana Ferreira",
        cargo: "Técnica de Enfermagem",
        setor: "Saúde",
        selecionado: false,
        papel: "Participante",
        ativo: true,
      },
    ]
    setParticipantes(participantesMock)
    setParticipantesFiltrados(participantesMock)
  }, [])

  // Funções

  // Função para filtrar indicadores
  const filtrarIndicadores = () => {
    setMostrarListaIndicadores(true)
  }

  const filtrarParticipantes = (termo: string) => {
    setTermoBusca(termo)
    if (!termo) {
      setParticipantesFiltrados(participantes)
      return
    }

    const filtrados = participantes.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo.toLowerCase()) ||
        p.cargo.toLowerCase().includes(termo.toLowerCase()) ||
        p.setor.toLowerCase().includes(termo.toLowerCase()),
    )
    setParticipantesFiltrados(filtrados)
  }

  const buscarParticipantes = () => {
    setMostrarListaParticipantes(true)
  }

  // Substitua a função toggleParticipante existente por esta nova versão
  const toggleParticipante = (participante: Participante) => {
    // Se o participante já está selecionado, apenas remove
    if (participante.selecionado) {
      // Atualiza a lista de participantes
      const novosParticipantes = participantes.map((p) => (p.id === participante.id ? { ...p, selecionado: false } : p))
      setParticipantes(novosParticipantes)

      // Atualiza a lista filtrada
      const novosFiltrados = participantesFiltrados.map((p) =>
        p.id === participante.id ? { ...p, selecionado: false } : p,
      )
      setParticipantesFiltrados(novosFiltrados)

      // Remove da lista de selecionados
      setParticipantesSelecionados(participantesSelecionados.filter((p) => p.id !== participante.id))
    } else {
      // Se não está selecionado, abre o modal para escolher o papel
      setParticipanteSelecionandoPapel(participante)
      setPapelTemporario("Participante") // Reset para o valor padrão
    }
  }

  // Adicione esta nova função para confirmar a seleção do papel
  const confirmarSelecaoPapel = () => {
    if (!participanteSelecionandoPapel) return

    const novoParticipante = {
      ...participanteSelecionandoPapel,
      selecionado: true,
      papel: papelTemporario,
    }

    // Atualiza a lista de participantes
    const novosParticipantes = participantes.map((p) => (p.id === novoParticipante.id ? novoParticipante : p))
    setParticipantes(novosParticipantes)

    // Atualiza a lista filtrada
    const novosFiltrados = participantesFiltrados.map((p) => (p.id === novoParticipante.id ? novoParticipante : p))
    setParticipantesFiltrados(novosFiltrados)

    // Adiciona à lista de selecionados
    setParticipantesSelecionados([...participantesSelecionados, novoParticipante])

    // Fecha o modal
    setParticipanteSelecionandoPapel(null)
  }

  // Adicione esta função para cancelar a seleção
  const cancelarSelecaoPapel = () => {
    setParticipanteSelecionandoPapel(null)
  }

  const removerParticipante = (id: string) => {
    // Atualiza a lista de participantes
    const novosParticipantes = participantes.map((p) => (p.id === id ? { ...p, selecionado: false } : p))
    setParticipantes(novosParticipantes)

    // Atualiza a lista filtrada
    const novosFiltrados = participantesFiltrados.map((p) => (p.id === id ? { ...p, selecionado: false } : p))
    setParticipantesFiltrados(novosFiltrados)

    // Remove da lista de selecionados
    setParticipantesSelecionados(participantesSelecionados.filter((p) => p.id !== id))
  }

  const alterarPapelParticipante = (id: string, novoPapel: "Participante" | "Dono 1" | "Dono 2") => {
    // Atualiza a lista de participantes
    const novosParticipantes = participantes.map((p) => (p.id === id ? { ...p, papel: novoPapel } : p))
    setParticipantes(novosParticipantes)

    // Atualiza a lista filtrada
    const novosFiltrados = participantesFiltrados.map((p) => (p.id === id ? { ...p, papel: novoPapel } : p))
    setParticipantesFiltrados(novosFiltrados)

    // Atualiza a lista de selecionados
    const novosSelecionados = participantesSelecionados.map((p) => (p.id === id ? { ...p, papel: novoPapel } : p))
    setParticipantesSelecionados(novosSelecionados)
  }

  const adicionarParticipanteExterno = () => {
    // Validação básica
    if (!novoParticipanteNome.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome do participante é obrigatório",
        variant: "destructive",
      })
      return
    }

    // Gera um ID único para o novo participante
    const novoId = `ext-${Date.now()}`

    // Cria o novo participante
    const novoParticipante: Participante = {
      id: novoId,
      nome: novoParticipanteNome.trim(),
      cargo: novoParticipanteCargo.trim() || "Participante Externo",
      setor: novoParticipanteSetor.trim() || "Externo",
      selecionado: true,
      papel: "Participante",
      ativo: true,
    }

    // Adiciona à lista de participantes
    setParticipantes([...participantes, novoParticipante])
    setParticipantesFiltrados([...participantesFiltrados, novoParticipante])

    // Adiciona à lista de selecionados
    setParticipantesSelecionados([...participantesSelecionados, novoParticipante])

    // Limpa o formulário
    setNovoParticipanteNome("")
    setNovoParticipanteCargo("")
    setNovoParticipanteSetor("")
    setNovoParticipanteEmail("")
    setShowNovoParticipanteForm(false)

    toast({
      title: "Participante adicionado",
      description: `${novoParticipanteNome} foi adicionado à reunião.`,
    })
  }

  const handleSalvarNovoTipo = async () => {
    if (!novoTipoNome.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome do tipo de reunião é obrigatório",
        variant: "destructive",
      })
      return
    }

    setSalvandoNovoTipo(true)

    try {
      // Simula uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Gera um ID único para o novo tipo
      const novoId = (Math.max(...tiposReuniao.map((t) => Number.parseInt(t.id))) + 1).toString()

      // Cria o novo tipo
      const novoTipo = {
        id: novoId,
        nome: novoTipoNome.trim(),
      }

      // Adiciona à lista de tipos
      const novosTipos = [...tiposReuniao, novoTipo]
      setTiposReuniao(novosTipos)

      // Seleciona o novo tipo
      setTipoReuniao(novoId)

      // Limpa o campo e fecha o modal
      setNovoTipoNome("")
      setShowNovoTipoModal(false)

      toast({
        title: "Tipo de reunião cadastrado",
        description: `O tipo "${novoTipoNome}" foi adicionado com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro ao cadastrar tipo",
        description: "Ocorreu um erro ao cadastrar o novo tipo de reunião.",
        variant: "destructive",
      })
    } finally {
      setSalvandoNovoTipo(false)
    }
  }

  const handleFrequenciaChange = (value: string) => {
    setFrequencia(value)
    setMostrarCamposRecorrencia(value !== "")
  }

  const handleTipoReuniaoChange = (value: string) => {
    setTipoReuniao(value)
  }

  // Função para iniciar o processo de remoção de um indicador
  const iniciarRemocaoIndicador = (id: string) => {
    setIndicadorParaExcluir(id)
  }

  // Função para confirmar a remoção de um indicador
  const confirmarRemocaoIndicador = () => {
    if (indicadorParaExcluir) {
      setIndicadoresSelecionados((current) => current.filter((item) => item !== indicadorParaExcluir))
      setIndicadorParaExcluir(null)
    }
  }

  // Função para cancelar a remoção
  const cancelarRemocaoIndicador = () => {
    setIndicadorParaExcluir(null)
  }

  // Função para alternar a seleção de um indicador
  const toggleIndicador = (id: string) => {
    setIndicadoresSelecionados((current) => {
      // Se já estiver selecionado, remove
      if (current.includes(id)) {
        return current.filter((item) => item !== id)
      }
      // Senão, adiciona
      return [...current, id]
    })
  }

  // Função para remover um indicador da seleção
  const removerIndicador = (id: string) => {
    setIndicadoresSelecionados((current) => current.filter((item) => item !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Lista para armazenar os campos que faltam ser preenchidos
    const camposFaltantes: string[] = []

    // Validações de todos os campos obrigatórios
    if (!titulo.trim()) {
      camposFaltantes.push("Título da Reunião")
    }

    if (!tipoReuniao) {
      camposFaltantes.push("Tipo de Reunião")
    }

    if (!local) {
      camposFaltantes.push("Local")
    }

    if (!dataInicio) {
      camposFaltantes.push("Data de Início")
    }

    if (!horaInicio) {
      camposFaltantes.push("Hora de Início")
    }

    if (participantesSelecionados.length === 0) {
      camposFaltantes.push("Participantes (selecione pelo menos um)")
    }

    if (frequencia && !dataFimRecorrencia) {
      camposFaltantes.push("Data Fim Recorrência (obrigatório para reuniões recorrentes)")
    }

    if (frequencia === "2" && !diaSemana) {
      camposFaltantes.push("Dia da Semana (obrigatório para reuniões semanais)")
    }

    // Se houver campos faltantes, mostra mensagem e interrompe o envio
    if (camposFaltantes.length > 0) {
      toast({
        title: "Campos obrigatórios não preenchidos",
        description: (
          <div className="mt-2">
            <p className="mb-2">Por favor, preencha os seguintes campos:</p>
            <ul className="list-disc pl-5 space-y-1">
              {camposFaltantes.map((campo, index) => (
                <li key={index} className="text-sm">
                  {campo}
                </li>
              ))}
            </ul>
          </div>
        ),
        variant: "destructive",
        duration: 6000, // Aumenta a duração para dar tempo de ler a lista
      })
      return
    }

    // Se chegou aqui, todos os campos obrigatórios foram preenchidos
    // Simulação de envio para o servidor
    setIsLoading(true)

    try {
      // Simula uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Reunião cadastrada com sucesso!",
        description: "A reunião foi cadastrada e os participantes foram notificados.",
        variant: "default",
      })

      // Redireciona para a página de consulta após o cadastro
      router.push("/registros/reunioes/consultar")
    } catch (error) {
      toast({
        title: "Erro ao cadastrar reunião",
        description: "Ocorreu um erro ao cadastrar a reunião. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna 1 - Informações básicas */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="titulo" className="text-sm font-medium">
                Título da Reunião *
              </Label>
              <Input
                id="titulo"
                placeholder="Digite o título da reunião"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo-reuniao" className="text-sm font-medium">
                Tipo de Reunião *
              </Label>
              <Select value={tipoReuniao} onValueChange={handleTipoReuniaoChange}>
                <SelectTrigger id="tipo-reuniao" className="w-full">
                  <SelectValue placeholder="Selecione o tipo de reunião" />
                </SelectTrigger>
                <SelectContent>
                  {tiposReuniao.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="local" className="text-sm font-medium">
                Local *
              </Label>
              <Select value={local} onValueChange={setLocal}>
                <SelectTrigger id="local" className="w-full">
                  <SelectValue placeholder="Selecione o local" />
                </SelectTrigger>
                <SelectContent>
                  {locais.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-sm font-medium">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o objetivo da reunião"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequencia" className="text-sm font-medium">
                Frequência
              </Label>
              <Select value={frequencia} onValueChange={handleFrequenciaChange}>
                <SelectTrigger id="frequencia" className="w-full">
                  <SelectValue placeholder="Selecione a frequência (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem recorrência</SelectItem>
                  {frequencias.map((freq) => (
                    <SelectItem key={freq.id} value={freq.id}>
                      {freq.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diaSemana" className="text-sm font-medium">
                Dia da Semana
              </Label>
              <Select value={diaSemana} onValueChange={setDiaSemana}>
                <SelectTrigger id="diaSemana" className="w-full">
                  <SelectValue placeholder="Selecione o dia da semana" />
                </SelectTrigger>
                <SelectContent>
                  {diasSemana.map((dia) => (
                    <SelectItem key={dia.id} value={dia.id}>
                      {dia.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">Aplicável para reuniões recorrentes semanais</p>
            </div>

            {mostrarCamposRecorrencia && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Data Fim Recorrência</Label>
                <div className="grid gap-2">
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div>
                          <Button
                            id="date-fim-recorrencia"
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            type="button"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataFimRecorrencia ? (
                              format(dataFimRecorrencia, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                          </Button>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="single"
                          selected={dataFimRecorrencia}
                          onSelect={(date) => {
                            setDataFimRecorrencia(date)
                            // Forçar o fechamento do popover após a seleção
                            document.body.click()
                          }}
                          locale={ptBR}
                          disabled={(date) => (dataInicio ? date <= dataInicio : false)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Defina até quando esta reunião deve se repetir</p>
              </div>
            )}
          </div>

          {/* Coluna 2 - Data, hora e participantes */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Data Início *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataInicio ? format(dataInicio, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus locale={ptBR} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Data Fim</Label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div>
                        <Button
                          id="date-fim"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          type="button"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataFim ? format(dataFim, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                        </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dataFim}
                        onSelect={(date) => {
                          setDataFim(date)
                          // Forçar o fechamento do popover após a seleção
                          document.body.click()
                        }}
                        initialFocus
                        locale={ptBR}
                        disabled={(date) => (dataInicio ? date < dataInicio : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora-inicio" className="text-sm font-medium">
                  Hora Início *
                </Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <Input
                    id="hora-inicio"
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora-fim" className="text-sm font-medium">
                  Hora Fim
                </Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <Input
                    id="hora-fim"
                    type="time"
                    value={horaFim}
                    onChange={(e) => setHoraFim(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Participantes *</Label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-1 h-4 w-4" />
                    <span>{participantesSelecionados.length} selecionados</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setShowNovoParticipanteForm(!showNovoParticipanteForm)}
                  >
                    {showNovoParticipanteForm ? "Cancelar" : "Adicionar Externo"}
                  </Button>
                </div>
              </div>

              {showNovoParticipanteForm && (
                <div className="border rounded-md p-3 bg-gray-50 space-y-3">
                  <h4 className="text-sm font-medium">Adicionar Participante Externo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="novo-participante-nome" className="text-xs">
                        Nome *
                      </Label>
                      <Input
                        id="novo-participante-nome"
                        value={novoParticipanteNome}
                        onChange={(e) => setNovoParticipanteNome(e.target.value)}
                        placeholder="Nome completo"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="novo-participante-email" className="text-xs">
                        Email
                      </Label>
                      <Input
                        id="novo-participante-email"
                        value={novoParticipanteEmail}
                        onChange={(e) => setNovoParticipanteEmail(e.target.value)}
                        placeholder="email@exemplo.com"
                        type="email"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="novo-participante-cargo" className="text-xs">
                        Cargo
                      </Label>
                      <Input
                        id="novo-participante-cargo"
                        value={novoParticipanteCargo}
                        onChange={(e) => setNovoParticipanteCargo(e.target.value)}
                        placeholder="Cargo ou função"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="novo-participante-setor" className="text-xs">
                        Setor/Empresa
                      </Label>
                      <Input
                        id="novo-participante-setor"
                        value={novoParticipanteSetor}
                        onChange={(e) => setNovoParticipanteSetor(e.target.value)}
                        placeholder="Setor ou empresa"
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" size="sm" onClick={adicionarParticipanteExterno} className="h-8 text-xs">
                      Adicionar Participante
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar participantes..."
                    value={termoBusca}
                    onChange={(e) => filtrarParticipantes(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button type="button" onClick={buscarParticipantes} className="shrink-0">
                  Buscar
                </Button>
                {mostrarListaParticipantes && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMostrarListaParticipantes(false)}
                    className="shrink-0"
                  >
                    Incluir Participante
                  </Button>
                )}
              </div>

              {mostrarListaParticipantes && (
                <div className="border rounded-md max-h-[200px] overflow-y-auto">
                  {participantesFiltrados.length > 0 ? (
                    <ul className="divide-y">
                      {participantesFiltrados.map((participante) => (
                        <li key={participante.id} className="p-2 hover:bg-gray-50">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`participante-${participante.id}`}
                              checked={participante.selecionado}
                              onCheckedChange={() => toggleParticipante(participante)}
                            />
                            <Label htmlFor={`participante-${participante.id}`} className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <span className="font-medium">{participante.nome}</span>
                                <span
                                  className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    participante.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {participante.ativo ? "Ativo" : "Inativo"}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {participante.cargo} - {participante.setor}
                              </div>
                            </Label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500">Nenhum participante encontrado</div>
                  )}
                </div>
              )}

              {participantesSelecionados.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Participantes selecionados:</h4>
                  <div className="flex flex-col gap-2">
                    {participantesSelecionados.map((p) => (
                      <div
                        key={p.id}
                        className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{p.nome}</span>
                          <span
                            className={`mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              p.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {p.ativo ? "Ativo" : "Inativo"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {p.cargo} - {p.setor}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={p.papel}
                            onValueChange={(valor) =>
                              alterarPapelParticipante(p.id, valor as "Participante" | "Dono 1" | "Dono 2")
                            }
                            defaultValue="Participante"
                          >
                            <SelectTrigger className="h-7 w-32 text-xs">
                              <SelectValue placeholder="Papel" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Participante">Participante</SelectItem>
                              <SelectItem value="Dono 1">Dono 1</SelectItem>
                              <SelectItem value="Dono 2">Dono 2</SelectItem>
                            </SelectContent>
                          </Select>
                          <button
                            type="button"
                            onClick={() => removerParticipante(p.id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seção de Indicadores */}
        <div className="mt-8 border-t pt-6">
          <div className="space-y-4">
            <Label htmlFor="indicadores" className="text-sm font-medium flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
              Indicadores
            </Label>

            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Filtrar indicadores..."
                    className="w-full"
                    value={filtroIndicador}
                    onChange={(e) => setFiltroIndicador(e.target.value)}
                  />
                </div>
                <Button type="button" onClick={filtrarIndicadores} className="shrink-0">
                  Buscar
                </Button>
                {mostrarListaIndicadores && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMostrarListaIndicadores(false)}
                    className="shrink-0"
                  >
                    Incluir Indicador
                  </Button>
                )}
              </div>

              {mostrarListaIndicadores && (
                <div className="border rounded-md divide-y max-h-64 overflow-y-auto">
                  {tiposIndicador
                    .filter(
                      (ind) =>
                        filtroIndicador === "" ||
                        ind.codigo.toLowerCase().includes(filtroIndicador.toLowerCase()) ||
                        ind.nome.toLowerCase().includes(filtroIndicador.toLowerCase()),
                    )
                    .map((indicador) => (
                      <div key={indicador.id} className="flex items-center gap-2 p-3 hover:bg-gray-50">
                        <Checkbox
                          id={`indicador-${indicador.id}`}
                          checked={indicadoresSelecionados.includes(indicador.id)}
                          onCheckedChange={() => toggleIndicador(indicador.id)}
                        />
                        <Label htmlFor={`indicador-${indicador.id}`} className="flex flex-1 cursor-pointer">
                          <span className="font-medium w-24">{indicador.codigo}</span>
                          <span className="flex-1">{indicador.nome}</span>
                          <span className={`ml-auto text-xs ${indicador.ativo ? "text-green-600" : "text-red-600"}`}>
                            {indicador.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </Label>
                      </div>
                    ))}
                  {filtroIndicador !== "" &&
                    tiposIndicador.filter(
                      (ind) =>
                        ind.codigo.toLowerCase().includes(filtroIndicador.toLowerCase()) ||
                        ind.nome.toLowerCase().includes(filtroIndicador.toLowerCase()),
                    ).length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        Nenhum indicador encontrado com o termo "{filtroIndicador}"
                      </div>
                    )}
                </div>
              )}

              {indicadoresSelecionados.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Indicadores selecionados:</h4>
                    <span className="text-sm text-gray-500">{indicadoresSelecionados.length} selecionados</span>
                  </div>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Código
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Indicador
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {indicadoresSelecionados.map((id) => {
                          const indicador = tiposIndicador.find((i) => i.id === id)
                          if (!indicador) return null

                          return (
                            <tr key={id} className="hover:bg-gray-50">
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                {indicador.codigo}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{indicador.nome}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    indicador.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {indicador.ativo ? "Ativo" : "Inativo"}
                                </span>
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  type="button"
                                  onClick={() => iniciarRemocaoIndicador(id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <X size={16} />
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              handleSubmit(e as React.FormEvent)
            }}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Reunião
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Modal para cadastrar novo tipo de reunião */}
      {showNovoTipoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Cadastrar Novo Tipo de Reunião</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="novo-tipo-nome" className="text-sm font-medium">
                  Nome do Tipo *
                </Label>
                <Input
                  id="novo-tipo-nome"
                  placeholder="Digite o nome do tipo de reunião"
                  value={novoTipoNome}
                  onChange={(e) => setNovoTipoNome(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNovoTipoNome("")
                    setShowNovoTipoModal(false)
                  }}
                  disabled={salvandoNovoTipo}
                >
                  Cancelar
                </Button>
                <Button type="button" onClick={handleSalvarNovoTipo} disabled={salvandoNovoTipo}>
                  {salvandoNovoTipo ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Salvando...
                    </>
                  ) : (
                    "Salvar Tipo"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação para excluir indicador */}
      {indicadorParaExcluir && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirmar exclusão</h3>
            <p className="mb-6">Tem certeza que deseja remover este indicador da reunião?</p>
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={cancelarRemocaoIndicador}>
                Cancelar
              </Button>
              <Button type="button" variant="destructive" onClick={confirmarRemocaoIndicador}>
                Confirmar exclusão
              </Button>
            </div>
          </div>
        </div>
      )}

      {participanteSelecionandoPapel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Definir papel do participante</h3>
            <p className="mb-4">
              Selecione o papel de <strong>{participanteSelecionandoPapel.nome}</strong> na reunião:
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="papel-participante"
                  name="papel"
                  value="Participante"
                  checked={papelTemporario === "Participante"}
                  onChange={() => setPapelTemporario("Participante")}
                  className="h-4 w-4"
                />
                <label htmlFor="papel-participante" className="text-sm font-medium">
                  Participante
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="papel-dono1"
                  name="papel"
                  value="Dono 1"
                  checked={papelTemporario === "Dono 1"}
                  onChange={() => setPapelTemporario("Dono 1")}
                  className="h-4 w-4"
                />
                <label htmlFor="papel-dono1" className="text-sm font-medium">
                  Dono 1
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="papel-dono2"
                  name="papel"
                  value="Dono 2"
                  checked={papelTemporario === "Dono 2"}
                  onChange={() => setPapelTemporario("Dono 2")}
                  className="h-4 w-4"
                />
                <label htmlFor="papel-dono2" className="text-sm font-medium">
                  Dono 2
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={cancelarSelecaoPapel}>
                Cancelar
              </Button>
              <Button type="button" onClick={confirmarSelecaoPapel}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

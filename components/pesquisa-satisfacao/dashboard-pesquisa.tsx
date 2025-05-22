"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type { Pesquisa, EstatisticasPesquisa, RespostaPesquisa } from "@/types/pesquisa-satisfacao"
import { PesquisaSatisfacaoMockService } from "@/services/pesquisa-satisfacao-mock-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  BarChart,
  PieChart,
  LineChart,
  AreaChart,
  Bar,
  Pie,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from "recharts"
import {
  Calendar,
  Building,
  LayoutGrid,
  MessageSquare,
  Percent,
  TrendingUp,
  Filter,
  Download,
  Clock,
  ThumbsUp,
  Star,
  BarChart2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DashboardPesquisaProps {
  defaultPesquisaId?: string
}

export function DashboardPesquisa({ defaultPesquisaId }: DashboardPesquisaProps) {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const pesquisaIdFromUrl = searchParams.get("id")
  const pesquisaId = defaultPesquisaId || pesquisaIdFromUrl

  const [pesquisa, setPesquisa] = useState<Pesquisa | null>(null)
  const [estatisticas, setEstatisticas] = useState<EstatisticasPesquisa | null>(null)
  const [respostas, setRespostas] = useState<RespostaPesquisa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filtroUnidade, setFiltroUnidade] = useState<string>("todas")
  const [filtroSetor, setFiltroSetor] = useState<string>("todos")
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>("todos")
  const [filtroPesquisa, setFiltroPesquisa] = useState<string>(pesquisaId || "")
  const [pesquisasDisponiveis, setPesquisasDisponiveis] = useState<Pesquisa[]>([])
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [showAverage, setShowAverage] = useState<boolean>(true)
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [mostrarResultados, setMostrarResultados] = useState<boolean>(false)

  const [unidadesDisponiveis, setUnidadesDisponiveis] = useState<string[]>([])
  const [setoresDisponiveis, setSetoresDisponiveis] = useState<string[]>([])
  const [pesquisasFiltradas, setPesquisasFiltradas] = useState<Pesquisa[]>([])

  // Dados para gráficos e análises
  const [dadosGraficos, setDadosGraficos] = useState<any>(null)

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        setIsLoading(true)
        console.log("Carregando dados iniciais...")

        // Carregar lista de pesquisas disponíveis
        const pesquisas = await PesquisaSatisfacaoMockService.obterPesquisas()
        console.log("Pesquisas disponíveis:", pesquisas)

        // Extrair unidades únicas de todas as pesquisas
        const unidades = Array.from(new Set(pesquisas.flatMap((p) => p.unidades)))
        setUnidadesDisponiveis(unidades)
        setPesquisasDisponiveis(pesquisas)

        // Carregar dados para gráficos
        const dadosGraficos = await PesquisaSatisfacaoMockService.obterDadosGraficos()
        setDadosGraficos(dadosGraficos)

        // Se temos um ID de pesquisa, carregar os dados dessa pesquisa
        if (pesquisaId) {
          console.log("Carregando pesquisa com ID:", pesquisaId)
          await carregarDados(pesquisaId)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados iniciais",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    carregarDadosIniciais()
  }, [pesquisaId, toast])

  useEffect(() => {
    if (filtroUnidade === "todas") {
      // Se "todas" estiver selecionado, limpar os setores e pesquisas
      setSetoresDisponiveis([])
      setPesquisasFiltradas([])
      setFiltroSetor("todos")
      setFiltroPesquisa("")
      return
    }

    // Filtrar pesquisas que contêm a unidade selecionada
    const pesquisasDaUnidade = pesquisasDisponiveis.filter((p) => p.unidades.includes(filtroUnidade))

    // Extrair setores únicos dessas pesquisas
    const setores = Array.from(new Set(pesquisasDaUnidade.flatMap((p) => p.setores)))
    setSetoresDisponiveis(setores)

    // Resetar o filtro de setor e pesquisa
    setFiltroSetor("todos")
    setFiltroPesquisa("")
  }, [filtroUnidade, pesquisasDisponiveis])

  useEffect(() => {
    if (filtroUnidade === "todas" || filtroSetor === "todos") {
      // Se algum dos filtros estiver como "todos", não filtrar as pesquisas por setor
      if (filtroUnidade !== "todas") {
        // Filtrar apenas por unidade
        const pesquisasDaUnidade = pesquisasDisponiveis.filter((p) => p.unidades.includes(filtroUnidade))
        setPesquisasFiltradas(pesquisasDaUnidade)
      } else {
        setPesquisasFiltradas([])
      }
      setFiltroPesquisa("")
      return
    }

    // Filtrar pesquisas que contêm a unidade E o setor selecionados
    const pesquisasFiltradas = pesquisasDisponiveis.filter(
      (p) => p.unidades.includes(filtroUnidade) && p.setores.includes(filtroSetor),
    )

    setPesquisasFiltradas(pesquisasFiltradas)
    setFiltroPesquisa("")
  }, [filtroSetor, filtroUnidade, pesquisasDisponiveis])

  const carregarDados = async (id: string) => {
    try {
      console.log("Carregando dados para pesquisa ID:", id)
      setIsLoading(true)

      // Carregar dados em paralelo
      const [pesquisaData, estatisticasData, respostasData] = await Promise.all([
        PesquisaSatisfacaoMockService.obterPesquisaPorId(id),
        PesquisaSatisfacaoMockService.obterEstatisticas(id),
        PesquisaSatisfacaoMockService.obterRespostasPorPesquisa(id),
      ])

      console.log("Dados recebidos:", { pesquisaData, estatisticasData, respostasData })

      if (!pesquisaData) {
        // Se não encontrou a pesquisa, usar a pesquisa mockada padrão
        console.log("Pesquisa não encontrada, usando pesquisa mockada padrão")
        const pesquisaPadrao = await PesquisaSatisfacaoMockService.obterPesquisaPadrao()
        setPesquisa(pesquisaPadrao)
        setEstatisticas(await PesquisaSatisfacaoMockService.obterEstatisticasPadrao())
        setRespostas(await PesquisaSatisfacaoMockService.obterRespostasPadrao())
      } else {
        setPesquisa(pesquisaData)
        setEstatisticas(estatisticasData)
        setRespostas(respostasData)
      }

      // Garantir que os resultados sejam exibidos
      setMostrarResultados(true)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)

      // Em caso de erro, usar dados mockados padrão
      console.log("Usando dados mockados padrão devido a erro")
      const pesquisaPadrao = await PesquisaSatisfacaoMockService.obterPesquisaPadrao()
      setPesquisa(pesquisaPadrao)
      setEstatisticas(await PesquisaSatisfacaoMockService.obterEstatisticasPadrao())
      setRespostas(await PesquisaSatisfacaoMockService.obterRespostasPadrao())
      setMostrarResultados(true)

      toast({
        title: "Aviso",
        description: "Usando dados de demonstração devido a um erro na busca",
        variant: "default",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const aplicarFiltros = () => {
    if (!filtroPesquisa) {
      toast({
        title: "Atenção",
        description: "Selecione uma pesquisa para continuar",
        variant: "default",
      })
      return
    }

    // Adicionar log para depuração
    console.log("Aplicando filtros com pesquisa ID:", filtroPesquisa)

    // Forçar o estado de carregamento para dar feedback visual
    setIsLoading(true)

    // Pequeno timeout para garantir que a UI seja atualizada
    setTimeout(() => {
      // Recarregar dados com os filtros aplicados
      carregarDados(filtroPesquisa)

      toast({
        title: "Filtros aplicados",
        description: "Os dados foram atualizados conforme os filtros selecionados",
        variant: "default",
      })
    }, 100)
  }

  const exportarDados = () => {
    if (!respostas || !pesquisa) return

    // Criar CSV
    let csv = "Data,Unidade,Setor,Pergunta,Resposta\n"

    respostas.forEach((resposta) => {
      resposta.respostas.forEach((r) => {
        const pergunta = pesquisa.perguntas.find((p) => p.id === r.perguntaId)
        if (pergunta) {
          const data = new Date(resposta.dataResposta).toLocaleDateString("pt-BR")
          const unidade = resposta.unidade || "Não informado"
          const setor = resposta.setor || "Não informado"
          const textoPergunta = pergunta.texto.replace(/,/g, ";")
          const valorResposta = Array.isArray(r.valor) ? r.valor.join(";") : r.valor.replace(/,/g, ";")

          csv += `${data},${unidade},${setor},${textoPergunta},${valorResposta}\n`
        }
      })
    })

    // Criar e baixar o arquivo
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `pesquisa_${pesquisa.titulo.replace(/\s+/g, "_")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Exportação concluída",
      description: "Os dados foram exportados com sucesso",
      variant: "default",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho e filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Pesquisas de Satisfação</h1>
          <p className="text-gray-500">Análise de resultados e tendências das pesquisas de satisfação</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo o Período</SelectItem>
              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="30dias">Últimos 30 dias</SelectItem>
              <SelectItem value="90dias">Últimos 90 dias</SelectItem>
              <SelectItem value="6meses">Últimos 6 meses</SelectItem>
              <SelectItem value="12meses">Últimos 12 meses</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroUnidade} onValueChange={setFiltroUnidade}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as unidades</SelectItem>
              {unidadesDisponiveis.map((unidade) => (
                <SelectItem key={unidade} value={unidade}>
                  {unidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtroSetor} onValueChange={setFiltroSetor} disabled={filtroUnidade === "todas"}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os setores</SelectItem>
              {setoresDisponiveis.map((setor) => (
                <SelectItem key={setor} value={setor}>
                  {setor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filtroPesquisa}
            onValueChange={setFiltroPesquisa}
            disabled={filtroUnidade === "todas" && filtroSetor === "todos"}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Pesquisa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="selecione">Selecione uma pesquisa</SelectItem>
              {pesquisasFiltradas.length > 0
                ? pesquisasFiltradas.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.titulo}
                    </SelectItem>
                  ))
                : pesquisasDisponiveis.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.titulo}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>

          <Button onClick={aplicarFiltros} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Filter className="h-4 w-4" />
            Aplicar Filtros
          </Button>

          <Button variant="outline" onClick={exportarDados} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Conteúdo principal */}
      {mostrarResultados && pesquisa && estatisticas && dadosGraficos ? (
        <>
          <Tabs defaultValue="visaogeral" className="w-full">
            <TabsList className="mb-6 bg-white border-b border-gray-200 w-full justify-start rounded-none h-auto p-0">
              <TabsTrigger
                value="visaogeral"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-3 px-5 text-gray-600 data-[state=active]:text-blue-600"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger
                value="detalhes"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-3 px-5 text-gray-600 data-[state=active]:text-blue-600"
              >
                Detalhes
              </TabsTrigger>
              <TabsTrigger
                value="comentarios"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-3 px-5 text-gray-600 data-[state=active]:text-blue-600"
              >
                Comentários
              </TabsTrigger>
              <TabsTrigger
                value="tendencias"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-3 px-5 text-gray-600 data-[state=active]:text-blue-600"
              >
                Tendências
              </TabsTrigger>
              <TabsTrigger
                value="pesquisas"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-3 px-5 text-gray-600 data-[state=active]:text-blue-600"
              >
                Pesquisas
              </TabsTrigger>
            </TabsList>

            {/* Aba Visão Geral */}
            <TabsContent value="visaogeral" className="space-y-6 mt-0">
              {/* Cards de KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Total de Respostas</div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{estatisticas.totalRespostas}</div>
                      <div className="text-xs text-green-600 flex items-center">+12% vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Satisfação Média</div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-4">
                      <Star className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{estatisticas.mediaSatisfacao.toFixed(1)}/5</div>
                      <div className="text-xs text-green-600 flex items-center">+0.3 vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Taxa de Participação</div>
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-full mr-4">
                      <Percent className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{(estatisticas.mediaParticipacao * 100).toFixed(1)}%</div>
                      <div className="text-xs text-amber-600 flex items-center">+5% vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">NPS (Net Promoter Score)</div>
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-full mr-4">
                      <TrendingUp className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">72</div>
                      <div className="text-xs text-green-600 flex items-center">+7 pontos vs período anterior</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráficos principais */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Satisfação por Setor</h3>
                    <p className="text-sm text-gray-500">Média de satisfação por setor da empresa</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dadosGraficos.satisfacaoPorSetor}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="setor" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="satisfacao" name="Satisfação Média" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Distribuição de Respostas</h3>
                    <p className="text-sm text-gray-500">Distribuição percentual das avaliações recebidas</p>
                  </div>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosGraficos.distribuicaoRespostas}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="valor"
                          nameKey="nome"
                          label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {dadosGraficos.distribuicaoRespostas.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.cor} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Tendências e perguntas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Tendência de Satisfação</h3>
                    <p className="text-sm text-gray-500">Evolução da satisfação média ao longo do tempo</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dadosGraficos.tendenciaSatisfacao}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis domain={[3, 5]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="satisfacao"
                          name="Satisfação Média"
                          stroke="#3b82f6"
                          activeDot={{ r: 8 }}
                        />
                        <ReferenceLine
                          y={4.5}
                          stroke="#10b981"
                          strokeDasharray="3 3"
                          label={{ position: "right", value: "Meta: 4.5", fill: "#10b981", fontSize: 12 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Perguntas Mais Relevantes</h3>
                    <p className="text-sm text-gray-500">Perguntas com maior número de respostas</p>
                  </div>
                  <div className="space-y-4">
                    {dadosGraficos.perguntasMaisRelevantes.map((pergunta: any) => (
                      <div key={pergunta.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="truncate max-w-[70%]">{pergunta.texto}</span>
                          <span className="font-medium">
                            {pergunta.satisfacao.toFixed(1)}/5 ({pergunta.respostas} resp.)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(pergunta.satisfacao / 5) * 100}
                            className="h-2 flex-grow"
                            style={
                              {
                                background: "#f3f4f6",
                                "--progress-background":
                                  pergunta.satisfacao >= 4.5
                                    ? "#10b981"
                                    : pergunta.satisfacao >= 4.0
                                      ? "#3b82f6"
                                      : pergunta.satisfacao >= 3.5
                                        ? "#f59e0b"
                                        : "#ef4444",
                              } as React.CSSProperties
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Respostas por tempo e satisfação por canal */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Respostas por Tempo</h3>
                    <p className="text-sm text-gray-500">Quantidade de respostas recebidas por dia</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={dadosGraficos.respostasPorTempo}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="data" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="quantidade"
                          name="Quantidade de Respostas"
                          stroke="#3b82f6"
                          fill="#93c5fd"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Satisfação por Canal</h3>
                    <p className="text-sm text-gray-500">Média de satisfação por canal de resposta</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dadosGraficos.satisfacaoPorCanal}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="canal" />
                        <YAxis yAxisId="left" orientation="left" domain={[0, 5]} />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="satisfacao" name="Satisfação Média" fill="#3b82f6" />
                        <Bar yAxisId="right" dataKey="respostas" name="Número de Respostas" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba Detalhes */}
            <TabsContent value="detalhes" className="space-y-6 mt-0">
              {/* Cards de KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Tempo Médio de Resposta</div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">3.2 min</div>
                      <div className="text-xs text-green-600 flex items-center">-1.3 min vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Taxa de Conclusão</div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-4">
                      <ThumbsUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">92%</div>
                      <div className="text-xs text-green-600 flex items-center">+5% vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Índice de Recomendação</div>
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-full mr-4">
                      <TrendingUp className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">85%</div>
                      <div className="text-xs text-green-600 flex items-center">+7% vs período anterior</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Satisfação por período e detalhes da pesquisa */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Satisfação por Período do Dia</h3>
                    <p className="text-sm text-gray-500">Média de satisfação por período do dia</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dadosGraficos.satisfacaoPorPeriodo}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="periodo" />
                        <YAxis yAxisId="left" orientation="left" domain={[0, 5]} />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="satisfacao" name="Satisfação Média" fill="#3b82f6" />
                        <Bar yAxisId="right" dataKey="respostas" name="Número de Respostas" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Detalhes da Pesquisa</h3>
                    <p className="text-sm text-gray-500">Informações detalhadas sobre a pesquisa selecionada</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Período da Pesquisa</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(pesquisa.dataInicio).toLocaleDateString("pt-BR")} a{" "}
                            {new Date(pesquisa.dataFim).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <MessageSquare className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Perguntas</p>
                          <p className="text-sm text-muted-foreground">{pesquisa.perguntas.length} perguntas</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="bg-amber-100 p-2 rounded-full mr-3">
                          <Building className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Unidade</p>
                          <p className="text-sm text-muted-foreground">
                            {filtroUnidade === "todas" ? `${pesquisa.unidades.length} unidades` : filtroUnidade}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <LayoutGrid className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Setores</p>
                          <p className="text-sm text-muted-foreground">
                            {filtroSetor === "todos" ? `${pesquisa.setores.length} setores` : filtroSetor}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Descrição da Pesquisa</h4>
                    <p className="text-sm text-gray-600">{pesquisa.descricao}</p>
                  </div>
                </div>
              </div>

              {/* Comparativo mensal e perguntas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Comparativo Mensal</h3>
                    <p className="text-sm text-gray-500">Comparação com o período anterior</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dadosGraficos.comparativoMensal}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis domain={[3, 5]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="atual"
                          name="Período Atual"
                          stroke="#3b82f6"
                          activeDot={{ r: 8 }}
                        />
                        <Line type="monotone" dataKey="anterior" name="Período Anterior" stroke="#9ca3af" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Perguntas da Pesquisa</h3>
                    <p className="text-sm text-gray-500">Lista de perguntas incluídas na pesquisa</p>
                  </div>
                  <div className="overflow-y-auto max-h-80 pr-2">
                    <div className="space-y-4">
                      {pesquisa.perguntas.map((pergunta, index) => (
                        <div key={pergunta.id} className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium">
                                {index + 1}. {pergunta.texto}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Tipo: {pergunta.tipo === "escala" ? "Escala (1-5)" : pergunta.tipo}
                              </p>
                            </div>
                            {pergunta.tipo === "escala" && (
                              <div className="flex items-center ml-4">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${star <= 4 ? "text-amber-400" : "text-gray-300"}`}
                                      fill={star <= 4 ? "#f59e0b" : "none"}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium ml-2">4.0</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Correlação entre fatores */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Correlação entre Fatores</h3>
                  <p className="text-sm text-gray-500">
                    Relação entre satisfação (x), taxa de conclusão (y) e número de respostas (z)
                  </p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="x" name="Satisfação Média" domain={[3, 5]} />
                      <YAxis type="number" dataKey="y" name="Taxa de Conclusão (%)" domain={[80, 100]} />
                      <ZAxis type="number" dataKey="z" range={[50, 400]} name="Número de Respostas" />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(value, name, props) => {
                          if (name === "Satisfação Média") return [value.toFixed(1), name]
                          if (name === "Taxa de Conclusão (%)") return [`${value}%`, name]
                          return [value, name]
                        }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-white p-2 border rounded shadow-sm">
                                <p className="font-medium">{data.nome}</p>
                                <p className="text-sm">
                                  Satisfação: <span className="font-medium">{data.x.toFixed(1)}</span>
                                </p>
                                <p className="text-sm">
                                  Taxa de Conclusão: <span className="font-medium">{data.y}%</span>
                                </p>
                                <p className="text-sm">
                                  Respostas: <span className="font-medium">{data.z}</span>
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend />
                      <Scatter name="Fatores" data={dadosGraficos.correlacaoFatores} fill="#3b82f6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            {/* Aba Comentários */}
            <TabsContent value="comentarios" className="space-y-6 mt-0">
              {/* Cards de KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Total de Comentários</div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">128</div>
                      <div className="text-xs text-green-600 flex items-center">+15% vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Sentimento Positivo</div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-4">
                      <ThumbsUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">72%</div>
                      <div className="text-xs text-green-600 flex items-center">+8% vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Taxa de Comentários</div>
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-full mr-4">
                      <Percent className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">35%</div>
                      <div className="text-xs text-green-600 flex items-center">+5% vs período anterior</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comentários recentes */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Comentários Recentes</h3>
                  <p className="text-sm text-gray-500">Últimos comentários recebidos nas pesquisas</p>
                </div>
                <div className="space-y-4">
                  {dadosGraficos.comentariosRecentes.map((comentario: any) => (
                    <div key={comentario.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">{comentario.autor}</span> • {comentario.setor} •{" "}
                            {comentario.data}
                          </p>
                          <p className="mt-2">{comentario.texto}</p>
                        </div>
                        <div className="flex items-center ml-4">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= comentario.avaliacao ? "text-amber-400" : "text-gray-300"
                                }`}
                                fill={star <= comentario.avaliacao ? "#f59e0b" : "none"}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium ml-2">{comentario.avaliacao}/5</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    Ver todos os comentários
                  </Button>
                </div>
              </div>

              {/* Análise de sentimento e nuvem de palavras */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Análise de Sentimento</h3>
                    <p className="text-sm text-gray-500">Distribuição de sentimentos nos comentários</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Positivo", value: 72, color: "#10b981" },
                            { name: "Neutro", value: 18, color: "#f59e0b" },
                            { name: "Negativo", value: 10, color: "#ef4444" },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: "Positivo", value: 72, color: "#10b981" },
                            { name: "Neutro", value: 18, color: "#f59e0b" },
                            { name: "Negativo", value: 10, color: "#ef4444" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Tópicos Mais Mencionados</h3>
                    <p className="text-sm text-gray-500">Palavras-chave mais frequentes nos comentários</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { palavra: "Atendimento", contagem: 45, percentual: 22 },
                      { palavra: "Qualidade", contagem: 38, percentual: 19 },
                      { palavra: "Preço", contagem: 32, percentual: 16 },
                      { palavra: "Entrega", contagem: 28, percentual: 14 },
                      { palavra: "Suporte", contagem: 22, percentual: 11 },
                      { palavra: "Outros", contagem: 35, percentual: 18 },
                    ].map((topico) => (
                      <div key={topico.palavra} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{topico.palavra}</span>
                          <span className="font-medium">
                            {topico.contagem} menções ({topico.percentual}%)
                          </span>
                        </div>
                        <Progress value={topico.percentual} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comentários por setor */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Comentários por Setor</h3>
                  <p className="text-sm text-gray-500">Distribuição de comentários por setor</p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { setor: "Produção", positivos: 35, neutros: 8, negativos: 5 },
                        { setor: "Administrativo", positivos: 28, neutros: 10, negativos: 4 },
                        { setor: "Logística", positivos: 22, neutros: 5, negativos: 3 },
                        { setor: "Recursos Humanos", positivos: 18, neutros: 4, negativos: 2 },
                        { setor: "Financeiro", positivos: 15, neutros: 3, negativos: 4 },
                        { setor: "TI", positivos: 20, neutros: 6, negativos: 2 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="setor" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="positivos" name="Positivos" stackId="a" fill="#10b981" />
                      <Bar dataKey="neutros" name="Neutros" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="negativos" name="Negativos" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            {/* Aba Tendências */}
            <TabsContent value="tendencias" className="space-y-6 mt-0">
              {/* Cards de KPIs de Tendências */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Tendência de Satisfação</div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">+0.6</div>
                      <div className="text-xs text-green-600 flex items-center">Crescimento anual</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Tendência de Participação</div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-4">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">+12%</div>
                      <div className="text-xs text-green-600 flex items-center">
                        Aumento constante nos últimos 6 meses
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Previsão para Próximo Trimestre</div>
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-full mr-4">
                      <Star className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">4.9/5</div>
                      <div className="text-xs text-purple-600 flex items-center">Satisfação projetada</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tendências ao longo do tempo */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Tendências ao Longo do Tempo</h3>
                  <p className="text-sm text-gray-500">Evolução das principais métricas nos últimos 12 meses</p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dadosGraficos.tendenciaSatisfacao.map((item: any, index: number) => ({
                        ...item,
                        participacao: 60 + index * 2,
                        respostas: 80 + index * 5,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis yAxisId="left" orientation="left" domain={[0, 5]} />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="satisfacao"
                        name="Satisfação Média"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="participacao"
                        name="Taxa de Participação (%)"
                        stroke="#10b981"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="respostas"
                        name="Número de Respostas"
                        stroke="#f59e0b"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Previsões e Indicadores de Desempenho */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Previsão para os Próximos 6 Meses</h3>
                    <p className="text-sm text-gray-500">Projeção de satisfação com intervalo de confiança</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={dadosGraficos.previsaoProximosMeses}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis domain={[4, 5]} />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="intervaloSuperior"
                          name="Limite Superior"
                          stroke="#e5e7eb"
                          fill="#e5e7eb"
                        />
                        <Area type="monotone" dataKey="previsto" name="Previsão" stroke="#3b82f6" fill="#93c5fd" />
                        <Area
                          type="monotone"
                          dataKey="intervaloInferior"
                          name="Limite Inferior"
                          stroke="#e5e7eb"
                          fill="#ffffff"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Indicadores de Desempenho</h3>
                    <p className="text-sm text-gray-500">Comparativo entre período atual, anterior e metas</p>
                  </div>
                  <div className="space-y-4">
                    {dadosGraficos.indicadoresDesempenho.map((indicador: any) => (
                      <div key={indicador.nome} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{indicador.nome}</span>
                          <span className="font-medium">
                            {typeof indicador.atual === "number" && !Number.isInteger(indicador.atual)
                              ? indicador.atual.toFixed(1)
                              : indicador.atual}
                            {indicador.nome === "Tempo Médio de Resposta (min)" ? "" : "%"}
                            <span
                              className={`ml-2 ${
                                indicador.tendencia === "aumento"
                                  ? indicador.nome === "Tempo Médio de Resposta (min)"
                                    ? "text-red-600"
                                    : "text-green-600"
                                  : indicador.nome === "Tempo Médio de Resposta (min)"
                                    ? "text-green-600"
                                    : "text-red-600"
                              }`}
                            >
                              {indicador.tendencia === "aumento" ? "↑" : "↓"}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={
                              indicador.nome === "Tempo Médio de Resposta (min)"
                                ? ((indicador.meta - indicador.atual) / indicador.meta) * 100
                                : (indicador.atual / indicador.meta) * 100
                            }
                            max={100}
                            className="h-2 flex-grow"
                          />
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-500">
                              Meta:{" "}
                              {typeof indicador.meta === "number" && !Number.isInteger(indicador.meta)
                                ? indicador.meta.toFixed(1)
                                : indicador.meta}
                              {indicador.nome === "Tempo Médio de Resposta (min)" ? "" : "%"}
                            </span>
                            <span className="h-4 w-px bg-gray-300"></span>
                            <span className="text-purple-600">
                              Previsão:{" "}
                              {typeof indicador.previsao === "number" && !Number.isInteger(indicador.previsao)
                                ? indicador.previsao.toFixed(1)
                                : indicador.previsao}
                              {indicador.nome === "Tempo Médio de Resposta (min)" ? "" : "%"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Insights e Recomendações */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Insights e Recomendações</h3>
                  <p className="text-sm text-gray-500">Análises baseadas nas tendências identificadas</p>
                </div>
                <div className="space-y-4">
                  <div className="flex p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex-shrink-0 mr-3">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 16V12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 8H12.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">Aumento consistente na satisfação</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        A satisfação média tem aumentado consistentemente nos últimos 6 meses, indicando que as
                        melhorias implementadas estão surtindo efeito.
                      </p>
                    </div>
                  </div>

                  <div className="flex p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex-shrink-0 mr-3">
                      <svg
                        className="h-6 w-6 text-green-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 12L11 15L16 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900">Canal QR Code com melhor desempenho</h4>
                      <p className="text-sm text-green-800 mt-1">
                        O canal de pesquisa via QR Code apresenta a maior satisfação média (4.5/5). Recomenda-se
                        expandir o uso deste canal para outras áreas.
                      </p>
                    </div>
                  </div>

                  <div className="flex p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex-shrink-0 mr-3">
                      <svg
                        className="h-6 w-6 text-amber-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.6415 19.6871 1.81442 19.9905C1.98734 20.2939 2.23672 20.5467 2.53773 20.7238C2.83875 20.9009 3.1808 20.9961 3.53 21H20.47C20.8192 20.9961 21.1613 20.9009 21.4623 20.7238C21.7633 20.5467 22.0127 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 9V13"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 17H12.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-900">Oportunidade de melhoria no prazo de entrega</h4>
                      <p className="text-sm text-amber-800 mt-1">
                        O prazo de entrega é o item com menor satisfação (3.8/5). Recomenda-se revisar os processos
                        logísticos para melhorar este indicador.
                      </p>
                    </div>
                  </div>

                  <div className="flex p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex-shrink-0 mr-3">
                      <svg
                        className="h-6 w-6 text-purple-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-900">Atendimento é o ponto forte</h4>
                      <p className="text-sm text-purple-800 mt-1">
                        "Atendimento" é a palavra mais mencionada nos comentários positivos (45 menções). Recomenda-se
                        reconhecer e reforçar as boas práticas da equipe de atendimento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba Pesquisas */}
            <TabsContent value="pesquisas" className="space-y-6 mt-0">
              {/* Cards de KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Pesquisas Ativas</div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <BarChart2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">12</div>
                      <div className="text-xs text-green-600 flex items-center">+3 vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Taxa de Conclusão</div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-4">
                      <ThumbsUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">85%</div>
                      <div className="text-xs text-green-600 flex items-center">+7% vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Tempo Médio de Resposta</div>
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">3.2 min</div>
                      <div className="text-xs text-green-600 flex items-center">-1.3 min vs período anterior</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pesquisas ativas */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Pesquisas Ativas</h3>
                  <p className="text-sm text-gray-500">Pesquisas em andamento ou recentemente concluídas</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Título</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Início</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Término</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Respostas</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Satisfação</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosGraficos.pesquisasAtivas.map((pesquisa: any) => {
                        const hoje = new Date()
                        const dataInicio = new Date(pesquisa.dataInicio)
                        const dataFim = new Date(pesquisa.dataFim)
                        const status = hoje < dataInicio ? "Agendada" : hoje > dataFim ? "Concluída" : "Em andamento"

                        return (
                          <tr key={pesquisa.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{pesquisa.id}</td>
                            <td className="py-3 px-4">{pesquisa.titulo}</td>
                            <td className="py-3 px-4">{new Date(pesquisa.dataInicio).toLocaleDateString("pt-BR")}</td>
                            <td className="py-3 px-4">{new Date(pesquisa.dataFim).toLocaleDateString("pt-BR")}</td>
                            <td className="py-3 px-4">{pesquisa.respostas}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <span className="font-medium mr-2">{pesquisa.satisfacaoMedia.toFixed(1)}</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= Math.round(pesquisa.satisfacaoMedia)
                                          ? "text-amber-400"
                                          : "text-gray-300"
                                      }`}
                                      fill={star <= Math.round(pesquisa.satisfacaoMedia) ? "#f59e0b" : "none"}
                                    />
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  status === "Em andamento"
                                    ? "bg-green-100 text-green-800"
                                    : status === "Agendada"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {status}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    Ver todas as pesquisas
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
          <div className="mb-4">
            <svg
              className="h-12 w-12 text-gray-400 mx-auto"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M12 8H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhuma pesquisa selecionada</h3>
          <p className="text-gray-500 mb-6">Selecione uma pesquisa nos filtros acima para visualizar os resultados.</p>
          <Button onClick={() => carregarDados("pesquisa-demo")} className="bg-blue-600 hover:bg-blue-700">
            Carregar Pesquisa de Demonstração
          </Button>
        </div>
      )}
    </div>
  )
}

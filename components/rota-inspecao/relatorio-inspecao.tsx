"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight, ExternalLink, Search, Settings2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DetalhesInspecaoModal } from "./detalhes-inspecao-modal"

// Dados mockados para demonstração
const REGIONAIS = [
  { value: "regional-dotse", label: "Regional Dotse" },
  { value: "regional-sul", label: "Regional Sul" },
  { value: "regional-norte", label: "Regional Norte" },
]

const FILIAIS_CENTRALIZADORAS = [
  { value: "filial-central-1", label: "Filial Central 1" },
  { value: "filial-central-2", label: "Filial Central 2" },
  { value: "filial-central-3", label: "Filial Central 3" },
]

const FILIAIS = [
  { value: "filial-1", label: "Filial 1" },
  { value: "filial-2", label: "Filial 2" },
  { value: "filial-3", label: "Filial 3" },
]

const TECNICOS = [
  { value: "adm", label: "ADM" },
  { value: "demo1", label: "DEMO1" },
  { value: "demo2", label: "DEMO2" },
  { value: "demo12", label: "DEMO12" },
]

// Colunas disponíveis para exibição
const COLUNAS_DISPONIVEIS = [
  { id: "visualizar", label: "Visualizar" },
  { id: "regional", label: "Regional" },
  { id: "unidade", label: "Unidade" },
  { id: "tecnico", label: "Técnico" },
  { id: "setor", label: "Setor" },
  { id: "gestores", label: "Gestores" },
  { id: "data", label: "Data" },
  { id: "qtdItens", label: "Qtd Itens" },
  { id: "qtdAvaliados", label: "Qtd Avaliados" },
  { id: "percentAvaliado", label: "% Avaliado" },
  { id: "conformes", label: "Conformes" },
  { id: "naoConformes", label: "Não Conformes" },
  { id: "percentNaoConforme", label: "% Não conforme" },
  { id: "naoSeAplica", label: "Não se Aplica" },
  { id: "percentConformidade", label: "% Conformidade" },
  { id: "acoesRealizadas", label: "Ações Realizadas" },
  { id: "acoesNaoRealizadas", label: "Ações Não realizadas" },
  { id: "prioridade", label: "Prioridade" },
  { id: "acoes", label: "Ações" },
  { id: "status", label: "Status" },
]

// Dados mockados para a tabela
const DADOS_MOCKADOS = [
  {
    id: 1,
    regional: "Regional Dotse",
    unidade: "Unidade Dotse Demo",
    tecnico: "ADM",
    setor: "Produção",
    gestores: "João Silva",
    data: null, // Sem lançamento
    qtdItens: 56,
    qtdAvaliados: 0,
    percentAvaliado: 0,
    conformes: 0,
    naoConformes: 0,
    percentNaoConforme: 0,
    naoSeAplica: 0,
    percentConformidade: 0,
    acoesRealizadas: 0,
    acoesNaoRealizadas: 0,
    prioridade: "Alta",
    acoes: true,
    status: "Não realizado",
  },
  {
    id: 2,
    regional: "Regional Dotse",
    unidade: "Unidade Dotse Demo",
    tecnico: "DEMO1",
    setor: "Administrativo",
    gestores: "Maria Oliveira",
    data: null, // Sem lançamento
    qtdItens: 4,
    qtdAvaliados: 0,
    percentAvaliado: 0,
    conformes: 0,
    naoConformes: 0,
    percentNaoConforme: 0,
    naoSeAplica: 0,
    percentConformidade: 0,
    acoesRealizadas: 0,
    acoesNaoRealizadas: 0,
    prioridade: "Média",
    acoes: true,
    status: "Não realizado",
  },
  {
    id: 3,
    regional: "Regional Dotse",
    unidade: "Unidade Dotse Demo",
    tecnico: "DEMO12",
    setor: "Logística",
    gestores: "Carlos Santos",
    data: null, // Sem lançamento
    qtdItens: 51,
    qtdAvaliados: 0,
    percentAvaliado: 0,
    conformes: 0,
    naoConformes: 0,
    percentNaoConforme: 0,
    naoSeAplica: 0,
    percentConformidade: 0,
    acoesRealizadas: 0,
    acoesNaoRealizadas: 0,
    prioridade: "Baixa",
    acoes: true,
    status: "Não realizado",
  },
  {
    id: 4,
    regional: "Regional Dotse",
    unidade: "Unidade Dotse Demo",
    tecnico: "DEMO2",
    setor: "Manutenção",
    gestores: "Ana Pereira",
    data: null, // Sem lançamento
    qtdItens: 72,
    qtdAvaliados: 0,
    percentAvaliado: 0,
    conformes: 0,
    naoConformes: 0,
    percentNaoConforme: 0,
    naoSeAplica: 0,
    percentConformidade: 0,
    acoesRealizadas: 0,
    acoesNaoRealizadas: 0,
    prioridade: "Alta",
    acoes: true,
    status: "Não realizado",
  },
  {
    id: 5,
    regional: "Regional Dotse",
    unidade: "Unidade Dotse Demo",
    tecnico: "DEMO3",
    setor: "Segurança",
    gestores: "Roberto Alves",
    data: null, // Sem lançamento
    qtdItens: 24,
    qtdAvaliados: 0,
    percentAvaliado: 0,
    conformes: 0,
    naoConformes: 0,
    percentNaoConforme: 0,
    naoSeAplica: 0,
    percentConformidade: 0,
    acoesRealizadas: 0,
    acoesNaoRealizadas: 0,
    prioridade: "Média",
    acoes: true,
    status: "Não realizado",
  },
]

export function RelatorioInspecao() {
  // Estados para os filtros
  const [regional, setRegional] = useState("")
  const [filialCentralizadora, setFilialCentralizadora] = useState("")
  const [filial, setFilial] = useState("")
  const [tecnico, setTecnico] = useState("")
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined)
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined)

  // Estado para a busca global
  const [busca, setBusca] = useState("")

  // Estado para as colunas visíveis
  const [colunasVisiveis, setColunasVisiveis] = useState<string[]>(COLUNAS_DISPONIVEIS.map((col) => col.id))

  // Estado para os dados filtrados
  const [dadosFiltrados, setDadosFiltrados] = useState<any[]>([])

  // Estado para controlar se os dados foram carregados
  const [dadosCarregados, setDadosCarregados] = useState(false)

  // Estado para controlar o loading
  const [isLoading, setIsLoading] = useState(false)

  // Função para consultar atividades
  const consultarAtividades = () => {
    // Simular carregamento
    setIsLoading(true)

    // Simular chamada à API
    setTimeout(() => {
      // Aplicar filtros se fornecidos
      let resultados = [...DADOS_MOCKADOS]

      // Aplicar filtros apenas se estiverem preenchidos
      if (regional) {
        resultados = resultados.filter((item) =>
          item.regional.includes(REGIONAIS.find((r) => r.value === regional)?.label || ""),
        )
      }

      if (filialCentralizadora) {
        // Filtro simulado para filial centralizadora
      }

      if (filial) {
        // Filtro simulado para filial
      }

      if (tecnico) {
        resultados = resultados.filter((item) => item.tecnico === TECNICOS.find((t) => t.value === tecnico)?.label)
      }

      if (dataInicio && dataFim) {
        // Filtro simulado para datas
      }

      // Mostrar dados filtrados ou todos os dados
      setDadosFiltrados(resultados)
      setDadosCarregados(true)
      setIsLoading(false)

      toast({
        title: "Consulta realizada",
        description: `${resultados.length} registros encontrados.`,
      })
    }, 1000)
  }

  // Função para alternar a visibilidade de uma coluna
  const toggleColunaVisivel = (colunaId: string) => {
    setColunasVisiveis((prev) => {
      if (prev.includes(colunaId)) {
        return prev.filter((id) => id !== colunaId)
      } else {
        return [...prev, colunaId]
      }
    })
  }

  // Função para formatar a data
  const formatarData = (date: Date | null) => {
    if (!date) return null
    return format(date, "dd/MM/yyyy", { locale: ptBR })
  }

  // Função para filtrar dados com base na busca global
  const filtrarDados = () => {
    if (!busca.trim()) return dadosFiltrados

    const termoBusca = busca.toLowerCase()
    return dadosFiltrados.filter((item) => {
      return Object.entries(item).some(([key, value]) => {
        // Ignorar o id e campos booleanos
        if (key === "id" || typeof value === "boolean") return false

        // Converter para string e verificar se contém o termo de busca
        return String(value).toLowerCase().includes(termoBusca)
      })
    })
  }

  // Dados filtrados pela busca global
  const dadosFiltradosPorBusca = busca.trim() ? filtrarDados() : dadosFiltrados

  return (
    <div>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center">
            <Users className="mr-2 h-5 w-5 text-blue-600" />
            Relatório de Rota de Inspeção
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="regional" className="block text-sm font-medium text-gray-700 mb-1">
                Regional<span className="text-red-500">*</span>
              </label>
              <Select value={regional} onValueChange={setRegional}>
                <SelectTrigger id="regional" className="w-full">
                  <SelectValue placeholder="Selecione a regional" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONAIS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="filialCentralizadora" className="block text-sm font-medium text-gray-700 mb-1">
                Filial Centralizadora<span className="text-red-500">*</span>
              </label>
              <Select value={filialCentralizadora} onValueChange={setFilialCentralizadora}>
                <SelectTrigger id="filialCentralizadora" className="w-full">
                  <SelectValue placeholder="Selecione a filial centralizadora" />
                </SelectTrigger>
                <SelectContent>
                  {FILIAIS_CENTRALIZADORAS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="filial" className="block text-sm font-medium text-gray-700 mb-1">
                Filial<span className="text-red-500">*</span>
              </label>
              <Select value={filial} onValueChange={setFilial}>
                <SelectTrigger id="filial" className="w-full">
                  <SelectValue placeholder="Selecione a filial" />
                </SelectTrigger>
                <SelectContent>
                  {FILIAIS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="tecnico" className="block text-sm font-medium text-gray-700 mb-1">
                Técnico<span className="text-red-500">*</span>
              </label>
              <Select value={tecnico} onValueChange={setTecnico}>
                <SelectTrigger id="tecnico" className="w-full">
                  <SelectValue placeholder="Selecione o técnico" />
                </SelectTrigger>
                <SelectContent>
                  {TECNICOS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-1">
                Início<span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dataInicio && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus locale={ptBR} />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-1">
                Fim<span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dataFim && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dataFim} onSelect={setDataFim} initialFocus locale={ptBR} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setRegional("")
                setFilialCentralizadora("")
                setFilial("")
                setTecnico("")
                setDataInicio(undefined)
                setDataFim(undefined)
                setBusca("")
                if (dadosCarregados) {
                  setDadosCarregados(false)
                  setDadosFiltrados([])
                }
                toast({
                  title: "Filtros limpos",
                  description: "Todos os filtros foram removidos.",
                })
              }}
              variant="outline"
              className="text-gray-700"
            >
              Limpar Filtros
            </Button>
            <Button
              onClick={consultarAtividades}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Consultando..." : "CONSULTAR ATIVIDADES"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de resultados */}
      {dadosCarregados && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Resultados da consulta</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Personalizar colunas</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <div className="space-y-2">
                        {COLUNAS_DISPONIVEIS.map((coluna) => (
                          <div key={coluna.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`coluna-${coluna.id}`}
                              checked={colunasVisiveis.includes(coluna.id)}
                              onCheckedChange={() => toggleColunaVisivel(coluna.id)}
                            />
                            <label
                              htmlFor={`coluna-${coluna.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {coluna.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {colunasVisiveis.includes("visualizar") && <TableHead className="w-10"></TableHead>}
                    {colunasVisiveis.includes("regional") && <TableHead>Regional</TableHead>}
                    {colunasVisiveis.includes("unidade") && <TableHead>Unidade</TableHead>}
                    {colunasVisiveis.includes("tecnico") && <TableHead>Técnico</TableHead>}
                    {colunasVisiveis.includes("setor") && <TableHead>Setor</TableHead>}
                    {colunasVisiveis.includes("gestores") && <TableHead>Gestores</TableHead>}
                    {colunasVisiveis.includes("data") && <TableHead>Data</TableHead>}
                    {colunasVisiveis.includes("qtdItens") && <TableHead className="text-right">Qtd Itens</TableHead>}
                    {colunasVisiveis.includes("qtdAvaliados") && (
                      <TableHead className="text-right">Qtd Avaliados</TableHead>
                    )}
                    {colunasVisiveis.includes("percentAvaliado") && (
                      <TableHead className="text-right">% Avaliado</TableHead>
                    )}
                    {colunasVisiveis.includes("conformes") && <TableHead className="text-right">Conformes</TableHead>}
                    {colunasVisiveis.includes("naoConformes") && (
                      <TableHead className="text-right">Não Conformes</TableHead>
                    )}
                    {colunasVisiveis.includes("percentNaoConforme") && (
                      <TableHead className="text-right">% Não conforme</TableHead>
                    )}
                    {colunasVisiveis.includes("naoSeAplica") && (
                      <TableHead className="text-right">Não se Aplica</TableHead>
                    )}
                    {colunasVisiveis.includes("percentConformidade") && (
                      <TableHead className="text-right">% Conformidade</TableHead>
                    )}
                    {colunasVisiveis.includes("acoesRealizadas") && (
                      <TableHead className="text-right">Ações Realizadas</TableHead>
                    )}
                    {colunasVisiveis.includes("acoesNaoRealizadas") && (
                      <TableHead className="text-right">Ações Não realizadas</TableHead>
                    )}
                    {colunasVisiveis.includes("prioridade") && <TableHead>Prioridade</TableHead>}
                    {colunasVisiveis.includes("acoes") && <TableHead>Ações</TableHead>}
                    {colunasVisiveis.includes("status") && <TableHead>Status</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosFiltradosPorBusca.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={colunasVisiveis.length} className="text-center py-6">
                        Nenhum resultado encontrado para os critérios informados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    dadosFiltradosPorBusca.map((item) => (
                      <TableRow key={item.id}>
                        {colunasVisiveis.includes("visualizar") && (
                          <TableCell className="text-center">
                            <DetalhesInspecaoModal item={item} />
                          </TableCell>
                        )}
                        {colunasVisiveis.includes("regional") && <TableCell>{item.regional}</TableCell>}
                        {colunasVisiveis.includes("unidade") && <TableCell>{item.unidade}</TableCell>}
                        {colunasVisiveis.includes("tecnico") && <TableCell>{item.tecnico}</TableCell>}
                        {colunasVisiveis.includes("setor") && <TableCell>{item.setor}</TableCell>}
                        {colunasVisiveis.includes("gestores") && <TableCell>{item.gestores}</TableCell>}
                        {colunasVisiveis.includes("data") && (
                          <TableCell>
                            {item.data ? formatarData(item.data) : <span className="text-red-600">Sem lançamento</span>}
                          </TableCell>
                        )}
                        {colunasVisiveis.includes("qtdItens") && (
                          <TableCell className="text-right">{item.qtdItens}</TableCell>
                        )}
                        {colunasVisiveis.includes("qtdAvaliados") && (
                          <TableCell className="text-right">{item.qtdAvaliados}</TableCell>
                        )}
                        {colunasVisiveis.includes("percentAvaliado") && (
                          <TableCell className="text-right">{item.percentAvaliado}%</TableCell>
                        )}
                        {colunasVisiveis.includes("conformes") && (
                          <TableCell className="text-right">{item.conformes}</TableCell>
                        )}
                        {colunasVisiveis.includes("naoConformes") && (
                          <TableCell className="text-right">{item.naoConformes}</TableCell>
                        )}
                        {colunasVisiveis.includes("percentNaoConforme") && (
                          <TableCell className="text-right">{item.percentNaoConforme}%</TableCell>
                        )}
                        {colunasVisiveis.includes("naoSeAplica") && (
                          <TableCell className="text-right">{item.naoSeAplica}</TableCell>
                        )}
                        {colunasVisiveis.includes("percentConformidade") && (
                          <TableCell className="text-right">{item.percentConformidade}%</TableCell>
                        )}
                        {colunasVisiveis.includes("acoesRealizadas") && (
                          <TableCell className="text-right">{item.acoesRealizadas}</TableCell>
                        )}
                        {colunasVisiveis.includes("acoesNaoRealizadas") && (
                          <TableCell className="text-right">{item.acoesNaoRealizadas}</TableCell>
                        )}
                        {colunasVisiveis.includes("prioridade") && <TableCell>{item.prioridade}</TableCell>}
                        {colunasVisiveis.includes("acoes") && (
                          <TableCell>
                            {item.acoes && (
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        )}
                        {colunasVisiveis.includes("status") && (
                          <TableCell>
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                item.status === "Não realizado" && "bg-red-100 text-red-800",
                                item.status === "Em andamento" && "bg-yellow-100 text-yellow-800",
                                item.status === "Concluído" && "bg-green-100 text-green-800",
                              )}
                            >
                              {item.status}
                            </span>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Paginação */}
            {dadosFiltradosPorBusca.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2 border-t">
                <div className="text-sm text-gray-500">
                  Mostrando {dadosFiltradosPorBusca.length} de {dadosFiltradosPorBusca.length} registros
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="px-3">
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

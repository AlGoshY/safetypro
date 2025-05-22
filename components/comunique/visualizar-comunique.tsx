"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarIcon,
  Download,
  FileText,
  Search,
  Filter,
  BarChart2,
  List,
  Grid,
  Eye,
  RefreshCw,
  ChevronDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Megaphone,
  Building,
  MapPin,
  User,
  Tag,
} from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface Comunique {
  id: number
  data: Date
  nome: string
  descricao: string
  setor: string
  local: string
  tipo: string
  status: "Pendente" | "Em análise" | "Concluído" | "Cancelado"
  prioridade: "Baixa" | "Média" | "Alta" | "Crítica"
  responsavel: string
  regional: string
  unidade: string
}

// Dados de exemplo para demonstração
const mockComuniques: Comunique[] = [
  {
    id: 1001,
    data: new Date(2023, 4, 15),
    nome: "Vazamento de produto químico",
    descricao: "Pequeno vazamento de produto químico no laboratório de análises",
    setor: "Laboratório",
    local: "Sala 102",
    tipo: "Incidente Ambiental",
    status: "Concluído",
    prioridade: "Alta",
    responsavel: "Carlos Souza",
    regional: "Sul",
    unidade: "Matriz",
  },
  {
    id: 1002,
    data: new Date(2023, 4, 18),
    nome: "Falha no sistema de ventilação",
    descricao: "Sistema de ventilação apresentou falha durante o turno da tarde",
    setor: "Produção",
    local: "Galpão Principal",
    tipo: "Falha Operacional",
    status: "Em análise",
    prioridade: "Média",
    responsavel: "Ana Costa",
    regional: "Sul",
    unidade: "Matriz",
  },
  {
    id: 1003,
    data: new Date(2023, 4, 20),
    nome: "Quase acidente com empilhadeira",
    descricao: "Operador relatou quase acidente com empilhadeira próximo ao estoque",
    setor: "Logística",
    local: "Área de Estoque",
    tipo: "Quase Acidente",
    status: "Pendente",
    prioridade: "Alta",
    responsavel: "Pedro Oliveira",
    regional: "Norte",
    unidade: "Filial 1",
  },
  {
    id: 1004,
    data: new Date(2023, 4, 22),
    nome: "Falta de EPI no setor de produção",
    descricao: "Funcionários relataram falta de luvas de proteção no setor de produção",
    setor: "Produção",
    local: "Linha de Montagem 3",
    tipo: "Não Conformidade",
    status: "Pendente",
    prioridade: "Média",
    responsavel: "Maria Santos",
    regional: "Sul",
    unidade: "Matriz",
  },
  {
    id: 1005,
    data: new Date(2023, 4, 25),
    nome: "Problema na sinalização de emergência",
    descricao: "Placas de sinalização de emergência danificadas no corredor principal",
    setor: "Administrativo",
    local: "Corredor Principal",
    tipo: "Não Conformidade",
    status: "Pendente",
    prioridade: "Baixa",
    responsavel: "João Silva",
    regional: "Sul",
    unidade: "Matriz",
  },
]

// Componente de dropdown personalizado
interface CustomDropdownProps {
  options: string[]
  placeholder: string
  value: string
  onChange: (value: string) => void
  className?: string
}

function CustomDropdown({ options, placeholder, value, onChange, className = "" }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="border border-gray-300 rounded-md px-3 py-2 flex justify-between items-center cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function VisualizarComunique() {
  const [dataInicio, setDataInicio] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  )
  const [dataFim, setDataFim] = useState<Date | undefined>(new Date())
  const [filteredData, setFilteredData] = useState<Comunique[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [searchTerm, setSearchTerm] = useState("")
  const [showStats, setShowStats] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const { toast } = useToast()

  // Valores dos filtros
  const [regionalFilter, setRegionalFilter] = useState("")
  const [unidadeFilter, setUnidadeFilter] = useState("")
  const [setorFilter, setSetorFilter] = useState("")
  const [responsavelFilter, setResponsavelFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Opções para os selects
  const regionais = ["Sul", "Norte", "Leste", "Oeste", "Centro"]
  const unidades = ["Matriz", "Filial 1", "Filial 2", "Filial 3", "Filial 4"]
  const setores = ["Produção", "Administrativo", "Logística", "Comercial", "RH", "Laboratório"]
  const responsaveis = ["João Silva", "Maria Santos", "Pedro Oliveira", "Ana Costa", "Carlos Souza"]
  const statusOptions = ["Pendente", "Em análise", "Concluído", "Cancelado"]
  const tiposOcorrencia = [
    "Incidente Ambiental",
    "Falha Operacional",
    "Quase Acidente",
    "Acidente",
    "Sugestão",
    "Reclamação",
  ]
  const prioridades = ["Baixa", "Média", "Alta", "Crítica"]

  // Estatísticas
  const stats = {
    total: mockComuniques.length,
    pendentes: mockComuniques.filter((c) => c.status === "Pendente").length,
    emAnalise: mockComuniques.filter((c) => c.status === "Em análise").length,
    concluidos: mockComuniques.filter((c) => c.status === "Concluído").length,
    cancelados: mockComuniques.filter((c) => c.status === "Cancelado").length,
    altaPrioridade: mockComuniques.filter((c) => c.prioridade === "Alta" || c.prioridade === "Crítica").length,
  }

  useEffect(() => {
    // Simular carregamento inicial de dados
    setIsLoading(true)
    setTimeout(() => {
      // Inicializar com todos os dados mockados
      setFilteredData(mockComuniques)
      setIsLoading(false)
    }, 800)
  }, [])

  const handleConsultar = () => {
    setIsLoading(true)
    setSearchPerformed(true)

    // Simulando uma chamada à API
    setTimeout(() => {
      // Filtrando os dados mockados para demonstração
      let results = [...mockComuniques]

      // Aplicar filtro de busca se houver termo
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        results = results.filter(
          (item) =>
            item.nome.toLowerCase().includes(term) ||
            item.descricao.toLowerCase().includes(term) ||
            item.setor.toLowerCase().includes(term) ||
            item.local.toLowerCase().includes(term),
        )
      }

      // Aplicar filtro rápido se estiver ativo
      if (activeFilter) {
        switch (activeFilter) {
          case "pendentes":
            results = results.filter((item) => item.status === "Pendente")
            break
          case "emAnalise":
            results = results.filter((item) => item.status === "Em análise")
            break
          case "concluidos":
            results = results.filter((item) => item.status === "Concluído")
            break
          case "altaPrioridade":
            results = results.filter((item) => item.prioridade === "Alta" || item.prioridade === "Crítica")
            break
        }
      }

      // Aplicar filtros avançados
      if (regionalFilter) {
        results = results.filter((item) => item.regional === regionalFilter)
      }
      if (unidadeFilter) {
        results = results.filter((item) => item.unidade === unidadeFilter)
      }
      if (setorFilter) {
        results = results.filter((item) => item.setor === setorFilter)
      }
      if (responsavelFilter) {
        results = results.filter((item) => item.responsavel === responsavelFilter)
      }
      if (statusFilter) {
        results = results.filter((item) => item.status === statusFilter)
      }
      if (dataInicio) {
        results = results.filter((item) => item.data >= dataInicio)
      }
      if (dataFim) {
        results = results.filter((item) => item.data <= dataFim)
      }

      // Garantir que temos dados para exibir, mesmo que os filtros sejam muito restritivos
      if (results.length === 0 && searchPerformed) {
        // Se não encontrou resultados com os filtros, exibe todos os dados
        results = [...mockComuniques]

        toast({
          title: "Filtros muito restritivos",
          description: "Exibindo todos os registros disponíveis.",
          duration: 3000,
        })
      } else {
        toast({
          title: `${results.length} registros encontrados`,
          description: "A consulta foi realizada com sucesso.",
          duration: 3000,
        })
      }

      setFilteredData(results)
      setIsLoading(false)
    }, 800)
  }

  const handleExportarCSV = () => {
    toast({
      title: "Exportação iniciada",
      description: "O arquivo CSV está sendo gerado e será baixado em instantes.",
      duration: 3000,
    })
  }

  const handleExportarPDF = () => {
    toast({
      title: "Exportação iniciada",
      description: "O arquivo PDF está sendo gerado e será baixado em instantes.",
      duration: 3000,
    })
  }

  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      handleConsultar()
    }, 500)
  }

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          {[10, 15, 25].map((value) => (
            <button
              key={value}
              onClick={() => setItemsPerPage(value)}
              className={`px-3 py-1 rounded-full text-sm ${
                itemsPerPage === value ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {value}
            </button>
          ))}
          <button
            onClick={() => setItemsPerPage(filteredData.length || 10)}
            className={`px-3 py-1 rounded-full text-sm ${
              itemsPerPage === filteredData.length
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Página {currentPage} de {totalPages} ({filteredData.length} registros)
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-full border border-gray-300 disabled:opacity-50"
          >
            &lt;
          </button>
          <button className="p-1 px-3 rounded-full bg-blue-600 text-white">{currentPage}</button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-full border border-gray-300 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    )
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Concluído":
        return (
          <Badge variant="ativo" className="flex items-center gap-1">
            <CheckCircle2 size={12} /> {status}
          </Badge>
        )
      case "Cancelado":
        return (
          <Badge variant="inativo" className="flex items-center gap-1">
            <XCircle size={12} /> {status}
          </Badge>
        )
      case "Em análise":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock size={12} /> {status}
          </Badge>
        )
      default:
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <AlertTriangle size={12} /> {status}
          </Badge>
        )
    }
  }

  const renderPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case "Crítica":
        return <Badge className="bg-red-600">{prioridade}</Badge>
      case "Alta":
        return <Badge className="bg-orange-500">{prioridade}</Badge>
      case "Média":
        return <Badge className="bg-yellow-500">{prioridade}</Badge>
      default:
        return <Badge className="bg-green-500">{prioridade}</Badge>
    }
  }

  // Filtrar apenas os registros pendentes para a aba específica
  const pendentesData = mockComuniques.filter((item) => item.status === "Pendente")

  return (
    <div className="container mx-auto py-6">
      {/* Cabeçalho */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
            <Megaphone size={24} className="text-gray-700 dark:text-gray-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Visualizar Comunique</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Consulte e gerencie os registros de comunicações e ocorrências de segurança.
            </p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-3">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-xl font-semibold">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full mr-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pendentes</p>
              <p className="text-xl font-semibold">{stats.pendentes}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-3">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Em Análise</p>
              <p className="text-xl font-semibold">{stats.emAnalise}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Concluídos</p>
              <p className="text-xl font-semibold">{stats.concluidos}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-3">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cancelados</p>
              <p className="text-xl font-semibold">{stats.cancelados}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mr-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Alta Prioridade</p>
              <p className="text-xl font-semibold">{stats.altaPrioridade}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros Rápidos */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          className={`${activeFilter === "pendentes" ? "bg-yellow-50 border-yellow-200 text-yellow-700" : ""}`}
          onClick={() => handleFilterClick("pendentes")}
        >
          <AlertTriangle className="mr-1 h-4 w-4" />
          Pendentes
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={`${activeFilter === "emAnalise" ? "bg-purple-50 border-purple-200 text-purple-700" : ""}`}
          onClick={() => handleFilterClick("emAnalise")}
        >
          <Clock className="mr-1 h-4 w-4" />
          Em Análise
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={`${activeFilter === "concluidos" ? "bg-green-50 border-green-200 text-green-700" : ""}`}
          onClick={() => handleFilterClick("concluidos")}
        >
          <CheckCircle2 className="mr-1 h-4 w-4" />
          Concluídos
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={`${activeFilter === "altaPrioridade" ? "bg-orange-50 border-orange-200 text-orange-700" : ""}`}
          onClick={() => handleFilterClick("altaPrioridade")}
        >
          <AlertTriangle className="mr-1 h-4 w-4" />
          Alta Prioridade
        </Button>

        <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
          <Filter className="mr-1 h-4 w-4" />
          Filtros Avançados
          <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showAdvancedFilters ? "rotate-180" : ""}`} />
        </Button>

        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowStats(!showStats)}>
            <BarChart2 className="mr-1 h-4 w-4" />
            {showStats ? "Ocultar Estatísticas" : "Mostrar Estatísticas"}
          </Button>

          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}>
            {viewMode === "table" ? (
              <>
                <Grid className="mr-1 h-4 w-4" />
                Visualizar em Cards
              </>
            ) : (
              <>
                <List className="mr-1 h-4 w-4" />
                Visualizar em Tabela
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filtros Avançados */}
      {showAdvancedFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filtros Avançados</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRegionalFilter("")
                setUnidadeFilter("")
                setSetorFilter("")
                setResponsavelFilter("")
                setStatusFilter("")
                setDataInicio(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
                setDataFim(new Date())
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Limpar Filtros
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <CustomDropdown
              options={regionais}
              placeholder="Regional"
              value={regionalFilter}
              onChange={setRegionalFilter}
            />

            <CustomDropdown
              options={unidades}
              placeholder="Unidade"
              value={unidadeFilter}
              onChange={setUnidadeFilter}
            />

            <CustomDropdown options={setores} placeholder="Setor" value={setorFilter} onChange={setSetorFilter} />

            <CustomDropdown
              options={responsaveis}
              placeholder="Responsável"
              value={responsavelFilter}
              onChange={setResponsavelFilter}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <div className="text-xs text-gray-500 mb-1 text-center">Data Início</div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={dataInicio ? format(dataInicio, "dd/MM/yyyy") : ""}
                  className="pl-3 pr-10"
                  readOnly
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1 text-center">Data Fim</div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={dataFim ? format(dataFim, "dd/MM/yyyy") : ""}
                  className="pl-3 pr-10"
                  readOnly
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dataFim} onSelect={setDataFim} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <CustomDropdown
              options={statusOptions}
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleConsultar} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⊚</span>
                  Consultando...
                </>
              ) : (
                "CONSULTAR"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Barra de Ferramentas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-end items-center gap-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExportarCSV}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportarPDF}>
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar..."
                className="pl-8 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConsultar()}
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Visualização em Abas */}
        <Tabs defaultValue="todos" className="w-full">
          <div className="px-4 pt-2 border-b border-gray-200 dark:border-gray-700">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="todos"
                className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
              >
                Todos
              </TabsTrigger>
              <TabsTrigger
                value="pendentes"
                className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
              >
                Pendentes
              </TabsTrigger>
              <TabsTrigger
                value="emAnalise"
                className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
              >
                Em Análise
              </TabsTrigger>
              <TabsTrigger
                value="concluidos"
                className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
              >
                Concluídos
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Conteúdo das Abas */}
          <TabsContent value="todos" className="m-0">
            {viewMode === "table" ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Nº
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Data
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Nome
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Descrição da Ocorrência
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Setor
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Local da Ocorrência
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Tipo da Ocorrência
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Prioridade
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-16 text-center">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                            <span className="ml-3 text-gray-500 dark:text-gray-400">Carregando...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredData.length > 0 ? (
                      filteredData
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((comunique) => (
                          <tr key={comunique.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {comunique.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {format(comunique.data, "dd/MM/yyyy")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {comunique.nome}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                              {comunique.descricao}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {comunique.setor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {comunique.local}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {comunique.tipo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{renderStatusBadge(comunique.status)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderPrioridadeBadge(comunique.prioridade)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                  <Eye size={16} />
                                </button>
                                <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                                  <CheckCircle2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="px-6 py-16 text-center text-sm text-gray-500 dark:text-gray-400">
                          Nenhum registro encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  <div className="col-span-full flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    <span className="ml-3 text-gray-500 dark:text-gray-400">Carregando...</span>
                  </div>
                ) : filteredData.length > 0 ? (
                  filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((comunique) => (
                    <div
                      key={comunique.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-900 dark:text-white">#{comunique.id}</span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            {format(comunique.data, "dd/MM/yyyy")}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {renderStatusBadge(comunique.status)}
                          {renderPrioridadeBadge(comunique.prioridade)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">{comunique.nome}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {comunique.descricao}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Building className="h-4 w-4 mr-1" />
                            <span>{comunique.setor}</span>
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{comunique.local}</span>
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Tag className="h-4 w-4 mr-1" />
                            <span>{comunique.tipo}</span>
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <User className="h-4 w-4 mr-1" />
                            <span>{comunique.responsavel}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Visualizar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Concluir
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mb-4 opacity-20" />
                    {searchPerformed ? "Nenhum registro encontrado" : "Utilize os filtros acima para consultar"}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pendentes" className="m-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Nº
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Data
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Descrição
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Setor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Prioridade
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {pendentesData.length > 0 ? (
                    pendentesData.map((comunique) => (
                      <tr key={comunique.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {comunique.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {format(comunique.data, "dd/MM/yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {comunique.nome}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {comunique.descricao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {comunique.setor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{renderPrioridadeBadge(comunique.prioridade)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                              <Eye size={16} />
                            </button>
                            <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                              <CheckCircle2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-sm text-gray-500 dark:text-gray-400">
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="emAnalise" className="m-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Nº
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Data
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Descrição
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Setor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Prioridade
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {mockComuniques.filter((item) => item.status === "Em análise").length > 0 ? (
                    mockComuniques
                      .filter((item) => item.status === "Em análise")
                      .map((comunique) => (
                        <tr key={comunique.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {comunique.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {format(comunique.data, "dd/MM/yyyy")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {comunique.nome}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                            {comunique.descricao}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {comunique.setor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{renderPrioridadeBadge(comunique.prioridade)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                <Eye size={16} />
                              </button>
                              <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                                <CheckCircle2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-sm text-gray-500 dark:text-gray-400">
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="concluidos" className="m-0">
            <div className="p-16 text-center text-gray-500 dark:text-gray-400">
              Conteúdo filtrado por status "Concluído"
            </div>
          </TabsContent>
        </Tabs>

        {renderPagination()}
      </div>
    </div>
  )
}

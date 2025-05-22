"use client"

import { useState, useEffect } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  HeartPulse,
  FileCheck,
  ChevronRight,
  ChevronDown,
  Filter,
  Eye,
  Megaphone,
  ClipboardList,
  Search,
  Download,
  MoreHorizontal,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Clock3,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const chartData = [
  { name: "Jan", meta: 100, realizado: 65, atrasado: 35 },
  { name: "Fev", meta: 100, realizado: 70, atrasado: 30 },
  { name: "Mar", meta: 100, realizado: 68, atrasado: 32 },
  { name: "Abr", meta: 100, realizado: 76, atrasado: 24 },
  { name: "Mai", meta: 100, realizado: 82, atrasado: 18 },
  { name: "Jun", meta: 100, realizado: 85, atrasado: 15 },
]

const trendData = [
  { name: "Jan", inspecoes: 42, acoes: 28 },
  { name: "Fev", inspecoes: 38, acoes: 32 },
  { name: "Mar", inspecoes: 45, acoes: 35 },
  { name: "Abr", inspecoes: 52, acoes: 40 },
  { name: "Mai", inspecoes: 48, acoes: 38 },
  { name: "Jun", inspecoes: 55, acoes: 42 },
]

const inspecoesPorTipo = [
  { name: "Comportamental", value: 35 },
  { name: "Sistêmica", value: 25 },
  { name: "Equipamentos", value: 20 },
  { name: "Processos", value: 15 },
  { name: "Ambiental", value: 5 },
]

const inspecoesData = [
  {
    id: "INS-2023-001",
    tipo: "Comportamental",
    local: "Setor de Produção",
    responsavel: "Carlos Silva",
    data: "10/05/2023",
    status: "Concluída",
    prioridade: "Alta",
  },
  {
    id: "INS-2023-002",
    tipo: "Sistêmica",
    local: "Área Administrativa",
    responsavel: "Ana Oliveira",
    data: "15/05/2023",
    status: "Em andamento",
    prioridade: "Média",
  },
  {
    id: "INS-2023-003",
    tipo: "Equipamentos",
    local: "Manutenção",
    responsavel: "Roberto Santos",
    data: "18/05/2023",
    status: "Pendente",
    prioridade: "Alta",
  },
  {
    id: "INS-2023-004",
    tipo: "Processos",
    local: "Linha de Montagem",
    responsavel: "Mariana Costa",
    data: "20/05/2023",
    status: "Concluída",
    prioridade: "Baixa",
  },
  {
    id: "INS-2023-005",
    tipo: "Ambiental",
    local: "Área Externa",
    responsavel: "Pedro Almeida",
    data: "22/05/2023",
    status: "Em andamento",
    prioridade: "Média",
  },
  {
    id: "INS-2023-006",
    tipo: "Comportamental",
    local: "Refeitório",
    responsavel: "Juliana Ferreira",
    data: "25/05/2023",
    status: "Pendente",
    prioridade: "Baixa",
  },
  {
    id: "INS-2023-007",
    tipo: "Sistêmica",
    local: "Almoxarifado",
    responsavel: "Fernando Gomes",
    data: "28/05/2023",
    status: "Concluída",
    prioridade: "Alta",
  },
  {
    id: "INS-2023-008",
    tipo: "Equipamentos",
    local: "Setor Elétrico",
    responsavel: "Luciana Martins",
    data: "30/05/2023",
    status: "Em andamento",
    prioridade: "Alta",
  },
]

const acoesPorTipo = [
  { name: "Corretiva", value: 45 },
  { name: "Preventiva", value: 30 },
  { name: "Melhoria", value: 15 },
  { name: "Emergencial", value: 10 },
]

const acoesData = [
  {
    id: "AC-2023-001",
    titulo: "Correção de Vazamento Hidráulico",
    tipo: "Corretiva",
    setor: "Manutenção",
    responsavel: "Carlos Silva",
    prazo: "15/05/2023",
    status: "Concluída",
    prioridade: "Alta",
    progresso: 100,
  },
  {
    id: "AC-2023-002",
    titulo: "Instalação de Proteções em Máquinas",
    tipo: "Preventiva",
    setor: "Produção",
    responsavel: "Ana Oliveira",
    prazo: "20/05/2023",
    status: "Em andamento",
    prioridade: "Média",
    progresso: 65,
  },
  {
    id: "AC-2023-003",
    titulo: "Treinamento de Segurança",
    tipo: "Melhoria",
    setor: "RH",
    responsavel: "Roberto Santos",
    prazo: "25/05/2023",
    status: "Em andamento",
    prioridade: "Baixa",
    progresso: 30,
  },
  {
    id: "AC-2023-004",
    titulo: "Contenção de Risco Elétrico",
    tipo: "Emergencial",
    setor: "Elétrica",
    responsavel: "Mariana Costa",
    prazo: "10/05/2023",
    status: "Concluída",
    prioridade: "Alta",
    progresso: 100,
  },
  {
    id: "AC-2023-005",
    titulo: "Manutenção Preventiva de Equipamentos",
    tipo: "Preventiva",
    setor: "Operações",
    responsavel: "Pedro Almeida",
    prazo: "30/05/2023",
    status: "Não iniciada",
    prioridade: "Média",
    progresso: 0,
  },
  {
    id: "AC-2023-006",
    titulo: "Revisão de Procedimentos de Emergência",
    tipo: "Melhoria",
    setor: "Segurança",
    responsavel: "Juliana Ferreira",
    prazo: "05/06/2023",
    status: "Não iniciada",
    prioridade: "Média",
    progresso: 0,
  },
  {
    id: "AC-2023-007",
    titulo: "Reparo em Sistema de Ventilação",
    tipo: "Corretiva",
    setor: "Manutenção",
    responsavel: "Fernando Gomes",
    prazo: "12/05/2023",
    status: "Atrasada",
    prioridade: "Alta",
    progresso: 45,
  },
  {
    id: "AC-2023-008",
    titulo: "Substituição de EPIs Danificados",
    tipo: "Corretiva",
    setor: "Almoxarifado",
    responsavel: "Luciana Martins",
    prazo: "18/05/2023",
    status: "Concluída",
    prioridade: "Alta",
    progresso: 100,
  },
]

const auditoriasPorTipo = [
  { name: "Comportamental", value: 40 },
  { name: "Conformidade", value: 25 },
  { name: "Processos", value: 20 },
  { name: "Sistemas", value: 15 },
]

const auditoriasData = [
  {
    id: "AUD-2023-001",
    titulo: "Auditoria Comportamental - Setor Produção",
    tipo: "Comportamental",
    setor: "Produção",
    auditor: "Carlos Silva",
    dataInicio: "10/05/2023",
    dataFim: "12/05/2023",
    status: "Concluída",
    resultado: "Conforme",
    pontuacao: 92,
  },
  {
    id: "AUD-2023-002",
    titulo: "Auditoria de Conformidade - Normas Regulamentadoras",
    tipo: "Conformidade",
    setor: "Administrativo",
    auditor: "Ana Oliveira",
    dataInicio: "15/05/2023",
    dataFim: "18/05/2023",
    status: "Concluída",
    resultado: "Não Conforme",
    pontuacao: 68,
  },
  {
    id: "AUD-2023-003",
    titulo: "Auditoria de Processos - Linha de Montagem",
    tipo: "Processos",
    setor: "Montagem",
    auditor: "Roberto Santos",
    dataInicio: "20/05/2023",
    dataFim: "22/05/2023",
    status: "Em andamento",
    resultado: "Pendente",
    pontuacao: null,
  },
  {
    id: "AUD-2023-004",
    titulo: "Auditoria de Sistemas - Controle de Acesso",
    tipo: "Sistemas",
    setor: "TI",
    auditor: "Mariana Costa",
    dataInicio: "25/05/2023",
    dataFim: "27/05/2023",
    status: "Programada",
    resultado: "Pendente",
    pontuacao: null,
  },
  {
    id: "AUD-2023-005",
    titulo: "Auditoria Comportamental - Setor Manutenção",
    tipo: "Comportamental",
    setor: "Manutenção",
    auditor: "Pedro Almeida",
    dataInicio: "01/06/2023",
    dataFim: "03/06/2023",
    status: "Programada",
    resultado: "Pendente",
    pontuacao: null,
  },
  {
    id: "AUD-2023-006",
    titulo: "Auditoria de Conformidade - EPIs",
    tipo: "Conformidade",
    setor: "Operacional",
    auditor: "Juliana Ferreira",
    dataInicio: "05/06/2023",
    dataFim: "07/06/2023",
    status: "Programada",
    resultado: "Pendente",
    pontuacao: null,
  },
  {
    id: "AUD-2023-007",
    titulo: "Auditoria de Processos - Logística",
    tipo: "Processos",
    setor: "Logística",
    auditor: "Fernando Gomes",
    dataInicio: "08/05/2023",
    dataFim: "10/05/2023",
    status: "Concluída",
    resultado: "Conforme",
    pontuacao: 95,
  },
  {
    id: "AUD-2023-008",
    titulo: "Auditoria de Sistemas - Backup",
    tipo: "Sistemas",
    setor: "TI",
    auditor: "Luciana Martins",
    dataInicio: "12/05/2023",
    dataFim: "14/05/2023",
    status: "Concluída",
    resultado: "Parcialmente Conforme",
    pontuacao: 78,
  },
]

const exportToExcel = (data, fileName) => {
  // Converter os dados para formato CSV
  let csvContent = "data:text/csv;charset=utf-8,"

  // Adicionar cabeçalhos
  if (data.length > 0) {
    const headers = Object.keys(data[0])
    csvContent += headers.join(",") + "\n"

    // Adicionar linhas de dados
    data.forEach((item) => {
      const row = headers
        .map((header) => {
          // Escapar vírgulas e aspas nos valores
          let cell = item[header] === null || item[header] === undefined ? "" : item[header].toString()
          cell = cell.replace(/"/g, '""')
          if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
            cell = `"${cell}"`
          }
          return cell
        })
        .join(",")
      csvContent += row + "\n"
    })
  }

  // Criar um link para download e clicar nele
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `${fileName}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
        <p className="font-medium text-sm mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
        <p className="font-medium text-sm">{payload[0].name}</p>
        <p className="text-sm font-semibold" style={{ color: payload[0].color }}>
          {payload[0].value} inspeções ({Math.round((payload[0].value / 100) * 100)}%)
        </p>
      </div>
    )
  }
  return null
}

function Bell(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export default function Dashboard() {
  const { toast } = useToast()
  const [showAITip, setShowAITip] = useState(false)

  // Mostrar dica do assistente após 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAITip(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Fechar dica do assistente
  const dismissTip = () => {
    setShowAITip(false)
  }

  // Abrir assistente (simulação)
  const openAssistant = () => {
    dismissTip()
    toast({
      title: "Assistente ativado",
      description: "O assistente virtual está pronto para ajudar você.",
    })
  }

  const [activeTab, setActiveTab] = useState("geral")
  const [showAllActivities, setShowAllActivities] = useState(false)
  const [showAllActions, setShowAllActions] = useState(false)
  const [inspecoesFilter, setInspecoesFilter] = useState("todas")
  const [searchTerm, setSearchTerm] = useState("")
  const [acoesFilter, setAcoesFilter] = useState("todas")
  const [acoesSearchTerm, setAcoesSearchTerm] = useState("")

  const [auditoriasFilter, setAuditoriasFilter] = useState("todas")
  const [auditoriasSearchTerm, setAuditoriasSearchTerm] = useState("")

  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    periodo: "30dias",
    prioridade: "todas",
    setor: "todos",
    responsavel: "todos",
  })

  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [detailsType, setDetailsType] = useState("")
  const [detailsData, setDetailsData] = useState([])
  const [detailsTitle, setDetailsTitle] = useState("")

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const toggleActivitiesView = () => {
    setShowAllActivities((prev) => !prev)
  }

  const toggleActionsView = () => {
    setShowAllActions((prev) => !prev)
  }

  const handleInspecoesFilterChange = (filter) => {
    setInspecoesFilter(filter)
  }

  const handleAcoesFilterChange = (filter) => {
    setAcoesFilter(filter)
  }

  const handleAuditoriasFilterChange = (filter) => {
    setAuditoriasFilter(filter)
  }

  const toggleFiltersModal = () => {
    setShowFiltersModal((prev) => !prev)
  }

  const handleFilterChange = (filterType, value) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const applyFilters = () => {
    // Aqui aplicaríamos os filtros aos dados
    // Por enquanto apenas fechamos o modal
    setShowFiltersModal(false)

    // Feedback visual para o usuário
    alert("Filtros aplicados com sucesso!")
  }

  const filteredInspecoes = inspecoesData.filter((inspecao) => {
    if (inspecoesFilter !== "todas" && inspecao.status.toLowerCase() !== inspecoesFilter) {
      return false
    }

    if (searchTerm) {
      return (
        inspecao.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspecao.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspecao.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspecao.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return true
  })

  const filteredAcoes = acoesData.filter((acao) => {
    if (acoesFilter !== "todas" && acao.status.toLowerCase().replace(" ", "-") !== acoesFilter) {
      return false
    }

    if (acoesSearchTerm) {
      return (
        acao.id.toLowerCase().includes(acoesSearchTerm.toLowerCase()) ||
        acao.titulo.toLowerCase().includes(acoesSearchTerm.toLowerCase()) ||
        acao.tipo.toLowerCase().includes(acoesSearchTerm.toLowerCase()) ||
        acao.setor.toLowerCase().includes(acoesSearchTerm.toLowerCase()) ||
        acao.responsavel.toLowerCase().includes(acoesSearchTerm.toLowerCase())
      )
    }

    return true
  })

  const filteredAuditorias = auditoriasData.filter((auditoria) => {
    if (auditoriasFilter !== "todas" && auditoria.status.toLowerCase().replace(" ", "-") !== auditoriasFilter) {
      return false
    }

    if (auditoriasSearchTerm) {
      return (
        auditoria.id.toLowerCase().includes(auditoriasSearchTerm.toLowerCase()) ||
        auditoria.titulo.toLowerCase().includes(auditoriasSearchTerm.toLowerCase()) ||
        auditoria.tipo.toLowerCase().includes(auditoriasSearchTerm.toLowerCase()) ||
        auditoria.setor.toLowerCase().includes(auditoriasSearchTerm.toLowerCase()) ||
        auditoria.auditor.toLowerCase().includes(auditoriasSearchTerm.toLowerCase())
      )
    }

    return true
  })

  const allActivities = [
    {
      title: "Inspeção Sistêmica - Setor A",
      date: "Hoje, 14:00",
      status: "Pendente",
      icon: ShieldCheck,
      color: "yellow",
    },
    {
      title: "Reunião de Segurança",
      date: "Amanhã, 09:30",
      status: "Agendada",
      icon: Users,
      color: "blue",
    },
    {
      title: "Auditoria Comportamental",
      date: "12/05, 10:00",
      status: "Agendada",
      icon: FileCheck,
      color: "blue",
    },
    {
      title: "Visita Técnica - Empresa XYZ",
      date: "15/05, 08:00",
      status: "Confirmada",
      icon: Eye,
      color: "green",
    },
    {
      title: "Treinamento de Segurança",
      date: "18/05, 13:30",
      status: "Agendada",
      icon: Users,
      color: "blue",
    },
    {
      title: "Inspeção de Equipamentos",
      date: "20/05, 09:00",
      status: "Pendente",
      icon: ShieldCheck,
      color: "yellow",
    },
    {
      title: "Reunião com Fornecedores",
      date: "22/05, 11:00",
      status: "Agendada",
      icon: Users,
      color: "blue",
    },
    {
      title: "Auditoria de Processos",
      date: "25/05, 14:00",
      status: "Agendada",
      icon: FileCheck,
      color: "blue",
    },
  ]

  const allActions = [
    {
      title: "Relatório de Inspeção #2458",
      user: "Carlos Silva",
      time: "2 horas atrás",
      type: "Emitido",
      icon: FileText,
      color: "blue",
    },
    {
      title: "Comunique #187 - Risco Elétrico",
      user: "Ana Oliveira",
      time: "5 horas atrás",
      type: "Criado",
      icon: Megaphone,
      color: "green",
    },
    {
      title: "Auditoria #92 - Setor Produção",
      user: "Roberto Santos",
      time: "1 dia atrás",
      type: "Atualizado",
      icon: ClipboardList,
      color: "purple",
    },
    {
      title: "Ação Corretiva #345",
      user: "Mariana Costa",
      time: "2 dias atrás",
      type: "Concluída",
      icon: CheckCircle2,
      color: "teal",
    },
    {
      title: "Relatório de Segurança #189",
      user: "Pedro Almeida",
      time: "3 dias atrás",
      type: "Emitido",
      icon: FileText,
      color: "blue",
    },
    {
      title: "Comunique #156 - Risco de Queda",
      user: "Juliana Ferreira",
      time: "4 dias atrás",
      type: "Criado",
      icon: Megaphone,
      color: "green",
    },
    {
      title: "Inspeção #78 - Área Externa",
      user: "Fernando Gomes",
      time: "5 dias atrás",
      type: "Finalizado",
      icon: Eye,
      color: "indigo",
    },
    {
      title: "Treinamento #42 - Primeiros Socorros",
      user: "Luciana Martins",
      time: "1 semana atrás",
      type: "Concluído",
      icon: Users,
      color: "teal",
    },
  ]

  const handleExport = () => {
    let dataToExport = []
    let fileName = "dashboard-export"

    if (activeTab === "inspecoes") {
      dataToExport = inspecoesData
      fileName = "inspecoes-export"
    } else if (activeTab === "acoes") {
      dataToExport = acoesData
      fileName = "acoes-export"
    } else if (activeTab === "auditorias") {
      dataToExport = auditoriasData
      fileName = "auditorias-export"
    } else {
      // Exportar dados gerais
      dataToExport = [
        { categoria: "Inspeções em Aberto", valor: 12, meta: 15, progresso: "80%" },
        { categoria: "Ações Críticas", valor: 5, prazoMedio: "3 dias restantes" },
        { categoria: "Relatórios Emitidos", valor: 30, meta: 35, progresso: "85%" },
        { categoria: "Auditorias Concluídas", valor: 15, meta: 45, progresso: "33%" },
      ]
      fileName = "dashboard-geral-export"
    }

    exportToExcel(dataToExport, fileName)

    // Feedback visual para o usuário
    alert(`Exportação de ${fileName} iniciada. O download começará em instantes.`)
  }

  const handleCardClick = (type) => {
    let data = []
    let title = ""

    switch (type) {
      // Cards da aba Visão Geral
      case "inspecoes":
        data = inspecoesData.filter((item) => item.status === "Em andamento" || item.status === "Pendente")
        title = "Inspeções em Aberto"
        break
      case "acoes-criticas":
        data = acoesData.filter((item) => item.prioridade === "Alta")
        title = "Ações Críticas"
        break
      case "relatorios":
        data = [...inspecoesData, ...acoesData, ...auditoriasData].slice(0, 30)
        title = "Relatórios Emitidos"
        break
      case "auditorias":
        data = auditoriasData.filter((item) => item.status === "Concluída")
        title = "Auditorias Concluídas"
        break

      // Cards da aba Inspeções
      case "inspecoes-total":
        data = inspecoesData
        title = "Total de Inspeções"
        break
      case "inspecoes-concluidas":
        data = inspecoesData.filter((item) => item.status === "Concluída")
        title = "Inspeções Concluídas"
        break
      case "inspecoes-andamento":
        data = inspecoesData.filter((item) => item.status === "Em andamento")
        title = "Inspeções em Andamento"
        break
      case "inspecoes-pendentes":
        data = inspecoesData.filter((item) => item.status === "Pendente")
        title = "Inspeções Pendentes"
        break

      // Cards da aba Ações
      case "acoes-total":
        data = acoesData
        title = "Total de Ações"
        setDetailsType("acoes")
        setDetailsData(data)
        setDetailsTitle(title)
        setShowDetailsModal(true)
        return
      case "acoes-concluidas":
        data = acoesData.filter((item) => item.status === "Concluída")
        title = "Ações Concluídas"
        break
      case "acoes-andamento":
        data = acoesData.filter((item) => item.status === "Em andamento")
        title = "Ações em Andamento"
        break
      case "acoes-atrasadas":
        data = acoesData.filter((item) => item.status === "Atrasada")
        title = "Ações Atrasadas"
        break

      // Cards da aba Auditorias
      case "auditorias-total":
        data = auditoriasData
        title = "Total de Auditorias"
        break
      case "auditorias-concluidas":
        data = auditoriasData.filter((item) => item.status === "Concluída")
        title = "Auditorias Concluídas"
        break
      case "auditorias-andamento":
        data = auditoriasData.filter((item) => item.status === "Em andamento")
        title = "Auditorias em Andamento"
        break
      case "auditorias-programadas":
        data = auditoriasData.filter((item) => item.status === "Programada")
        title = "Auditorias Programadas"
        break

      default:
        data = []
    }

    setDetailsType(type.split("-")[0])
    setDetailsData(data)
    setDetailsTitle(title)
    setShowDetailsModal(true)
  }

  return (
    <div className="w-full h-full p-0 m-0">
      {/* Page header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
          <p className="text-gray-500 mt-1">Acompanhe os principais indicadores de segurança</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Últimos 30 dias</option>
              <option>Últimos 60 dias</option>
              <option>Últimos 90 dias</option>
              <option>Este ano</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <button
            onClick={toggleFiltersModal}
            className="flex items-center gap-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Filter size={16} />
            <span>Filtros</span>
          </button>
          <button
            onClick={handleExport}
            className="bg-[#0f2167] text-white rounded-md px-4 py-2 text-sm hover:bg-[#1e3a8a] transition-colors flex items-center gap-1"
          >
            <Download size={16} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-6">
          <button
            onClick={() => handleTabClick("geral")}
            className={`py-3 px-1 text-sm font-medium border-b-2 ${
              activeTab === "geral"
                ? "border-[#0f2167] text-[#0f2167]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => handleTabClick("inspecoes")}
            className={`py-3 px-1 text-sm font-medium border-b-2 ${
              activeTab === "inspecoes"
                ? "border-[#0f2167] text-[#0f2167]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Inspeções
          </button>
          <button
            onClick={() => handleTabClick("acoes")}
            className={`py-3 px-1 text-sm font-medium border-b-2 ${
              activeTab === "acoes"
                ? "border-[#0f2167] text-[#0f2167]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Ações
          </button>
          <button
            onClick={() => handleTabClick("auditorias")}
            className={`py-3 px-1 text-sm font-medium border-b-2 ${
              activeTab === "auditorias"
                ? "border-[#0f2167] text-[#0f2167]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Auditorias
          </button>
        </div>
      </div>

      {/* Conteúdo das abas */}
      {activeTab === "geral" && (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("inspecoes")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Inspeções em Aberto</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">12</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-green-600">
                    <ArrowUpRight size={14} className="mr-1" />
                    <span>8% desde o mês passado</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <HeartPulse size={22} className="text-blue-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Meta: 15</span>
                  <span className="text-green-600 font-medium">80% concluído</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("acoes-criticas")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Ações Críticas</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">5</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-red-600">
                    <ArrowDownRight size={14} className="mr-1" />
                    <span>2 desde a semana passada</span>
                  </div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <AlertTriangle size={22} className="text-red-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Prazo médio</span>
                  <span className="text-red-600 font-medium">3 dias restantes</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                  <div className="bg-red-600 h-1.5 rounded-full" style={{ width: "30%" }}></div>
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("relatorios")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Relatórios Emitidos</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">30</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-green-600">
                    <ArrowUpRight size={14} className="mr-1" />
                    <span>12 este mês</span>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <FileCheck size={22} className="text-green-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Meta mensal: 35</span>
                  <span className="text-green-600 font-medium">85% concluído</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("auditorias")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Auditorias Concluídas</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">15</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-teal-600">
                    <Clock size={14} className="mr-1" />
                    <span>100% no prazo</span>
                  </div>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg">
                  <CheckCircle2 size={22} className="text-teal-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Meta trimestral: 45</span>
                  <span className="text-teal-600 font-medium">33% concluído</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                  <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: "33%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-2">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Progresso de Metas</h3>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Mensal
                  </span>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="realizado" name="Realizado" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="atrasado" name="Atrasado" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-4 space-x-8">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Realizado</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Atrasado</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Resumo de Atividades</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">Inspeções Realizadas</span>
                    <span className="text-sm font-semibold">76%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "76%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">Ações Concluídas</span>
                    <span className="text-sm font-semibold">62%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "62%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">Auditorias Pendentes</span>
                    <span className="text-sm font-semibold">35%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">Comuniques Ativos</span>
                    <span className="text-sm font-semibold">88%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "88%" }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Tendência Mensal</h4>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="inspecoes" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="acoes" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Activity and Recent Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Próximas Atividades</h3>
                <button
                  onClick={toggleActivitiesView}
                  className="text-sm text-[#0f2167] hover:text-[#1e3a8a] font-medium flex items-center"
                >
                  {showAllActivities ? "Ver menos" : "Ver todas"}
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {(showAllActivities ? allActivities : allActivities.slice(0, 4)).map((activity, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`mr-4 p-2 rounded-lg bg-${activity.color}-50`}>
                      <activity.icon size={18} className={`text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{activity.title}</h4>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        activity.status === "Pendente"
                          ? "bg-yellow-100 text-yellow-800"
                          : activity.status === "Agendada"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Ações Recentes</h3>
                <button
                  onClick={toggleActionsView}
                  className="text-sm text-[#0f2167] hover:text-[#1e3a8a] font-medium flex items-center"
                >
                  {showAllActions ? "Ver menos" : "Ver todas"}
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {(showAllActions ? allActions : allActions.slice(0, 4)).map((action, index) => (
                  <div key={index} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`mt-1 mr-4 p-2 rounded-lg bg-${action.color}-50`}>
                      <action.icon size={18} className={`text-${action.color}-600`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{action.title}</h4>
                      <p className="text-sm text-gray-500">
                        {action.user} • {action.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "inspecoes" && (
        <div className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("inspecoes-total")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total de Inspeções</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">128</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-green-600">
                    <ArrowUpRight size={14} className="mr-1" />
                    <span>12% desde o mês passado</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <ClipboardList size={22} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("inspecoes-concluidas")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Concluídas</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">85</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-green-600">
                    <ArrowUpRight size={14} className="mr-1" />
                    <span>66% do total</span>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <CheckCircle size={22} className="text-green-600" />
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("inspecoes-andamento")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Em Andamento</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">32</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-blue-600">
                    <Clock3 size={14} className="mr-1" />
                    <span>25% do total</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Clock3 size={22} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("inspecoes-pendentes")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pendentes</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">11</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-yellow-600">
                    <XCircle size={14} className="mr-1" />
                    <span>9% do total</span>
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <AlertTriangle size={22} className="text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-800">Inspeções</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleInspecoesFilterChange("todas")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      inspecoesFilter === "todas"
                        ? "bg-[#0f2167] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => handleInspecoesFilterChange("concluída")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      inspecoesFilter === "concluída"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Concluídas
                  </button>
                  <button
                    onClick={() => handleInspecoesFilterChange("em andamento")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      inspecoesFilter === "em andamento"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Em Andamento
                  </button>
                  <button
                    onClick={() => handleInspecoesFilterChange("pendente")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      inspecoesFilter === "pendente"
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Pendentes
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar inspeção..."
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico e Tabela */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Inspeções por Tipo</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={inspecoesPorTipo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {inspecoesPorTipo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total de Inspeções</span>
                  <span className="text-sm font-semibold">100</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Lista de Inspeções</h3>
                <div className="flex items-center gap-2">
                  <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Calendário</span>
                  </button>
                  <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <Download size={16} />
                    <span>Exportar</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          ID
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Tipo
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Local
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Responsável
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Data
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Status
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Prioridade
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInspecoes.map((inspecao, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inspecao.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inspecao.tipo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inspecao.local}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inspecao.responsavel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inspecao.data}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              inspecao.status === "Concluída"
                                ? "bg-green-100 text-green-800"
                                : inspecao.status === "Em andamento"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {inspecao.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              inspecao.prioridade === "Alta"
                                ? "bg-red-100 text-red-800"
                                : inspecao.prioridade === "Média"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {inspecao.prioridade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-[#0f2167] hover:text-[#1e3a8a]">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredInspecoes.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma inspeção encontrada com os filtros atuais.</p>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Mostrando <span className="font-medium">{filteredInspecoes.length}</span> de{" "}
                  <span className="font-medium">{inspecoesData.length}</span> inspeções
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="px-3 py-1 bg-[#0f2167] text-white rounded-md text-sm hover:bg-[#1e3a8a]">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "acoes" && (
        <div className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("acoes-total")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total de Ações</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">96</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-green-600">
                    <ArrowUpRight size={14} className="mr-1" />
                    <span>15% desde o mês passado</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <ClipboardList size={22} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("acoes-concluidas")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Concluídas</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">58</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-green-600">
                    <ArrowUpRight size={14} className="mr-1" />
                    <span>60% do total</span>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <CheckCircle size={22} className="text-green-600" />
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("acoes-andamento")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Em Andamento</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">28</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-blue-600">
                    <Clock3 size={14} className="mr-1" />
                    <span>29% do total</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Clock3 size={22} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("acoes-atrasadas")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Atrasadas</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">10</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-red-600">
                    <XCircle size={14} className="mr-1" />
                    <span>11% do total</span>
                  </div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <AlertTriangle size={22} className="text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-800">Ações</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcoesFilterChange("todas")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      acoesFilter === "todas"
                        ? "bg-[#0f2167] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => handleAcoesFilterChange("concluída")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      acoesFilter === "concluída"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Concluídas
                  </button>
                  <button
                    onClick={() => handleAcoesFilterChange("em-andamento")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      acoesFilter === "em-andamento"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Em Andamento
                  </button>
                  <button
                    onClick={() => handleAcoesFilterChange("atrasada")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      acoesFilter === "atrasada"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Atrasadas
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar ação..."
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={acoesSearchTerm}
                    onChange={(e) => setAcoesSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico e Tabela */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações por Tipo</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={acoesPorTipo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {acoesPorTipo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total de Ações</span>
                  <span className="text-sm font-semibold">100</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Lista de Ações</h3>
                <div className="flex items-center gap-2">
                  <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Calendário</span>
                  </button>
                  <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <Download size={16} />
                    <span>Exportar</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          ID
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Título
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Tipo
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Responsável
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Prazo
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Status
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Progresso
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAcoes.map((acao, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{acao.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.titulo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.tipo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.responsavel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.prazo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              acao.status === "Concluída"
                                ? "bg-green-100 text-green-800"
                                : acao.status === "Em andamento"
                                  ? "bg-blue-100 text-blue-800"
                                  : acao.status === "Atrasada"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {acao.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className={`h-2.5 rounded-full ${
                                  acao.status === "Concluída"
                                    ? "bg-green-500"
                                    : acao.status === "Atrasada"
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                                }`}
                                style={{ width: `${acao.progresso}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{acao.progresso}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-[#0f2167] hover:text-[#1e3a8a]">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredAcoes.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma ação encontrada com os filtros atuais.</p>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Mostrando <span className="font-medium">{filteredAcoes.length}</span> de{" "}
                  <span className="font-medium">{acoesData.length}</span> ações
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="px-3 py-1 bg-[#0f2167] text-white rounded-md text-sm hover:bg-[#1e3a8a]">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "auditorias" && (
        <div className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("auditorias-total")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total de Auditorias</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">48</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-green-600">
                    <ArrowUpRight size={14} className="mr-1" />
                    <span>10% desde o mês passado</span>
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <ClipboardList size={22} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("auditorias-concluidas")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Concluídas</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">32</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-green-600">
                    <ArrowUpRight size={14} className="mr-1" />
                    <span>67% do total</span>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <CheckCircle size={22} className="text-green-600" />
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("auditorias-andamento")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Em Andamento</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">8</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-blue-600">
                    <Clock3 size={14} className="mr-1" />
                    <span>17% do total</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Clock3 size={22} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick("auditorias-programadas")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Programadas</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">8</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-orange-600">
                    <Calendar size={14} className="mr-1" />
                    <span>16% do total</span>
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <Calendar size={22} className="text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-800">Auditorias</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAuditoriasFilterChange("todas")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      auditoriasFilter === "todas"
                        ? "bg-[#0f2167] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => handleAuditoriasFilterChange("concluída")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      auditoriasFilter === "concluída"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Concluídas
                  </button>
                  <button
                    onClick={() => handleAuditoriasFilterChange("em-andamento")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      auditoriasFilter === "em-andamento"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Em Andamento
                  </button>
                  <button
                    onClick={() => handleAuditoriasFilterChange("programada")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      auditoriasFilter === "programada"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Programadas
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar auditoria..."
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={auditoriasSearchTerm}
                    onChange={(e) => setAuditoriasSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico e Tabela */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Auditorias por Tipo</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={auditoriasPorTipo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {auditoriasPorTipo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total de Auditorias</span>
                  <span className="text-sm font-semibold">100</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Lista de Auditorias</h3>
                <div className="flex items-center gap-2">
                  <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Calendário</span>
                  </button>
                  <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <Download size={16} />
                    <span>Exportar</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          ID
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Título
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Tipo
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Auditor
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Data
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Status
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          Resultado
                          <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAuditorias.map((auditoria, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {auditoria.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auditoria.titulo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auditoria.tipo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auditoria.auditor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {auditoria.dataInicio} - {auditoria.dataFim}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              auditoria.status === "Concluída"
                                ? "bg-green-100 text-green-800"
                                : auditoria.status === "Em andamento"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {auditoria.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {auditoria.resultado === "Pendente" ? (
                            <span className="text-gray-500 text-sm">-</span>
                          ) : (
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                auditoria.resultado === "Conforme"
                                  ? "bg-green-100 text-green-800"
                                  : auditoria.resultado === "Não Conforme"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {auditoria.resultado}
                              {auditoria.pontuacao && ` (${auditoria.pontuacao}%)`}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-[#0f2167] hover:text-[#1e3a8a]">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredAuditorias.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma auditoria encontrada com os filtros atuais.</p>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Mostrando <span className="font-medium">{filteredAuditorias.length}</span> de{" "}
                  <span className="font-medium">{auditoriasData.length}</span> auditorias
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="px-3 py-1 bg-[#0f2167] text-white rounded-md text-sm hover:bg-[#1e3a8a]">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Filtros Avançados */}
      {showFiltersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Filtros Avançados</h3>
              <button onClick={toggleFiltersModal} className="text-gray-500 hover:text-gray-700">
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={advancedFilters.periodo}
                  onChange={(e) => handleFilterChange("periodo", e.target.value)}
                >
                  <option value="7dias">Últimos 7 dias</option>
                  <option value="30dias">Últimos 30 dias</option>
                  <option value="60dias">Últimos 60 dias</option>
                  <option value="90dias">Últimos 90 dias</option>
                  <option value="ano">Este ano</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={advancedFilters.prioridade}
                  onChange={(e) => handleFilterChange("prioridade", e.target.value)}
                >
                  <option value="todas">Todas</option>
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={advancedFilters.setor}
                  onChange={(e) => handleFilterChange("setor", e.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="producao">Produção</option>
                  <option value="administrativo">Administrativo</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="logistica">Logística</option>
                  <option value="ti">TI</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={advancedFilters.responsavel}
                  onChange={(e) => handleFilterChange("responsavel", e.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="carlos">Carlos Silva</option>
                  <option value="ana">Ana Oliveira</option>
                  <option value="roberto">Roberto Santos</option>
                  <option value="mariana">Mariana Costa</option>
                  <option value="pedro">Pedro Almeida</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={toggleFiltersModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-[#0f2167] text-white rounded-md text-sm hover:bg-[#1e3a8a]"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{detailsTitle}</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                <XCircle size={20} />
              </button>
            </div>

            <div className="overflow-x-auto">
              {detailsType === "inspecoes" && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tipo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Local
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Responsável
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Data
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Prioridade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {detailsData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tipo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.local}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.responsavel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.data}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              item.status === "Concluída"
                                ? "bg-green-100 text-green-800"
                                : item.status === "Em andamento"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              item.prioridade === "Alta"
                                ? "bg-red-100 text-red-800"
                                : item.prioridade === "Média"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.prioridade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {detailsType === "acoes-criticas" && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Título
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tipo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Setor
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Responsável
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Prazo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Progresso
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {detailsData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.titulo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tipo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.setor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.responsavel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.prazo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              item.status === "Concluída"
                                ? "bg-green-100 text-green-800"
                                : item.status === "Em andamento"
                                  ? "bg-blue-100 text-blue-800"
                                  : item.status === "Atrasada"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                              <div
                                className={`h-2.5 rounded-full ${
                                  item.status === "Concluída"
                                    ? "bg-green-500"
                                    : item.status === "Atrasada"
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                                }`}
                                style={{ width: `${item.progresso}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{item.progresso}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {detailsType === "auditorias" && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Título
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tipo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Setor
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Auditor
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Data
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Resultado
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Pontuação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {detailsData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.titulo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tipo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.setor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.auditor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.dataInicio} - {item.dataFim}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              item.resultado === "Conforme"
                                ? "bg-green-100 text-green-800"
                                : item.resultado === "Não Conforme"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.resultado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.pontuacao ? `${item.pontuacao}%` : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {detailsType === "relatorios" && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Título/Tipo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Responsável
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Data
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Categoria
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {detailsData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.titulo || item.tipo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.responsavel || item.auditor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.data || (item.dataInicio ? `${item.dataInicio} - ${item.dataFim}` : item.prazo)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              item.status === "Concluída"
                                ? "bg-green-100 text-green-800"
                                : item.status === "Em andamento"
                                  ? "bg-blue-100 text-blue-800"
                                  : item.status === "Atrasada"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.titulo ? "Ação" : item.local ? "Inspeção" : "Auditoria"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {detailsData.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum dado disponível para exibição.</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-[#0f2167] text-white rounded-md text-sm hover:bg-[#1e3a8a]"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ReferenceLine,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import { Calendar, AlertTriangle, Clock, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

// Importe o hook useRouter do Next.js
import { useRouter } from "next/navigation"

// Dados mockados para a aba Calendário
const reunioesCalendario = [
  {
    id: "RC001",
    titulo: "Reunião Semanal de Segurança",
    data: "2025-05-15",
    horario: "09:00",
    tipo: "Segurança",
    local: "Sala de Reuniões A",
    participantes: 12,
  },
  {
    id: "RC002",
    titulo: "DDS - Ergonomia",
    data: "2025-05-16",
    horario: "08:00",
    tipo: "DDS",
    local: "Área Operacional",
    participantes: 25,
  },
  {
    id: "RC003",
    titulo: "Reunião Extraordinária CIPA",
    data: "2025-05-18",
    horario: "14:30",
    tipo: "CIPA",
    local: "Sala de Treinamento",
    participantes: 8,
  },
  {
    id: "RC004",
    titulo: "Análise Preliminar de Risco",
    data: "2025-05-20",
    horario: "10:00",
    tipo: "Segurança",
    local: "Sala de Reuniões B",
    participantes: 6,
  },
  {
    id: "RC005",
    titulo: "DDS - Trabalho em Altura",
    data: "2025-05-22",
    horario: "08:00",
    tipo: "DDS",
    local: "Área Operacional",
    participantes: 18,
  },
  {
    id: "RC006",
    titulo: "Reunião Mensal CIPA",
    data: "2025-05-25",
    horario: "09:30",
    tipo: "CIPA",
    local: "Sala de Reuniões A",
    participantes: 12,
  },
  {
    id: "RC007",
    titulo: "Planejamento de Segurança Q3",
    data: "2025-05-28",
    horario: "13:00",
    tipo: "Diretoria",
    local: "Sala de Conferência",
    participantes: 8,
  },
  {
    id: "RC008",
    titulo: "DDS - Produtos Químicos",
    data: "2025-05-29",
    horario: "08:00",
    tipo: "DDS",
    local: "Laboratório",
    participantes: 15,
  },
  {
    id: "RC009",
    titulo: "Reunião de Integração",
    data: "2025-05-30",
    horario: "09:00",
    tipo: "Integração",
    local: "Auditório",
    participantes: 22,
  },
]

const tiposReuniao = [
  { tipo: "CIPA", cor: "#3b82f6", reunioes: 12 },
  { tipo: "DDS", cor: "#10b981", reunioes: 45 },
  { tipo: "Segurança", cor: "#f59e0b", reunioes: 24 },
  { tipo: "Diretoria", cor: "#8b5cf6", reunioes: 8 },
  { tipo: "Integração", cor: "#ec4899", reunioes: 18 },
]

const proximasReunioes = reunioesCalendario.slice(0, 5)

// Função para gerar os dias do calendário
const gerarDiasCalendario = (data) => {
  const ano = data.getFullYear()
  const mes = data.getMonth()

  // Primeiro dia do mês
  const primeiroDia = new Date(ano, mes, 1)
  // Último dia do mês
  const ultimoDia = new Date(ano, mes + 1, 0)

  // Dia da semana do primeiro dia (0 = Domingo, 1 = Segunda, etc.)
  const diaSemanaInicio = primeiroDia.getDay()

  // Total de dias no mês atual
  const diasNoMes = ultimoDia.getDate()

  // Dias do mês anterior para preencher o início do calendário
  const diasMesAnterior = []
  if (diaSemanaInicio > 0) {
    const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate()
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      diasMesAnterior.push(ultimoDiaMesAnterior - i)
    }
  }

  // Dias do mês atual
  const diasMesAtual = Array.from({ length: diasNoMes }, (_, i) => i + 1)

  // Dias do próximo mês para preencher o final do calendário
  const diasProximoMes = []
  const diasRestantes = 42 - (diasMesAnterior.length + diasMesAtual.length) // 6 semanas * 7 dias = 42
  for (let i = 1; i <= diasRestantes; i++) {
    diasProximoMes.push(i)
  }

  return {
    diasMesAnterior,
    diasMesAtual,
    diasProximoMes,
    ano,
    mes,
  }
}

// Função para filtrar reuniões por mês e ano
const filtrarReunioesPorMes = (reunioes, ano, mes) => {
  return reunioes.filter((reuniao) => {
    const dataReuniao = new Date(reuniao.data)
    return dataReuniao.getFullYear() === ano && dataReuniao.getMonth() === mes
  })
}

// Dados mockados para a aba Ações
const acoesPorPrioridade = [
  { name: "Alta", value: 42, color: "#ef4444" },
  { name: "Média", value: 78, color: "#f59e0b" },
  { name: "Baixa", value: 128, color: "#3b82f6" },
]

const acoesPorResponsavel = [
  { name: "Carlos Silva", quantidade: 18, concluidas: 12 },
  { name: "Ana Oliveira", quantidade: 15, concluidas: 9 },
  { name: "Roberto Santos", quantidade: 12, concluidas: 5 },
  { name: "Juliana Costa", quantidade: 10, concluidas: 8 },
  { name: "Marcos Pereira", quantidade: 8, concluidas: 6 },
]

const historicoAcoes = [
  { mes: "Jan", criadas: 32, concluidas: 24 },
  { mes: "Fev", criadas: 38, concluidas: 30 },
  { mes: "Mar", criadas: 42, concluidas: 36 },
  { mes: "Abr", criadas: 35, concluidas: 28 },
  { mes: "Mai", criadas: 40, concluidas: 32 },
  { mes: "Jun", criadas: 48, concluidas: 38 },
]

const acoesRecentes = [
  {
    id: "AC001",
    descricao: "Revisar procedimento de trabalho em altura",
    responsavel: "Carlos Silva",
    reuniao: "CIPA Mensal - Maio",
    prazo: "2025-05-20",
    status: "Em andamento",
    prioridade: "Alta",
    progresso: 75,
  },
  {
    id: "AC002",
    descricao: "Atualizar mapa de riscos do setor produtivo",
    responsavel: "Ana Oliveira",
    reuniao: "Segurança Semanal",
    prazo: "2025-05-15",
    status: "Em andamento",
    prioridade: "Alta",
    progresso: 90,
  },
  {
    id: "AC003",
    descricao: "Implementar checklist de inspeção de EPIs",
    responsavel: "Roberto Santos",
    reuniao: "DDS - EPIs",
    prazo: "2025-05-18",
    status: "Em andamento",
    prioridade: "Média",
    progresso: 50,
  },
  {
    id: "AC004",
    descricao: "Realizar treinamento de primeiros socorros",
    responsavel: "Juliana Costa",
    reuniao: "Planejamento Trimestral",
    prazo: "2025-05-25",
    status: "Em andamento",
    prioridade: "Média",
    progresso: 25,
  },
  {
    id: "AC005",
    descricao: "Revisar plano de emergência",
    responsavel: "Marcos Pereira",
    reuniao: "Diretoria - Segurança",
    prazo: "2025-06-10",
    status: "Não iniciada",
    prioridade: "Baixa",
    progresso: 0,
  },
]

// Dados simulados para o dashboard
const reunioesPorTipo = [
  { name: "CIPA", realizadas: 12, planejadas: 12 },
  { name: "Diretoria", realizadas: 8, planejadas: 10 },
  { name: "Segurança", realizadas: 24, planejadas: 24 },
  { name: "DDS", realizadas: 45, planejadas: 52 },
  { name: "Integração", realizadas: 18, planejadas: 20 },
]

const acoesPorStatus = [
  { name: "Concluídas", value: 68, percentual: "63%", color: "#10b981" },
  { name: "Em andamento", value: 23, percentual: "21%", color: "#3b82f6" },
  { name: "Atrasadas", value: 12, percentual: "11%", color: "#ef4444" },
  { name: "Canceladas", value: 5, percentual: "5%", color: "#6b7280" },
]

const tendenciaParticipacao = [
  { mes: "Jan", taxa: 78 },
  { mes: "Fev", taxa: 82 },
  { mes: "Mar", taxa: 85 },
  { mes: "Abr", taxa: 82 },
  { mes: "Mai", taxa: 88 },
  { mes: "Jun", taxa: 92 },
]

const topicosFrequentes = [
  { name: "Uso de EPIs", count: 32, percentual: 18 },
  { name: "Procedimentos", count: 28, percentual: 16 },
  { name: "Incidentes", count: 24, percentual: 14 },
  { name: "Treinamentos", count: 22, percentual: 13 },
  { name: "Inspeções", count: 18, percentual: 10 },
  { name: "Outros", count: 51, percentual: 29 },
]

// Dados mockados para a aba Participação
const participacaoPorTipo = [
  { tipo: "CIPA", participacao: 92 },
  { tipo: "DDS", participacao: 88 },
  { tipo: "Segurança", participacao: 85 },
  { tipo: "Diretoria", participacao: 95 },
  { tipo: "Integração", participacao: 90 },
]

const participacaoPorMes = [
  { mes: "Jan", presencial: 82, remoto: 12, ausente: 6 },
  { mes: "Fev", presencial: 80, remoto: 15, ausente: 5 },
  { mes: "Mar", presencial: 78, remoto: 18, ausente: 4 },
  { mes: "Abr", presencial: 75, remoto: 20, ausente: 5 },
  { mes: "Mai", presencial: 72, remoto: 22, ausente: 6 },
  { mes: "Jun", presencial: 70, remoto: 25, ausente: 5 },
]

const participantesMaisAtivos = [
  { id: 1, nome: "Carlos Silva", cargo: "Técnico de Segurança", setor: "SST", participacao: 100, contribuicoes: 28 },
  {
    id: 2,
    nome: "Ana Oliveira",
    cargo: "Supervisora de Produção",
    setor: "Produção",
    participacao: 95,
    contribuicoes: 22,
  },
  { id: 3, nome: "Roberto Santos", cargo: "Operador", setor: "Produção", participacao: 90, contribuicoes: 15 },
  {
    id: 4,
    nome: "Juliana Costa",
    cargo: "Analista de Qualidade",
    setor: "Qualidade",
    participacao: 88,
    contribuicoes: 18,
  },
  {
    id: 5,
    nome: "Marcos Pereira",
    cargo: "Engenheiro de Segurança",
    setor: "SST",
    participacao: 98,
    contribuicoes: 32,
  },
  { id: 6, nome: "Fernanda Lima", cargo: "Técnica de Enfermagem", setor: "Saúde", participacao: 92, contribuicoes: 20 },
  { id: 7, nome: "Paulo Mendes", cargo: "Gerente de Produção", setor: "Produção", participacao: 85, contribuicoes: 25 },
]

const participacaoPorSetor = [
  { setor: "Produção", participacao: 85, colaboradores: 45 },
  { setor: "Manutenção", participacao: 82, colaboradores: 18 },
  { setor: "Administrativo", participacao: 90, colaboradores: 22 },
  { setor: "Logística", participacao: 78, colaboradores: 15 },
  { setor: "Qualidade", participacao: 88, colaboradores: 12 },
  { setor: "SST", participacao: 98, colaboradores: 8 },
]

const reunioesRecentes = [
  {
    id: "R001",
    titulo: "Reunião Mensal CIPA",
    data: "2025-05-10",
    tipo: "CIPA",
    totalParticipantes: 12,
    presentes: 11,
    remotos: 1,
    ausentes: 0,
    participacao: 100,
  },
  {
    id: "R002",
    titulo: "DDS - Trabalho em Altura",
    data: "2025-05-08",
    tipo: "DDS",
    totalParticipantes: 25,
    presentes: 22,
    remotos: 0,
    ausentes: 3,
    participacao: 88,
  },
  {
    id: "R003",
    titulo: "Análise de Incidente #457",
    data: "2025-05-05",
    tipo: "Segurança",
    totalParticipantes: 8,
    presentes: 6,
    remotos: 1,
    ausentes: 1,
    participacao: 87.5,
  },
  {
    id: "R004",
    titulo: "Planejamento de Segurança Q2",
    data: "2025-04-28",
    tipo: "Diretoria",
    totalParticipantes: 10,
    presentes: 8,
    remotos: 2,
    ausentes: 0,
    participacao: 100,
  },
]

// Adicionar novos dados mockados para a aba Tendências após os dados existentes (antes da função DashboardReunioes)

// Dados mockados para a aba Tendências
const tendenciaReunioesPorMes = [
  { mes: "Jan", quantidade: 15, participacao: 78, acoes: 32 },
  { mes: "Fev", quantidade: 18, participacao: 82, acoes: 38 },
  { mes: "Mar", quantidade: 22, participacao: 85, acoes: 42 },
  { mes: "Abr", quantidade: 20, participacao: 82, acoes: 35 },
  { mes: "Mai", quantidade: 25, participacao: 88, acoes: 40 },
  { mes: "Jun", quantidade: 28, participacao: 92, acoes: 48 },
  { mes: "Jul", quantidade: 30, participacao: 90, acoes: 52 },
  { mes: "Ago", quantidade: 32, participacao: 91, acoes: 55 },
  { mes: "Set", quantidade: 35, participacao: 93, acoes: 60 },
  { mes: "Out", quantidade: 38, participacao: 94, acoes: 65 },
  { mes: "Nov", quantidade: 40, participacao: 95, acoes: 68 },
  { mes: "Dez", quantidade: 42, participacao: 96, acoes: 72 },
]

const previsaoProximosMeses = [
  { mes: "Jan", previsto: 44, intervaloInferior: 40, intervaloSuperior: 48 },
  { mes: "Fev", previsto: 46, intervaloInferior: 42, intervaloSuperior: 50 },
  { mes: "Mar", previsto: 48, intervaloInferior: 44, intervaloSuperior: 52 },
  { mes: "Abr", previsto: 50, intervaloInferior: 46, intervaloSuperior: 54 },
  { mes: "Mai", previsto: 52, intervaloInferior: 48, intervaloSuperior: 56 },
  { mes: "Jun", previsto: 54, intervaloInferior: 50, intervaloSuperior: 58 },
]

const correlacaoMetricas = [
  { x: 75, y: 28, z: 15, nome: "Janeiro" },
  { x: 78, y: 32, z: 18, nome: "Fevereiro" },
  { x: 82, y: 35, z: 22, nome: "Março" },
  { x: 85, y: 38, z: 25, nome: "Abril" },
  { x: 88, y: 42, z: 30, nome: "Maio" },
  { x: 92, y: 45, z: 35, nome: "Junho" },
  { x: 95, y: 48, z: 40, nome: "Julho" },
  { x: 90, y: 44, z: 38, nome: "Agosto" },
  { x: 93, y: 47, z: 42, nome: "Setembro" },
  { x: 96, y: 52, z: 45, nome: "Outubro" },
  { x: 98, y: 55, z: 48, nome: "Novembro" },
  { x: 99, y: 58, z: 52, nome: "Dezembro" },
]

const tendenciaPorTipoReuniao = [
  {
    nome: "CIPA",
    dados: [10, 12, 11, 13, 14, 12, 15, 16, 17, 18, 19, 20],
  },
  {
    nome: "DDS",
    dados: [35, 38, 40, 42, 45, 48, 50, 52, 55, 58, 60, 62],
  },
  {
    nome: "Segurança",
    dados: [18, 20, 22, 21, 24, 25, 26, 28, 30, 32, 34, 35],
  },
  {
    nome: "Diretoria",
    dados: [8, 8, 9, 8, 10, 9, 10, 11, 12, 12, 13, 14],
  },
  {
    nome: "Integração",
    dados: [15, 16, 18, 17, 19, 20, 22, 24, 25, 26, 28, 30],
  },
]

const sazonalidadePorDiaSemana = [
  { dia: "Segunda", semana1: 8, semana2: 7, semana3: 9, semana4: 8 },
  { dia: "Terça", semana1: 5, semana2: 6, semana3: 4, semana4: 5 },
  { dia: "Quarta", semana1: 4, semana2: 3, semana3: 5, semana4: 4 },
  { dia: "Quinta", semana1: 7, semana2: 8, semana3: 6, semana4: 7 },
  { dia: "Sexta", semana1: 3, semana2: 4, semana3: 3, semana4: 2 },
  { dia: "Sábado", semana1: 2, semana2: 1, semana3: 2, semana4: 1 },
  { dia: "Domingo", semana1: 1, semana2: 0, semana3: 1, semana4: 1 },
]

const indicadoresDesempenho = [
  {
    nome: "Taxa de Participação",
    atual: 92,
    anterior: 88,
    meta: 90,
    tendencia: "aumento",
    previsao: 94,
  },
  {
    nome: "Ações por Reunião",
    atual: 2.8,
    anterior: 2.5,
    meta: 2.0,
    tendencia: "aumento",
    previsao: 3.0,
  },
  {
    nome: "Taxa de Conclusão de Ações",
    atual: 78,
    anterior: 70,
    meta: 85,
    tendencia: "aumento",
    previsao: 82,
  },
  {
    nome: "Tempo Médio de Resolução (dias)",
    atual: 12.4,
    anterior: 14.7,
    meta: 10.0,
    tendencia: "diminuicao",
    previsao: 11.2,
  },
  {
    nome: "Reuniões por Mês",
    atual: 42,
    anterior: 38,
    meta: 40,
    tendencia: "aumento",
    previsao: 45,
  },
]

// Função para gerar reuniões para qualquer mês
const gerarReunioesMensais = (ano, mes) => {
  // Nomes dos tipos de reunião para distribuição aleatória
  const tiposReuniao = ["CIPA", "DDS", "Segurança", "Diretoria", "Integração"]
  const locais = ["Sala de Reuniões A", "Sala de Reuniões B", "Área Operacional", "Auditório", "Sala de Treinamento"]

  // Número de dias no mês
  const diasNoMes = new Date(ano, mes + 1, 0).getDate()

  // Gerar entre 5 e 10 reuniões para o mês
  const numReunioes = 5 + Math.floor(Math.random() * 6)
  const reunioes = []

  for (let i = 0; i < numReunioes; i++) {
    // Escolher um dia aleatório no mês
    const dia = 1 + Math.floor(Math.random() * diasNoMes)
    const tipo = tiposReuniao[Math.floor(Math.random() * tiposReuniao.length)]
    const local = locais[Math.floor(Math.random() * locais.length)]

    // Formatar a data
    const dataFormatada = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`

    // Gerar horário aleatório entre 8h e 17h
    const hora = 8 + Math.floor(Math.random() * 10)
    const minuto = Math.random() > 0.5 ? "00" : "30"
    const horario = `${String(hora).padStart(2, "0")}:${minuto}`

    reunioes.push({
      id: `R${ano}${mes}${dia}${i}`,
      titulo: `${tipo} - ${mes + 1}/${ano}`,
      data: dataFormatada,
      horario: horario,
      tipo: tipo,
      local: local,
      participantes: 5 + Math.floor(Math.random() * 20),
    })
  }

  return reunioes
}

// Adicione o hook useRouter na função do componente
export default function DashboardReunioes() {
  const { toast } = useToast()
  const router = useRouter() // Adicione esta linha
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [diasCalendario, setDiasCalendario] = useState({ diasMesAnterior: [], diasMesAtual: [], diasProximoMes: [] })
  const [periodoSelecionado, setPeriodoSelecionado] = useState("ultimos90dias")
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("todas")
  const [tipoReuniaoSelecionado, setTipoReuniaoSelecionado] = useState("todos")
  const [isLoading, setIsLoading] = useState(true)
  const [reunioesFiltradas, setReunioesFiltradas] = useState([])
  const [anoSelecionado, setAnoSelecionado] = useState(2025)

  // Adicionar função para mudar o ano
  const mudarAno = (novoAno) => {
    const novaData = new Date(currentMonth)
    novaData.setFullYear(novoAno)
    setCurrentMonth(novaData)
  }

  // Adicionar função para ir para o mês atual
  const irParaMesAtual = () => {
    setCurrentMonth(new Date())
  }

  // Atualizar os dias do calendário e filtrar reuniões quando o mês mudar
  useEffect(() => {
    const { diasMesAnterior, diasMesAtual, diasProximoMes, ano, mes } = gerarDiasCalendario(currentMonth)
    setDiasCalendario({ diasMesAnterior, diasMesAtual, diasProximoMes })

    // Filtrar reuniões para o mês atual
    const reunioesMes = filtrarReunioesPorMes(reunioesCalendario, ano, mes)
    setReunioesFiltradas(reunioesMes)
  }, [currentMonth])

  // Adicionar useEffect para gerar reuniões para meses sem dados
  useEffect(() => {
    const { ano, mes } = gerarDiasCalendario(currentMonth)

    // Verificar se já temos reuniões para este mês nos dados mockados
    const reunioesMes = filtrarReunioesPorMes(reunioesCalendario, ano, mes)

    if (reunioesMes.length === 0) {
      // Se não houver reuniões para este mês, gerar algumas
      const reunioesGeradas = gerarReunioesMensais(ano, mes)
      setReunioesFiltradas(reunioesGeradas)
    } else {
      setReunioesFiltradas(reunioesMes)
    }
  }, [currentMonth])

  // Simulação de carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  // Função para aplicar filtros
  const aplicarFiltros = () => {
    setIsLoading(true)
    // Simulação de tempo para aplicar filtros
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Reuniões</h1>
          <p className="text-gray-500">Análise de desempenho e efetividade das reuniões de SST</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ultimos30dias">Últimos 30 dias</SelectItem>
              <SelectItem value="ultimos90dias">Últimos 90 dias</SelectItem>
              <SelectItem value="ultimos6meses">Últimos 6 meses</SelectItem>
              <SelectItem value="ultimoano">Último ano</SelectItem>
              <SelectItem value="personalizado">Personalizado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={unidadeSelecionada} onValueChange={setUnidadeSelecionada}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as unidades</SelectItem>
              <SelectItem value="matriz">Matriz</SelectItem>
              <SelectItem value="filial1">Filial 1</SelectItem>
              <SelectItem value="filial2">Filial 2</SelectItem>
              <SelectItem value="filial3">Filial 3</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tipoReuniaoSelecionado} onValueChange={setTipoReuniaoSelecionado}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Tipo de Reunião" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="cipa">CIPA</SelectItem>
              <SelectItem value="dds">DDS</SelectItem>
              <SelectItem value="seguranca">Segurança</SelectItem>
              <SelectItem value="diretoria">Diretoria</SelectItem>
              <SelectItem value="integracao">Integração</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={aplicarFiltros} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Filter className="h-4 w-4" />
            Aplicar Filtros
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-gray-200 border-r-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Carregando dados do dashboard...</p>
        </div>
      ) : (
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
                value="acoes"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-3 px-5 text-gray-600 data-[state=active]:text-blue-600"
              >
                Ações
              </TabsTrigger>
              <TabsTrigger
                value="participacao"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-3 px-5 text-gray-600 data-[state=active]:text-blue-600"
              >
                Participação
              </TabsTrigger>
              <TabsTrigger
                value="tendencias"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-3 px-5 text-gray-600 data-[state=active]:text-blue-600"
              >
                Tendências
              </TabsTrigger>
              <TabsTrigger
                value="calendario"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-3 px-5 text-gray-600 data-[state=active]:text-blue-600"
              >
                Calendário
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visaogeral" className="space-y-6 mt-0">
              {/* Cards de KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Total de Reuniões</div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">107</div>
                      <div className="text-xs text-green-600 flex items-center">+12% vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Taxa de Realização</div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-4">
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
                      <div className="text-3xl font-bold">92%</div>
                      <div className="text-xs text-green-600 flex items-center">+5% vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Ações Geradas</div>
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-full mr-4">
                      <AlertTriangle className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">248</div>
                      <div className="text-xs text-amber-600 flex items-center">+18% vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Taxa de Conclusão</div>
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">78%</div>
                      <div className="text-xs text-green-600 flex items-center">+8% vs período anterior</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráficos principais */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Reuniões por Tipo</h3>
                    <p className="text-sm text-gray-500">Comparativo entre reuniões planejadas e realizadas</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reunioesPorTipo} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="realizadas" name="Realizadas" fill="#3b82f6" />
                        <Bar dataKey="planejadas" name="Planejadas" fill="#93c5fd" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Status das Ações</h3>
                    <p className="text-sm text-gray-500">Distribuição das ações por status atual</p>
                  </div>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={acoesPorStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percentual }) => `${name}: ${percentual}`}
                        >
                          {acoesPorStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Tendências e tópicos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Tendência de Participação</h3>
                    <p className="text-sm text-gray-500">Taxa média de participação ao longo do tempo</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={tendenciaParticipacao} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="taxa"
                          name="Taxa de Participação (%)"
                          stroke="#3b82f6"
                          fill="#93c5fd"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Tópicos Mais Discutidos</h3>
                    <p className="text-sm text-gray-500">Assuntos mais frequentes nas reuniões</p>
                  </div>
                  <div className="space-y-4">
                    {topicosFrequentes.map((topico) => (
                      <div key={topico.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{topico.name}</span>
                          <span className="font-medium">
                            {topico.count} menções ({topico.percentual}%)
                          </span>
                        </div>
                        <Progress value={topico.percentual} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Conteúdo das outras abas seria implementado aqui */}
            <TabsContent value="acoes" className="space-y-6 mt-0">
              {/* Cards de KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Total de Ações</div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <AlertTriangle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">248</div>
                      <div className="text-xs text-green-600 flex items-center">+18% vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Taxa de Conclusão</div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-4">
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
                      <div className="text-3xl font-bold">78%</div>
                      <div className="text-xs text-green-600 flex items-center">+8% vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Tempo Médio de Resolução</div>
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">12.4</div>
                      <div className="text-xs text-green-600 flex items-center">-2.3 dias vs período anterior</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráficos principais */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Status das Ações</h3>
                    <p className="text-sm text-gray-500">Distribuição das ações por status atual</p>
                  </div>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={acoesPorStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percentual }) => `${name}: ${percentual}`}
                        >
                          {acoesPorStatus.map((entry, index) => (
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
                    <h3 className="text-lg font-semibold">Ações por Prioridade</h3>
                    <p className="text-sm text-gray-500">Distribuição das ações por nível de prioridade</p>
                  </div>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={acoesPorPrioridade}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {acoesPorPrioridade.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Histórico e responsáveis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Histórico de Ações</h3>
                    <p className="text-sm text-gray-500">Ações criadas vs. concluídas por mês</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={historicoAcoes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="criadas" name="Ações Criadas" fill="#3b82f6" />
                        <Bar dataKey="concluidas" name="Ações Concluídas" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Ações por Responsável</h3>
                    <p className="text-sm text-gray-500">Top 5 responsáveis com mais ações atribuídas</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={acoesPorResponsavel}
                        margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="quantidade" name="Total de Ações" fill="#3b82f6" />
                        <Bar dataKey="concluidas" name="Ações Concluídas" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Tabela de ações recentes */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Ações Pendentes Críticas</h3>
                  <p className="text-sm text-gray-500">Ações com prazo próximo ou vencido</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Descrição</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Responsável</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Reunião</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Prazo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Prioridade</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Progresso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {acoesRecentes.map((acao) => {
                        const hoje = new Date()
                        const prazo = new Date(acao.prazo)
                        const diasRestantes = Math.ceil((prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

                        let prazoClass = "text-gray-600"
                        if (diasRestantes < 0) {
                          prazoClass = "text-red-600 font-medium"
                        } else if (diasRestantes <= 3) {
                          prazoClass = "text-amber-600 font-medium"
                        }

                        return (
                          <tr key={acao.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{acao.id}</td>
                            <td className="py-3 px-4">{acao.descricao}</td>
                            <td className="py-3 px-4">{acao.responsavel}</td>
                            <td className="py-3 px-4">{acao.reuniao}</td>
                            <td className={`py-3 px-4 ${prazoClass}`}>
                              {new Date(acao.prazo).toLocaleDateString("pt-BR")}
                              {diasRestantes < 0
                                ? ` (Vencido há ${Math.abs(diasRestantes)} dias)`
                                : diasRestantes === 0
                                  ? " (Hoje)"
                                  : ` (${diasRestantes} dias)`}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  acao.status === "Concluída"
                                    ? "bg-green-100 text-green-800"
                                    : acao.status === "Em andamento"
                                      ? "bg-blue-100 text-blue-800"
                                      : acao.status === "Atrasada"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {acao.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  acao.prioridade === "Alta"
                                    ? "bg-red-100 text-red-800"
                                    : acao.prioridade === "Média"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {acao.prioridade}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Progress value={acao.progresso} className="h-2 w-24" />
                                <span className="text-xs">{acao.progresso}%</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    Ver todas as ações
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="participacao" className="space-y-6 mt-0">
              {/* Cards de KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Taxa Média de Participação</div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-4">
                      <svg
                        className="h-6 w-6 text-green-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="9"
                          cy="7"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M23 21v-2a4 4 0 0 0-3-3.87"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 3.13a4 4 0 0 1 0 7.75"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">87%</div>
                      <div className="text-xs text-green-600 flex items-center">+4% vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Participação Presencial</div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 8V16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 12H16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">75%</div>
                      <div className="text-xs text-amber-600 flex items-center">-5% vs período anterior</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Participação Remota</div>
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-full mr-4">
                      <svg
                        className="h-6 w-6 text-indigo-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M23 7L16 12L23 17V7Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <rect
                          x="1"
                          y="5"
                          width="15"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">22%</div>
                      <div className="text-xs text-green-600 flex items-center">+8% vs período anterior</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráficos principais */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Participação por Tipo de Reunião</h3>
                    <p className="text-sm text-gray-500">Taxa média de participação por categoria</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={participacaoPorTipo} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="tipo" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, "Taxa de Participação"]} />
                        <Bar dataKey="participacao" name="Taxa de Participação" fill="#3b82f6" />
                        <ReferenceLine
                          y={85}
                          stroke="#ef4444"
                          strokeDasharray="3 3"
                          label={{ position: "right", value: "Meta: 85%", fill: "#ef4444", fontSize: 12 }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Evolução da Participação</h3>
                    <p className="text-sm text-gray-500">Distribuição por tipo de participação ao longo do tempo</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={participacaoPorMes} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="presencial"
                          name="Presencial"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#93c5fd"
                        />
                        <Area
                          type="monotone"
                          dataKey="remoto"
                          name="Remoto"
                          stackId="1"
                          stroke="#8b5cf6"
                          fill="#c4b5fd"
                        />
                        <Area
                          type="monotone"
                          dataKey="ausente"
                          name="Ausente"
                          stackId="1"
                          stroke="#ef4444"
                          fill="#fca5a5"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Participação por setor */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Participação por Setor</h3>
                  <p className="text-sm text-gray-500">Taxa média de participação por setor da empresa</p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={participacaoPorSetor} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="setor" />
                      <YAxis yAxisId="left" orientation="left" domain={[0, 100]} />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="participacao" name="Taxa de Participação (%)" fill="#3b82f6" />
                      <Bar yAxisId="right" dataKey="colaboradores" name="Número de Colaboradores" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Participantes mais ativos */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Participantes Mais Ativos</h3>
                  <p className="text-sm text-gray-500">Colaboradores com maior taxa de participação e contribuição</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Colaborador</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Cargo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Setor</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Taxa de Participação</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Contribuições</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Nível de Engajamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participantesMaisAtivos.map((participante) => (
                        <tr key={participante.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{participante.nome}</td>
                          <td className="py-3 px-4">{participante.cargo}</td>
                          <td className="py-3 px-4">{participante.setor}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Progress value={participante.participacao} className="h-2 w-24" />
                              <span className="text-xs">{participante.participacao}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{participante.contribuicoes}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                participante.participacao >= 95
                                  ? "bg-green-100 text-green-800"
                                  : participante.participacao >= 85
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {participante.participacao >= 95
                                ? "Excelente"
                                : participante.participacao >= 85
                                  ? "Bom"
                                  : "Regular"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    Ver todos os participantes
                  </Button>
                </div>
              </div>

              {/* Reuniões recentes */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Reuniões Recentes</h3>
                  <p className="text-sm text-gray-500">Detalhes de participação nas últimas reuniões</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Título</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Data</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Tipo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Total</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Presentes</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Remotos</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Ausentes</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Participação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reunioesRecentes.map((reuniao) => (
                        <tr key={reuniao.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{reuniao.id}</td>
                          <td className="py-3 px-4">{reuniao.titulo}</td>
                          <td className="py-3 px-4">{new Date(reuniao.data).toLocaleDateString("pt-BR")}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                reuniao.tipo === "CIPA"
                                  ? "bg-blue-100 text-blue-800"
                                  : reuniao.tipo === "DDS"
                                    ? "bg-green-100 text-green-800"
                                    : reuniao.tipo === "Segurança"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-indigo-100 text-indigo-800"
                              }`}
                            >
                              {reuniao.tipo}
                            </span>
                          </td>
                          <td className="py-3 px-4">{reuniao.totalParticipantes}</td>
                          <td className="py-3 px-4 text-green-600">{reuniao.presentes}</td>
                          <td className="py-3 px-4 text-blue-600">{reuniao.remotos}</td>
                          <td className="py-3 px-4 text-red-600">{reuniao.ausentes}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Progress value={reuniao.participacao} className="h-2 w-24" />
                              <span className="text-xs">{reuniao.participacao}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    Ver todas as reuniões
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tendencias" className="space-y-6 mt-0">
              {/* Cards de KPIs de Tendências */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Crescimento de Reuniões</div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M23 6L13.5 15.5L8.5 10.5L1 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 6H23V12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">+12%</div>
                      <div className="text-xs text-green-600 flex items-center">Tendência de crescimento anual</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-2">Tendência de Participação</div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-4">
                      <svg
                        className="h-6 w-6 text-green-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M23 6L13.5 15.5L8.5 10.5L1 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 6H23V12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">+8%</div>
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
                      <svg
                        className="h-6 w-6 text-purple-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 7V12L15 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">+15%</div>
                      <div className="text-xs text-purple-600 flex items-center">Crescimento projetado em reuniões</div>
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
                    <LineChart data={tendenciaReunioesPorMes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="quantidade"
                        name="Quantidade de Reuniões"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                      />
                      <Line yAxisId="left" type="monotone" dataKey="acoes" name="Ações Geradas" stroke="#f59e0b" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="participacao"
                        name="Taxa de Participação (%)"
                        stroke="#10b981"
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
                    <p className="text-sm text-gray-500">Projeção de reuniões com intervalo de confiança</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={previsaoProximosMeses} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
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
                    {indicadoresDesempenho.map((indicador) => (
                      <div key={indicador.nome} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{indicador.nome}</span>
                          <span className="font-medium">
                            {indicador.atual}
                            {typeof indicador.atual === "number" && !Number.isInteger(indicador.atual) ? "" : "%"}
                            <span
                              className={`ml-2 ${
                                indicador.tendencia === "aumento"
                                  ? indicador.nome === "Tempo Médio de Resolução (dias)"
                                    ? "text-red-600"
                                    : "text-green-600"
                                  : indicador.nome === "Tempo Médio de Resolução (dias)"
                                    ? "text-green-600"
                                    : "text-red-600"
                              }`}
                            >
                              {indicador.tendencia === "aumento" ? "↑" : "↓"}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={indicador.atual} max={indicador.meta * 1.5} className="h-2 flex-grow" />
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-500">
                              Meta: {indicador.meta}
                              {typeof indicador.meta === "number" && !Number.isInteger(indicador.meta) ? "" : "%"}
                            </span>
                            <span className="h-4 w-px bg-gray-300"></span>
                            <span className="text-purple-600">
                              Previsão: {indicador.previsao}
                              {typeof indicador.previsao === "number" && !Number.isInteger(indicador.previsao)
                                ? ""
                                : "%"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Correlação e Tendências por Tipo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Correlação entre Métricas</h3>
                    <p className="text-sm text-gray-500">
                      Relação entre participação (x), ações geradas (y) e reuniões (z)
                    </p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="x" name="Taxa de Participação (%)" domain={[70, 100]} />
                        <YAxis type="number" dataKey="y" name="Ações Geradas" />
                        <ZAxis type="number" dataKey="z" range={[50, 400]} name="Quantidade de Reuniões" />
                        <Tooltip
                          cursor={{ strokeDasharray: "3 3" }}
                          formatter={(value, name, props) => {
                            if (name === "Taxa de Participação (%)") return [`${value}%`, name]
                            return [value, name]
                          }}
                        />
                        <Legend />
                        <Scatter name="Meses" data={correlacaoMetricas} fill="#8884d8" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Tendência por Tipo de Reunião</h3>
                    <p className="text-sm text-gray-500">Evolução da quantidade de reuniões por categoria</p>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="index"
                          type="number"
                          domain={[0, 11]}
                          tickFormatter={(value) => {
                            const meses = [
                              "Jan",
                              "Fev",
                              "Mar",
                              "Abr",
                              "Mai",
                              "Jun",
                              "Jul",
                              "Ago",
                              "Set",
                              "Out",
                              "Nov",
                              "Dez",
                            ]
                            return meses[value]
                          }}
                        />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => [value, name]}
                          labelFormatter={(value) => {
                            const meses = [
                              "Janeiro",
                              "Fevereiro",
                              "Março",
                              "Abril",
                              "Maio",
                              "Junho",
                              "Julho",
                              "Agosto",
                              "Setembro",
                              "Outubro",
                              "Novembro",
                              "Dezembro"
                            ]
                            return meses[value]
                          }}
                        />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => [value, name]}
                          labelFormatter={(value) => {
                            const meses = [
                              "Janeiro",
                              "Fevereiro",
                              "Março",
                              "Abril",
                              "Maio",
                              "Junho",
                              "Julho",
                              "Agosto",
                              "Setembro",
                              "Outubro",
                              "Novembro",
                              "Dezembro"
                            ]
                            return meses[value]
                          }}
                        />
                        <Legend />
                        <Line

                          type="monotone"
                          dataKey={0}
                          stroke="#3b82f6"
                          dot={false}
                        />
                        {tendenciaPorTipoReuniao.map((tipo, index) => (
                          <Line
                            key={tipo.nome}
                            type="monotone"
                            dataKey={`dados.${index}`}
                            name={tipo.nome}
                            stroke={["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"][index]}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calendario" className="space-y-6 mt-0">
              {/* Cabeçalho e controles do calendário */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-semibold">Calendário de Reuniões</h3>
                  <p className="text-sm text-gray-500">Visualização e planejamento de reuniões</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      const prevMonth = new Date(currentMonth)
                      prevMonth.setMonth(prevMonth.getMonth() - 1)
                      setCurrentMonth(prevMonth)
                    }}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Mês Anterior
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={irParaMesAtual}
                  >
                    Mês Atual
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      const nextMonth = new Date(currentMonth)
                      nextMonth.setMonth(nextMonth.getMonth() + 1)
                      setCurrentMonth(nextMonth)
                    }}
                  >
                    Próximo Mês
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>

                  <Select
                    value={currentMonth.getFullYear().toString()}
                    onValueChange={(value) => mudarAno(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-[100px] bg-white">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => 2020 + i).map(ano => (
                        <SelectItem key={ano} value={ano.toString()}>{ano}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    className="flex items-center gap-2 ml-auto"
                    onClick={() => {
                      toast({
                        title: "Nova Reunião",
                        description: "Redirecionando para o formulário de criação de reunião...",
                        duration: 3000,
                      })
                      router.push("/registros/reunioes/cadastrar")
                    }}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 5V19M5 12H19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Nova Reunião
                  </Button>
                </div>
              </div>

              {/* Legenda de tipos de reunião */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium">Legenda</h4>
                  <h3 className="text-lg font-semibold text-blue-600">
                    {currentMonth
                      .toLocaleString("pt-BR", { month: "long", year: "numeric" })
                      .replace(/^\w/, (c) => c.toUpperCase())}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {tiposReuniao.map((tipo) => (
                    <div key={tipo.tipo} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tipo.cor }}></div>
                      <span className="text-sm">{tipo.tipo}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendário */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="grid grid-cols-7 gap-1">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                    <div key={day} className="text-center py-2 font-medium text-sm text-gray-500">
                      {day}
                    </div>
                  ))}

                  {/* Dias do mês anterior (cinza) */}
                  {diasCalendario.diasMesAnterior.map((day) => (
                    <div key={`prev-${day}`} className="h-24 p-1 border rounded-md bg-gray-50">
                      <div className="text-right text-gray-400 text-sm">{day}</div>
                    </div>
                  ))}

                  {/* Dias do mês atual */}
                  {diasCalendario.diasMesAtual.map((day) => {
                    // Formatar a data para comparar com as reuniões
                    const dataAtual = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                    const dataFormatada = dataAtual.toISOString().split("T")[0]

                    // Encontrar reuniões para este dia
                    const reunioesDoDia = reunioesFiltradas.filter((reuniao) => reuniao.data === dataFormatada)

                    // Verificar se é o dia atual
                    const hoje = new Date()
                    const ehHoje =
                      hoje.getDate() === day &&
                      hoje.getMonth() === currentMonth.getMonth() &&
                      hoje.getFullYear() === currentMonth.getFullYear()

                    return (
                      <div
                        key={`current-${day}`}
                        className={`h-24 p-1 border rounded-md ${
                          ehHoje ? "ring-2 ring-blue-500 bg-blue-50" : ""
                        } hover:bg-gray-50 overflow-hidden`}
                      >
                        <div className="text-right text-sm">{day}</div>

                        {/* Eventos do dia */}
                        {reunioesDoDia.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {reunioesDoDia.map((reuniao) => {
                              // Encontrar a cor do tipo de reunião
                              const tipoInfo = tiposReuniao.find((t) => t.tipo === reuniao.tipo)
                              const bgColor = tipoInfo ? tipoInfo.cor + "20" : "#e5e7eb"
                              const textColor = tipoInfo ? tipoInfo.cor : "#374151"

                              return (
                                <div
                                  key={reuniao.id}
                                  className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                                  style={{ backgroundColor: bgColor, color: textColor }}
                                  title="Clique para ver detalhes"
                                  onClick={() => {
                                    setReuniaoSelecionada(reuniao)
                                    setModalAberto(true)
                                  }}
                                >
                                  {reuniao.horario} - {reuniao.titulo}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Dias do próximo mês (cinza) */}
                  {diasCalendario.diasProximoMes.map((day) => (
                    <div key={`next-${day}`} className="h-24 p-1 border rounded-md bg-gray-50">
                      <div className="text-right text-gray-400 text-sm">{day}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Próximas reuniões e estatísticas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Próximas Reuniões</h3>
                    <p className="text-sm text-gray-500">Reuniões agendadas para os próximos dias</p>
                  </div>
                  <div className="space-y-4">
                    {proximasReunioes.map((reuniao) => {
                      // Encontrar a cor do tipo de reunião
                      const tipoInfo = tiposReuniao.find((t) => t.tipo === reuniao.tipo)
                      const bgColor = tipoInfo ? tipoInfo.cor + "20" : "#e5e7eb"
                      const textColor = tipoInfo ? tipoInfo.cor : "#374151"

                      return (
                        <div
                          key={reuniao.id}
                          className="flex items-start p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setReuniaoSelecionada(reuniao)
                            setModalAberto(true)
                          }}
                        >
                          <div className="bg-green-100 p-2 rounded-full mr-4">
                            <svg
                              className="h-5 w-5 text-green-600"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M16 2V6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8 2V6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M3 10H21"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{reuniao.titulo}</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                              <span className="flex items-center">
                                <svg
                                  className="h-3.5 w-3.5 mr-1"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="18"
                                    rx="2"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M16 2V6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M8 2V6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M3 10H21"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {new Date(reuniao.data).toLocaleDateString("pt-BR")}
                              </span>
                              <span className="flex items-center">
                                <svg
                                  className="h-3.5 w-3.5 mr-1"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M12 6V12L16 14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {reuniao.horario}
                              </span>
                              <span className="flex items-center">
                                <svg
                                  className="h-3.5 w-3.5 mr-1"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086  11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086\

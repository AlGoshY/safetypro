"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowLeft, Download, Edit, Eye, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Tipos
interface VisitaTecnica {
  id: number
  empresa: string
  unidade: string
  dataVisita: Date
  responsavel: string
  status: "Agendada" | "Realizada" | "Cancelada" | "Em andamento"
  observacoes: string
  acoes: Acao[]
}

interface Acao {
  id: number
  problema: string
  causa: string
  acao: string
  observacao: string
  responsavel: string
  dataPrevisao: Date
  prioridade: "Alta" | "Média" | "Baixa"
  resolvido: boolean
  tipo: "Anomalia" | "Solução"
}

export function VisualizarVisitaTecnica() {
  const [visita, setVisita] = useState<VisitaTecnica | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAction, setSelectedAction] = useState<Acao | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const id = searchParams.get("id")

  useEffect(() => {
    if (!id) {
      router.push("/registros/visita-tecnica/listar")
      return
    }

    // Simulando uma chamada de API
    setLoading(true)
    setTimeout(() => {
      const mockVisita: VisitaTecnica = {
        id: Number.parseInt(id),
        empresa: "Empresa ABC",
        unidade: "Unidade São Paulo",
        dataVisita: new Date(2023, 4, 15),
        responsavel: "João Silva",
        status: "Realizada",
        observacoes:
          "Visita realizada com sucesso. Foram identificadas algumas anomalias que precisam ser corrigidas. A equipe local foi muito receptiva e colaborativa durante toda a visita.",
        acoes: [
          {
            id: 1,
            problema: "Falta de sinalização de emergência",
            causa: "Desgaste natural e falta de manutenção",
            acao: "Substituir as placas de sinalização de emergência",
            observacao: "Priorizar áreas de maior circulação",
            responsavel: "Carlos Santos",
            dataPrevisao: new Date(2023, 5, 10),
            prioridade: "Alta",
            resolvido: false,
            tipo: "Anomalia",
          },
          {
            id: 2,
            problema: "Extintores com validade vencida",
            causa: "Falha no controle de manutenção periódica",
            acao: "Substituir todos os extintores vencidos e implementar sistema de alerta para próximas manutenções",
            observacao: "Total de 5 extintores vencidos identificados",
            responsavel: "Maria Oliveira",
            dataPrevisao: new Date(2023, 5, 20),
            prioridade: "Alta",
            resolvido: true,
            tipo: "Anomalia",
          },
          {
            id: 3,
            problema: "Falta de treinamento da brigada de incêndio",
            causa: "Rotatividade de funcionários",
            acao: "Agendar treinamento para novos membros da brigada",
            observacao: "Incluir simulado prático",
            responsavel: "Roberto Almeida",
            dataPrevisao: new Date(2023, 6, 15),
            prioridade: "Média",
            resolvido: false,
            tipo: "Anomalia",
          },
          {
            id: 4,
            problema: "Vazamento no sistema hidráulico",
            causa: "Desgaste natural das conexões",
            acao: "Substituir conexões e realizar teste de pressão",
            observacao: "Localizado próximo à área de produção",
            responsavel: "Paulo Mendes",
            dataPrevisao: new Date(2023, 5, 25),
            prioridade: "Média",
            resolvido: true,
            tipo: "Anomalia",
          },
          {
            id: 5,
            problema: "Implementação de novo sistema de monitoramento",
            causa: "Melhoria contínua",
            acao: "Instalar câmeras e sensores nas áreas críticas",
            observacao: "Projeto piloto para posterior expansão",
            responsavel: "Fernanda Lima",
            dataPrevisao: new Date(2023, 7, 10),
            prioridade: "Baixa",
            resolvido: false,
            tipo: "Solução",
          },
        ],
      }

      setVisita(mockVisita)
      setLoading(false)
    }, 1000)
  }, [id, router])

  if (loading) {
    return <div className="flex justify-center items-center p-8">Carregando...</div>
  }

  if (!visita) {
    return <div className="flex justify-center items-center p-8">Visita não encontrada</div>
  }

  // Função para renderizar o status com cores
  const renderStatus = (status: string) => {
    switch (status) {
      case "Agendada":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
            Agendada
          </Badge>
        )
      case "Realizada":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            Realizada
          </Badge>
        )
      case "Cancelada":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
            Cancelada
          </Badge>
        )
      case "Em andamento":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            Em andamento
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Função para renderizar a prioridade com cores
  const renderPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case "Alta":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
            Alta
          </Badge>
        )
      case "Média":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            Média
          </Badge>
        )
      case "Baixa":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            Baixa
          </Badge>
        )
      default:
        return <Badge variant="outline">{prioridade}</Badge>
    }
  }

  // Função para exportar PDF
  const handleExportPDF = () => {
    toast({
      title: "Gerando PDF",
      description: "Preparando o documento para download...",
      variant: "default",
    })

    // Cria um elemento temporário para renderizar o conteúdo do PDF
    const printContent = document.createElement("div")
    printContent.className = "pdf-container"
    printContent.style.padding = "20px"
    printContent.style.fontFamily = "Arial, sans-serif"

    // Adiciona o cabeçalho
    const header = document.createElement("div")
    header.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;">
      <div>
        <h1 style="margin: 0; color: #333; font-size: 24px;">Relatório de Visita Técnica</h1>
        <p style="margin: 5px 0 0 0; color: #666;">Código: ${visita.id}</p>
      </div>
      <div>
        <p style="margin: 0; text-align: right; color: #666;">Data de geração: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
      </div>
    </div>
  `
    printContent.appendChild(header)

    // Adiciona as informações da visita
    const visitaInfo = document.createElement("div")
    visitaInfo.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h2 style="margin: 0 0 10px 0; color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Informações da Visita</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <p style="margin: 0; color: #666; font-size: 14px;">Empresa</p>
          <p style="margin: 0; font-weight: bold;">${visita.empresa}</p>
        </div>
        <div>
          <p style="margin: 0; color: #666; font-size: 14px;">Unidade</p>
          <p style="margin: 0; font-weight: bold;">${visita.unidade}</p>
        </div>
        <div>
          <p style="margin: 0; color: #666; font-size: 14px;">Data da Visita</p>
          <p style="margin: 0; font-weight: bold;">${format(visita.dataVisita, "dd/MM/yyyy", { locale: ptBR })}</p>
        </div>
        <div>
          <p style="margin: 0; color: #666; font-size: 14px;">Responsável</p>
          <p style="margin: 0; font-weight: bold;">${visita.responsavel}</p>
        </div>
        <div>
          <p style="margin: 0; color: #666; font-size: 14px;">Status</p>
          <p style="margin: 0; font-weight: bold;">${visita.status}</p>
        </div>
      </div>
      <div style="margin-top: 15px;">
        <p style="margin: 0; color: #666; font-size: 14px;">Observações</p>
        <p style="margin: 0;">${visita.observacoes}</p>
      </div>
    </div>
  `
    printContent.appendChild(visitaInfo)

    // Adiciona a tabela de ações
    const acoesSection = document.createElement("div")
    acoesSection.innerHTML = `
    <div>
      <h2 style="margin: 0 0 10px 0; color: #333; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Ações Registradas</h2>
      ${
        visita.acoes.length > 0
          ? `
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Tipo</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Problema</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Ação</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Responsável</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Data Prevista</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Prioridade</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${visita.acoes
              .map(
                (acao) => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${acao.tipo}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${acao.problema}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${acao.acao}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${acao.responsavel}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${format(acao.dataPrevisao, "dd/MM/yyyy", { locale: ptBR })}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${acao.prioridade}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${acao.resolvido ? "Resolvido" : "Pendente"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `
          : `
        <p style="text-align: center; color: #666; padding: 20px;">Nenhuma ação registrada para esta visita</p>
      `
      }
    </div>
  `
    printContent.appendChild(acoesSection)

    // Adiciona o rodapé
    const footer = document.createElement("div")
    footer.innerHTML = `
    <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; color: #666; font-size: 12px;">
      <p>Este documento foi gerado automaticamente pelo Sistema de Gestão de Visitas Técnicas.</p>
      <p>© ${new Date().getFullYear()} - Todos os direitos reservados</p>
    </div>
  `
    printContent.appendChild(footer)

    // Adiciona o conteúdo ao corpo do documento
    document.body.appendChild(printContent)

    // Configura o CSS para impressão
    const style = document.createElement("style")
    style.textContent = `
    @media print {
      body * {
        visibility: hidden;
      }
      .pdf-container, .pdf-container * {
        visibility: visible;
      }
      .pdf-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
    }
  `
    document.head.appendChild(style)

    // Inicia a impressão
    setTimeout(() => {
      window.print()

      // Remove os elementos temporários após a impressão
      setTimeout(() => {
        document.body.removeChild(printContent)
        document.head.removeChild(style)

        toast({
          title: "PDF gerado com sucesso",
          description: "Utilize a opção de salvar como PDF do seu navegador para baixar o arquivo.",
          variant: "default",
        })
      }, 500)
    }, 500)
  }

  // Função para gerar relatório
  const handleGenerateReport = () => {
    toast({
      title: "Gerando relatório",
      description: "Preparando o relatório detalhado...",
      variant: "default",
    })

    // Cria um elemento para o conteúdo do relatório
    const reportContent = document.createElement("div")
    reportContent.innerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Relatório de Visita Técnica - ${visita.id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0066cc; padding-bottom: 10px; margin-bottom: 20px; }
        .title { margin: 0; color: #0066cc; }
        .subtitle { margin: 5px 0 0 0; color: #666; }
        .date { text-align: right; color: #666; }
        .section { margin-bottom: 25px; }
        .section-title { margin: 0 0 15px 0; color: #0066cc; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .info-item { margin-bottom: 10px; }
        .info-label { margin: 0; color: #666; font-size: 0.9em; }
        .info-value { margin: 3px 0 0 0; font-weight: bold; }
        .observations { margin-top: 15px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background-color: #f0f0f0; text-align: left; padding: 10px; border: 1px solid #ddd; }
        td { padding: 10px; border: 1px solid #ddd; }
        .status-badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 0.85em; }
        .status-agendada { background-color: #e6f0ff; color: #0066cc; }
        .status-realizada { background-color: #e6ffe6; color: #008800; }
        .status-cancelada { background-color: #ffe6e6; color: #cc0000; }
        .status-andamento { background-color: #fff9e6; color: #cc7700; }
        .priority-alta { background-color: #ffe6e6; color: #cc0000; }
        .priority-media { background-color: #fff9e6; color: #cc7700; }
        .priority-baixa { background-color: #e6ffe6; color: #008800; }
        .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; color: #666; font-size: 0.8em; }
        .charts { display: flex; justify-content: space-between; margin: 20px 0; }
        .chart { width: 48%; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .chart-title { text-align: center; margin: 0 0 15px 0; color: #0066cc; }
        .summary-box { background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .summary-title { margin: 0 0 10px 0; color: #0066cc; }
        .summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; }
        .summary-item { text-align: center; }
        .summary-value { font-size: 1.5em; font-weight: bold; margin: 0; }
        .summary-label { margin: 5px 0 0 0; color: #666; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">Relatório de Visita Técnica</h1>
          <p class="subtitle">Código: ${visita.id}</p>
        </div>
        <div class="date">
          <p>Data de geração: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
        </div>
      </div>

      <div class="summary-box">
        <h2 class="summary-title">Resumo</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <p class="summary-value">${visita.acoes.length}</p>
            <p class="summary-label">Total de Ações</p>
          </div>
          <div class="summary-item">
            <p class="summary-value">${visita.acoes.filter((a) => a.resolvido).length}</p>
            <p class="summary-label">Ações Resolvidas</p>
          </div>
          <div class="summary-item">
            <p class="summary-value">${visita.acoes.filter((a) => !a.resolvido).length}</p>
            <p class="summary-label">Ações Pendentes</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Informações da Visita</h2>
        <div class="info-grid">
          <div class="info-item">
            <p class="info-label">Empresa</p>
            <p class="info-value">${visita.empresa}</p>
          </div>
          <div class="info-item">
            <p class="info-label">Unidade</p>
            <p class="info-value">${visita.unidade}</p>
          </div>
          <div class="info-item">
            <p class="info-label">Data da Visita</p>
            <p class="info-value">${format(visita.dataVisita, "dd/MM/yyyy", { locale: ptBR })}</p>
          </div>
          <div class="info-item">
            <p class="info-label">Responsável</p>
            <p class="info-value">${visita.responsavel}</p>
          </div>
          <div class="info-item">
            <p class="info-label">Status</p>
            <p class="info-value">
              <span class="status-badge status-${visita.status.toLowerCase().replace(" ", "-")}">
                ${visita.status}
              </span>
            </p>
          </div>
        </div>
        <div class="observations">
          <p class="info-label">Observações</p>
          <p>${visita.observacoes}</p>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Ações Registradas</h2>
        ${
          visita.acoes.length > 0
            ? `
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Problema</th>
                <th>Ação</th>
                <th>Responsável</th>
                <th>Data Prevista</th>
                <th>Prioridade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${visita.acoes
                .map(
                  (acao) => `
                <tr>
                  <td>${acao.tipo}</td>
                  <td>${acao.problema}</td>
                  <td>${acao.acao}</td>
                  <td>${acao.responsavel}</td>
                  <td>${format(acao.dataPrevisao, "dd/MM/yyyy", { locale: ptBR })}</td>
                  <td>
                    <span class="status-badge priority-${acao.prioridade.toLowerCase()}">
                      ${acao.prioridade}
                    </span>
                  </td>
                  <td>
                    <span class="status-badge ${acao.resolvido ? "status-realizada" : "status-agendada"}">
                      ${acao.resolvido ? "Resolvido" : "Pendente"}
                    </span>
                  </td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        `
            : `
          <p style="text-align: center; color: #666; padding: 20px;">Nenhuma ação registrada para esta visita</p>
        `
        }
      </div>

      <div class="footer">
        <p>Este documento foi gerado automaticamente pelo Sistema de Gestão de Visitas Técnicas.</p>
        <p>© ${new Date().getFullYear()} - Todos os direitos reservados</p>
      </div>
    </body>
    </html>
  `

    // Cria um Blob com o conteúdo HTML
    const blob = new Blob([reportContent.innerHTML], { type: "text/html" })

    // Cria um URL para o Blob
    const url = URL.createObjectURL(blob)

    // Cria um link para download
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-visita-${visita.id}-${format(new Date(), "dd-MM-yyyy", { locale: ptBR })}.html`

    // Adiciona o link ao documento e clica nele
    document.body.appendChild(a)
    a.click()

    // Remove o link e revoga o URL
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Relatório gerado com sucesso",
        description: "O arquivo foi baixado para o seu computador.",
        variant: "default",
      })
    }, 100)
  }

  // Função para editar
  const handleEdit = () => {
    router.push(`/registros/visita-tecnica/cadastrar?id=${visita.id}`)
  }

  // Função para voltar
  const handleBack = () => {
    router.push("/registros/visita-tecnica/listar")
  }

  // Função para abrir o modal de detalhes da ação
  const handleViewActionDetails = (acao: Acao) => {
    setSelectedAction(acao)
    setIsDetailsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Botões de ação */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Voltar
        </Button>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2">
            <Download size={16} />
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={handleGenerateReport} className="flex items-center gap-2">
            <FileText size={16} />
            Relatório
          </Button>
          <Button onClick={handleEdit} className="flex items-center gap-2">
            <Edit size={16} />
            Editar
          </Button>
        </div>
      </div>

      {/* Informações da visita */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Informações da Visita</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Empresa</p>
            <p className="font-medium">{visita.empresa}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Unidade</p>
            <p className="font-medium">{visita.unidade}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Data da Visita</p>
            <p className="font-medium">{format(visita.dataVisita, "dd/MM/yyyy", { locale: ptBR })}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Responsável</p>
            <p className="font-medium">{visita.responsavel}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <div>{renderStatus(visita.status)}</div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-1">Observações</p>
          <p className="text-gray-700">{visita.observacoes}</p>
        </div>
      </div>

      {/* Ações registradas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Ações Registradas</h2>

        {visita.acoes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Problema</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Data Prevista</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visita.acoes.map((acao) => (
                <TableRow key={acao.id}>
                  <TableCell>
                    <Badge variant={acao.tipo === "Anomalia" ? "destructive" : "default"}>{acao.tipo}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={acao.problema}>
                    {acao.problema}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={acao.acao}>
                    {acao.acao}
                  </TableCell>
                  <TableCell>{acao.responsavel}</TableCell>
                  <TableCell>{format(acao.dataPrevisao, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell>{renderPrioridade(acao.prioridade)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={acao.resolvido ? "outline" : "secondary"}
                      className={acao.resolvido ? "bg-green-50 text-green-700 border-green-300" : ""}
                    >
                      {acao.resolvido ? "Resolvido" : "Pendente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Ver detalhes"
                      onClick={() => handleViewActionDetails(acao)}
                    >
                      <Eye size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-gray-500">Nenhuma ação registrada para esta visita</div>
        )}
      </div>

      {/* Modal de detalhes da ação */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Ação</DialogTitle>
            <DialogDescription>Informações completas sobre a ação selecionada.</DialogDescription>
          </DialogHeader>

          {selectedAction && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tipo</h4>
                  <p className="mt-1">
                    <Badge variant={selectedAction.tipo === "Anomalia" ? "destructive" : "default"}>
                      {selectedAction.tipo}
                    </Badge>
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className="mt-1">
                    <Badge
                      variant={selectedAction.resolvido ? "outline" : "secondary"}
                      className={selectedAction.resolvido ? "bg-green-50 text-green-700 border-green-300" : ""}
                    >
                      {selectedAction.resolvido ? "Resolvido" : "Pendente"}
                    </Badge>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Problema</h4>
                <p className="mt-1">{selectedAction.problema}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Causa</h4>
                <p className="mt-1">{selectedAction.causa}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Ação</h4>
                <p className="mt-1">{selectedAction.acao}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Observação</h4>
                <p className="mt-1">{selectedAction.observacao}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Responsável</h4>
                  <p className="mt-1">{selectedAction.responsavel}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Data Prevista</h4>
                  <p className="mt-1">{format(selectedAction.dataPrevisao, "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Prioridade</h4>
                <p className="mt-1">{renderPrioridade(selectedAction.prioridade)}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

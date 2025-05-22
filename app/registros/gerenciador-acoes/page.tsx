"use client"

import { useState, useRef, useEffect } from "react"
import {
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowDownToLine,
  Paperclip,
  FileCheck,
  Clock,
} from "lucide-react"
import { EditarAcaoModal } from "@/components/acoes/editar-acao-modal"
import { useToast } from "@/hooks/use-toast"

export default function GerenciadorAcoes() {
  const [activeTab, setActiveTab] = useState("acoes")
  const [carregarImagens, setCarregarImagens] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isConsultando, setIsConsultando] = useState(false)
  const [showColumnFilter, setShowColumnFilter] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    acoes: {
      codigo: true,
      negocio: true,
      unidade: true,
      indicador: true,
      anomalia: true,
      causa: true,
      acao: true,
      responsavel: true,
      evidencia: true,
      itemChecklist: true,
      descricaoAnomalia: true,
      setor: true,
      previsao: true,
      realizado: true,
      criadaHa: true,
      procedimento: true,
      infraestrutura: true,
      prioridade: true,
      ordemServico: true,
      status: true,
      editar: true,
    },
    consolidadoLancamentos: {
      codigo: true,
      indicador: true,
      negocio: true,
      filialCentralizadora: true,
      filial: true,
      responsavel: true,
      data: true,
      status: true,
      qtdAcoes: true,
      qtdPendencias: true,
    },
    consolidadoUnidades: {
      negocio: true,
      unidadeCentralizadora: true,
      unidade: true,
      indicador: true,
      dataFimAuditoria: true,
      diasAposAuditoria: true,
      quantidadeNC: true,
      totalAcoes: true,
      realizadas: true,
      realizadasComAtraso: true,
      atrasadas: true,
      noPrazo: true,
      percentualResolvido: true,
    },
    consolidadoMensal: {
      unidade: true,
      mesAno: true,
      indicador: true,
      totalAcoes: true,
      realizadas: true,
      emAtraso: true,
      noPrazo: true,
      percentualRealizada: true,
    },
    historico: {
      codigo: true,
      acao: true,
      responsavelAnterior: true,
      novoResponsavel: true,
      dataTransferencia: true,
      quemAtualizou: true,
    },
  })
  const columnFilterRef = useRef(null)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const { toast } = useToast()

  // Dados de exemplo para a tabela com campos adicionais
  const acoes = [
    {
      codigo: "AC001",
      negocio: "Negócio A",
      unidade: "Unidade SP",
      indicador: "Indicador de Segurança",
      anomalia: "Falha no procedimento de segurança",
      causa: "Falta de treinamento",
      acao: "Realizar treinamento de reciclagem",
      responsavel: "João Silva",
      evidencia: "Foto_Evidencia_001.jpg",
      itemChecklist: "Item 3.2.1",
      descricaoAnomalia: "Funcionários sem utilização adequada de EPIs durante operação de máquinas",
      setor: "Produção",
      previsao: "10/05/2025",
      realizado: "08/05/2025",
      criadaHa: "30 dias",
      procedimento: "POP-SEG-001",
      infraestrutura: "Não",
      prioridade: "Alta",
      ordemServico: "OS-2025-0123",
      status: "Concluído",
    },
    {
      codigo: "AC002",
      negocio: "Negócio B",
      unidade: "Unidade RJ",
      indicador: "Indicador de Qualidade",
      anomalia: "Produto fora da especificação",
      causa: "Calibração incorreta do equipamento",
      acao: "Recalibrar equipamentos de medição",
      responsavel: "Maria Souza",
      evidencia: "Relatorio_Qualidade_002.pdf",
      itemChecklist: "Item 4.1.3",
      descricaoAnomalia: "Produtos com dimensões fora das especificações técnicas",
      setor: "Qualidade",
      previsao: "15/05/2025",
      realizado: "",
      criadaHa: "15 dias",
      procedimento: "POP-QUAL-002",
      infraestrutura: "Sim",
      prioridade: "Média",
      ordemServico: "OS-2025-0145",
      status: "Pendente",
    },
    {
      codigo: "AC003",
      negocio: "Negócio C",
      unidade: "Unidade MG",
      indicador: "Indicador de Produtividade",
      anomalia: "Queda na produção",
      causa: "Manutenção atrasada",
      acao: "Realizar manutenção preventiva",
      responsavel: "Carlos Oliveira",
      evidencia: "Grafico_Producao_003.png",
      itemChecklist: "Item 2.3.4",
      descricaoAnomalia: "Redução de 15% na produtividade da linha 3 nos últimos 30 dias",
      setor: "Manutenção",
      previsao: "05/05/2025",
      realizado: "",
      criadaHa: "7 dias",
      procedimento: "POP-MAN-003",
      infraestrutura: "Sim",
      prioridade: "Alta",
      ordemServico: "OS-2025-0167",
      status: "Atrasado",
    },
    {
      codigo: "AC004",
      negocio: "Negócio A",
      unidade: "Unidade SP",
      indicador: "Indicador de Segurança",
      anomalia: "Acidente de trabalho",
      causa: "Falta de EPI",
      acao: "Fornecer e fiscalizar uso de EPIs",
      responsavel: "Ana Pereira",
      evidencia: "Relatorio_Acidente_004.pdf",
      itemChecklist: "Item 3.1.2",
      descricaoAnomalia: "Acidente com operador por falta de luvas de proteção",
      setor: "Segurança",
      previsao: "20/05/2025",
      realizado: "",
      criadaHa: "3 dias",
      procedimento: "POP-SEG-005",
      infraestrutura: "Não",
      prioridade: "Alta",
      ordemServico: "OS-2025-0189",
      status: "Pendente",
    },
    {
      codigo: "AC005",
      negocio: "Negócio B",
      unidade: "Unidade RJ",
      indicador: "Indicador de Qualidade",
      anomalia: "Reclamação de cliente",
      causa: "Falha no controle de qualidade",
      acao: "Revisar processo de inspeção",
      responsavel: "Roberto Santos",
      evidencia: "Reclamacao_Cliente_005.pdf",
      itemChecklist: "Item 5.2.1",
      descricaoAnomalia: "Cliente relatou defeitos em 5% do lote entregue",
      setor: "Comercial",
      previsao: "12/05/2025",
      realizado: "11/05/2025",
      criadaHa: "10 dias",
      procedimento: "POP-COM-002",
      infraestrutura: "Não",
      prioridade: "Média",
      ordemServico: "OS-2025-0201",
      status: "Concluído",
    },
  ]

  const consolidadoLancamentos = [
    {
      codigo: "AC001",
      indicador: "Indicador de Segurança",
      negocio: "Negócio A",
      filialCentralizadora: "Matriz SP",
      filial: "Filial RJ",
      responsavel: "João Silva",
      data: "05/05/2025",
      status: "Pendente",
      qtdAcoes: 5,
      qtdPendencias: 2,
    },
    {
      codigo: "AC002",
      indicador: "Indicador de Qualidade",
      negocio: "Negócio B",
      filialCentralizadora: "Matriz RJ",
      filial: "Filial MG",
      responsavel: "Maria Souza",
      data: "10/05/2025",
      status: "Concluído",
      qtdAcoes: 3,
      qtdPendencias: 0,
    },
    {
      codigo: "AC003",
      indicador: "Indicador de Produtividade",
      negocio: "Negócio C",
      filialCentralizadora: "Matriz MG",
      filial: "Filial SP",
      responsavel: "Carlos Oliveira",
      data: "15/05/2025",
      status: "Atrasado",
      qtdAcoes: 7,
      qtdPendencias: 4,
    },
  ]

  // Dados de exemplo para Consolidado Unidades
  const consolidadoUnidades = [
    {
      negocio: "Negócio A",
      unidadeCentralizadora: "Matriz SP",
      unidade: "Filial SP-01",
      indicador: "Indicador de Segurança",
      dataFimAuditoria: "15/04/2025",
      diasAposAuditoria: 21,
      quantidadeNC: 8,
      totalAcoes: 12,
      realizadas: 5,
      realizadasComAtraso: 2,
      atrasadas: 3,
      noPrazo: 2,
      percentualResolvido: "58%",
    },
    {
      negocio: "Negócio B",
      unidadeCentralizadora: "Matriz RJ",
      unidade: "Filial RJ-02",
      indicador: "Indicador de Qualidade",
      dataFimAuditoria: "20/04/2025",
      diasAposAuditoria: 16,
      quantidadeNC: 5,
      totalAcoes: 7,
      realizadas: 4,
      realizadasComAtraso: 1,
      atrasadas: 1,
      noPrazo: 1,
      percentualResolvido: "71%",
    },
    {
      negocio: "Negócio C",
      unidadeCentralizadora: "Matriz MG",
      unidade: "Filial MG-01",
      indicador: "Indicador de Produtividade",
      dataFimAuditoria: "10/04/2025",
      diasAposAuditoria: 26,
      quantidadeNC: 10,
      totalAcoes: 15,
      realizadas: 8,
      realizadasComAtraso: 3,
      atrasadas: 4,
      noPrazo: 0,
      percentualResolvido: "73%",
    },
    {
      negocio: "Negócio A",
      unidadeCentralizadora: "Matriz SP",
      unidade: "Filial SP-02",
      indicador: "Indicador de Segurança",
      dataFimAuditoria: "25/04/2025",
      diasAposAuditoria: 11,
      quantidadeNC: 6,
      totalAcoes: 9,
      realizadas: 3,
      realizadasComAtraso: 0,
      atrasadas: 2,
      noPrazo: 4,
      percentualResolvido: "33%",
    },
  ]

  // Dados de exemplo para Consolidado Mensal
  const consolidadoMensal = [
    {
      unidade: "Filial SP-01",
      mesAno: "Maio/2025",
      indicador: "Indicador de Segurança",
      totalAcoes: 15,
      realizadas: 8,
      emAtraso: 3,
      noPrazo: 4,
      percentualRealizada: "53%",
    },
    {
      unidade: "Filial RJ-02",
      mesAno: "Maio/2025",
      indicador: "Indicador de Qualidade",
      totalAcoes: 12,
      realizadas: 10,
      emAtraso: 0,
      noPrazo: 2,
      percentualRealizada: "83%",
    },
    {
      unidade: "Filial MG-01",
      mesAno: "Maio/2025",
      indicador: "Indicador de Produtividade",
      totalAcoes: 18,
      realizadas: 12,
      emAtraso: 4,
      noPrazo: 2,
      percentualRealizada: "67%",
    },
    {
      unidade: "Filial SP-02",
      mesAno: "Abril/2025",
      indicador: "Indicador de Segurança",
      totalAcoes: 10,
      realizadas: 9,
      emAtraso: 1,
      noPrazo: 0,
      percentualRealizada: "90%",
    },
  ]

  // Dados de exemplo para Histórico
  const historico = [
    {
      codigo: "AC001",
      acao: "Realizar treinamento de reciclagem",
      responsavelAnterior: "João Silva",
      novoResponsavel: "Maria Souza",
      dataTransferencia: "05/04/2025",
      quemAtualizou: "Carlos Oliveira",
    },
    {
      codigo: "AC002",
      acao: "Recalibrar equipamentos de medição",
      responsavelAnterior: "Maria Souza",
      novoResponsavel: "Roberto Santos",
      dataTransferencia: "10/04/2025",
      quemAtualizou: "Ana Pereira",
    },
    {
      codigo: "AC003",
      acao: "Realizar manutenção preventiva",
      responsavelAnterior: "Carlos Oliveira",
      novoResponsavel: "João Silva",
      dataTransferencia: "15/04/2025",
      quemAtualizou: "Roberto Santos",
    },
    {
      codigo: "AC004",
      acao: "Fornecer e fiscalizar uso de EPIs",
      responsavelAnterior: "Ana Pereira",
      novoResponsavel: "Carlos Oliveira",
      dataTransferencia: "20/04/2025",
      quemAtualizou: "Maria Souza",
    },
    {
      codigo: "AC005",
      acao: "Revisar processo de inspeção",
      responsavelAnterior: "Roberto Santos",
      novoResponsavel: "Ana Pereira",
      dataTransferencia: "25/04/2025",
      quemAtualizou: "João Silva",
    },
  ]

  // Função para filtrar os dados com base no termo de busca
  const filterData = (data, term) => {
    if (!term.trim()) return data
    const lowerTerm = term.toLowerCase()

    return data.filter((item) => {
      // Verifica todas as propriedades do objeto
      return Object.values(item).some(
        (value) => value !== null && value !== undefined && value.toString().toLowerCase().includes(lowerTerm),
      )
    })
  }

  // Obter os dados filtrados com base na aba ativa
  const getFilteredData = () => {
    switch (activeTab) {
      case "acoes":
        return filterData(acoes, searchTerm)
      case "consolidadoLancamentos":
        return filterData(consolidadoLancamentos, searchTerm)
      case "consolidadoUnidades":
        return filterData(consolidadoUnidades, searchTerm)
      case "consolidadoMensal":
        return filterData(consolidadoMensal, searchTerm)
      case "historico":
        return filterData(historico, searchTerm)
      default:
        return []
    }
  }

  // Função para exportar dados para CSV
  const exportToCSV = () => {
    const filteredData = getFilteredData()
    if (filteredData.length === 0) {
      toast({
        title: "Atenção",
        description: "Não há dados para exportar.",
        variant: "destructive",
      })
      return
    }

    // Obter cabeçalhos com base na aba ativa
    let headers = []
    switch (activeTab) {
      case "acoes":
        // Incluir apenas os cabeçalhos das colunas visíveis
        if (visibleColumns.acoes.codigo) headers.push("Código")
        if (visibleColumns.acoes.negocio) headers.push("Negócio")
        if (visibleColumns.acoes.unidade) headers.push("Unidade")
        if (visibleColumns.acoes.indicador) headers.push("Indicador")
        if (visibleColumns.acoes.anomalia) headers.push("Anomalia")
        if (visibleColumns.acoes.causa) headers.push("Causa")
        if (visibleColumns.acoes.acao) headers.push("Ação")
        if (visibleColumns.acoes.responsavel) headers.push("Responsável")
        if (visibleColumns.acoes.evidencia) headers.push("Evidência")
        if (visibleColumns.acoes.itemChecklist) headers.push("Item Checklist")
        if (visibleColumns.acoes.descricaoAnomalia) headers.push("Descrição Anomalia")
        if (visibleColumns.acoes.setor) headers.push("Setor")
        if (visibleColumns.acoes.previsao) headers.push("Previsão")
        if (visibleColumns.acoes.realizado) headers.push("Realizado")
        if (visibleColumns.acoes.criadaHa) headers.push("Criada há")
        if (visibleColumns.acoes.procedimento) headers.push("Procedimento")
        if (visibleColumns.acoes.infraestrutura) headers.push("Infraestrutura")
        if (visibleColumns.acoes.prioridade) headers.push("Prioridade")
        if (visibleColumns.acoes.ordemServico) headers.push("Ordem de Serviço")
        if (visibleColumns.acoes.status) headers.push("Status")
        break
      case "consolidadoLancamentos":
        if (visibleColumns.consolidadoLancamentos.codigo) headers.push("Código")
        if (visibleColumns.consolidadoLancamentos.indicador) headers.push("Indicador")
        if (visibleColumns.consolidadoLancamentos.negocio) headers.push("Negócio")
        if (visibleColumns.consolidadoLancamentos.filialCentralizadora) headers.push("Filial Centralizadora")
        if (visibleColumns.consolidadoLancamentos.filial) headers.push("Filial")
        if (visibleColumns.consolidadoLancamentos.responsavel) headers.push("Responsável")
        if (visibleColumns.consolidadoLancamentos.data) headers.push("Data")
        if (visibleColumns.consolidadoLancamentos.status) headers.push("Status")
        if (visibleColumns.consolidadoLancamentos.qtdAcoes) headers.push("QTD ações")
        if (visibleColumns.consolidadoLancamentos.qtdPendencias) headers.push("QTD das Pendências")
        break
      case "consolidadoUnidades":
        if (visibleColumns.consolidadoUnidades.negocio) headers.push("Negócio")
        if (visibleColumns.consolidadoUnidades.unidadeCentralizadora) headers.push("Unidade Centralizadora")
        if (visibleColumns.consolidadoUnidades.unidade) headers.push("Unidade")
        if (visibleColumns.consolidadoUnidades.indicador) headers.push("Indicador")
        if (visibleColumns.consolidadoUnidades.dataFimAuditoria) headers.push("Data fim Auditoria")
        if (visibleColumns.consolidadoUnidades.diasAposAuditoria) headers.push("Dias após auditoria")
        if (visibleColumns.consolidadoUnidades.quantidadeNC) headers.push("Quantidade NC")
        if (visibleColumns.consolidadoUnidades.totalAcoes) headers.push("Total Ações")
        if (visibleColumns.consolidadoUnidades.realizadas) headers.push("Realizadas")
        if (visibleColumns.consolidadoUnidades.realizadasComAtraso) headers.push("Realizadas com Atraso")
        if (visibleColumns.consolidadoUnidades.atrasadas) headers.push("Atrasadas")
        if (visibleColumns.consolidadoUnidades.noPrazo) headers.push("No Prazo")
        if (visibleColumns.consolidadoUnidades.percentualResolvido) headers.push("% Resolvido")
        break
      case "consolidadoMensal":
        if (visibleColumns.consolidadoMensal.unidade) headers.push("Unidade")
        if (visibleColumns.consolidadoMensal.mesAno) headers.push("Mês/Ano")
        if (visibleColumns.consolidadoMensal.indicador) headers.push("Indicador")
        if (visibleColumns.consolidadoMensal.totalAcoes) headers.push("Total das Ações")
        if (visibleColumns.consolidadoMensal.realizadas) headers.push("Realizadas")
        if (visibleColumns.consolidadoMensal.emAtraso) headers.push("Em Atraso")
        if (visibleColumns.consolidadoMensal.noPrazo) headers.push("No Prazo")
        if (visibleColumns.consolidadoMensal.percentualRealizada) headers.push("% Realizada")
        break
      case "historico":
        if (visibleColumns.historico.codigo) headers.push("Código")
        if (visibleColumns.historico.acao) headers.push("Ação")
        if (visibleColumns.historico.responsavelAnterior) headers.push("Responsável Anterior")
        if (visibleColumns.historico.novoResponsavel) headers.push("Novo Responsável")
        if (visibleColumns.historico.dataTransferencia) headers.push("Data Transferência")
        if (visibleColumns.historico.quemAtualizou) headers.push("Quem Atualizou")
        break
      default:
        headers = Object.keys(filteredData[0])
    }

    // Converter dados para formato CSV
    const csvRows = []

    // Adicionar cabeçalhos
    csvRows.push(headers.join(","))

    // Adicionar linhas de dados
    filteredData.forEach((item) => {
      const values = headers.map((header) => {
        // Mapear cabeçalhos para propriedades do objeto
        const prop = header
          .toLowerCase()
          .replace(/ /g, "")
          .replace(/[áàãâä]/g, "a")
          .replace(/[éèêë]/g, "e")
          .replace(/[íìîï]/g, "i")
          .replace(/[óòõôö]/g, "o")
          .replace(/[úùûü]/g, "u")
          .replace(/[ç]/g, "c")
          .replace(/[%]/g, "percentual")

        // Encontrar a propriedade correspondente no objeto
        const propKey = Object.keys(item).find(
          (key) => key.toLowerCase() === prop || key.toLowerCase().includes(prop) || prop.includes(key.toLowerCase()),
        )

        const value = propKey ? item[propKey] : ""

        // Escapar aspas e adicionar aspas ao redor de strings com vírgulas
        const escaped = ("" + value).replace(/"/g, '""')
        return `"${escaped}"`
      })
      csvRows.push(values.join(","))
    })

    // Criar blob e link para download
    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    // Definir nome do arquivo com base na aba ativa
    const fileName = `${activeTab}_${new Date().toISOString().split("T")[0]}.csv`

    link.setAttribute("href", url)
    link.setAttribute("download", fileName)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Dados filtrados para uso nas tabelas
  const filteredData = getFilteredData()

  // Atualizar a função renderPagination para incluir historico
  const renderPagination = () => {
    // Determinar o número total de itens com base nos dados filtrados
    const totalItems = filteredData.length

    // Calcular o número total de páginas
    const effectiveItemsPerPage = itemsPerPage === 0 ? totalItems : itemsPerPage
    const totalPages = Math.max(1, Math.ceil(totalItems / effectiveItemsPerPage))

    // Limitar o número de botões de página para evitar arrays muito grandes
    const maxPageButtons = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

    // Ajustar startPage se necessário
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1)
    }

    // Criar array de páginas a serem exibidas
    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 gap-4">
        <div className="flex items-center space-x-2">
          <button
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              itemsPerPage === 10 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setItemsPerPage(10)}
          >
            10
          </button>
          <button
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              itemsPerPage === 15 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setItemsPerPage(15)}
          >
            15
          </button>
          <button
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              itemsPerPage === 25 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setItemsPerPage(25)}
          >
            25
          </button>
          <button
            className={`px-3 h-8 flex items-center justify-center rounded-full ${
              itemsPerPage === 0 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setItemsPerPage(0)}
          >
            All
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Página {currentPage} de {totalPages} ({totalItems} registros)
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Renderizar botões de página de forma segura */}
          {pages.map((page) => (
            <button
              key={page}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                currentPage === page ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  // Função para lidar com o clique no botão consultar
  const handleConsultar = () => {
    // Indica que está consultando
    setIsConsultando(true)

    // Simula um tempo de processamento
    setTimeout(() => {
      // Reseta a paginação para a primeira página
      setCurrentPage(1)

      // Aqui você implementaria a lógica real de filtragem com base nos filtros selecionados
      // Por enquanto, apenas mostramos uma notificação de sucesso
      toast({
        title: "Consulta realizada",
        description: "Consulta realizada com sucesso!",
        variant: "success",
      })

      // Finaliza o estado de consulta
      setIsConsultando(false)
    }, 800)
  }

  const handleEditAction = (acao: any) => {
    console.log("Dados da ação sendo editada:", acao)
    // Certifique-se de que todos os dados estão sendo passados
    setCurrentAction({ ...acao })
    setEditModalOpen(true)
  }

  // Função para fechar o popover quando clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (columnFilterRef.current && !columnFilterRef.current.contains(event.target)) {
        setShowColumnFilter(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSaveEditedAction = (updatedAction) => {
    // Atualiza os dados da ação no array de ações
    const updatedAcoes = acoes.map((item) => {
      if (item.codigo === currentAction.codigo) {
        return { ...item, ...updatedAction }
      }
      return item
    })

    // Aqui você implementaria a lógica real para salvar no banco de dados
    console.log("Ação editada salva:", updatedAction)

    // Exibe mensagem de confirmação usando toast com variante success (verde)
    toast({
      title: "Sucesso!",
      description: "Ação salva com sucesso.",
      variant: "success",
    })

    setEditModalOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Gerenciador de Ações</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="mt-2 sm:mt-0 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              <SlidersHorizontal size={16} />
              {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </button>
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Negócio</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione...</option>
                    <option value="negocio1">Negócio 1</option>
                    <option value="negocio2">Negócio 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidade Centralizadora</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione...</option>
                    <option value="unidade1">Unidade 1</option>
                    <option value="unidade2">Unidade 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione...</option>
                    <option value="unidade1">Unidade 1</option>
                    <option value="unidade2">Unidade 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Indicador</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione...</option>
                    <option value="indicador1">Indicador 1</option>
                    <option value="indicador2">Indicador 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione...</option>
                    <option value="resp1">Responsável 1</option>
                    <option value="resp2">Responsável 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="2025-01-05"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fim</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="2025-05-06"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione...</option>
                    <option value="pendente">Pendente</option>
                    <option value="concluido">Concluído</option>
                    <option value="atrasado">Atrasado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade Ação</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione...</option>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <input
                    type="checkbox"
                    id="carregarImagens"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={carregarImagens}
                    onChange={(e) => setCarregarImagens(e.target.checked)}
                  />
                  <label htmlFor="carregarImagens" className="ml-2 block text-sm text-gray-700">
                    Carregar Imagens Ação
                  </label>
                </div>

                <button
                  onClick={handleConsultar}
                  disabled={isConsultando}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 shadow-sm flex items-center"
                >
                  {isConsultando ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      CONSULTANDO...
                    </>
                  ) : (
                    "CONSULTAR"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Abas */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex overflow-x-auto hide-scrollbar">
              <button
                className={`py-3 px-4 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === "acoes"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("acoes")}
              >
                AÇÕES
              </button>
              <button
                className={`py-3 px-4 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === "consolidadoLancamentos"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("consolidadoLancamentos")}
              >
                CONSOLIDADO LANÇAMENTOS
              </button>
              <button
                className={`py-3 px-4 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === "consolidadoUnidades"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("consolidadoUnidades")}
              >
                CONSOLIDADO UNIDADES
              </button>
              <button
                className={`py-3 px-4 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === "consolidadoMensal"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("consolidadoMensal")}
              >
                CONSOLIDADO MENSAL
              </button>
              <button
                className={`py-3 px-4 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === "historico"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("historico")}
              >
                HISTÓRICO
              </button>
            </nav>
          </div>

          {/* Botões e busca */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div className="w-full sm:w-auto relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={exportToCSV}
                className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                title="Exportar para CSV"
              >
                <ArrowDownToLine size={18} />
              </button>
              <button
                onClick={() => setShowColumnFilter(!showColumnFilter)}
                className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors relative"
                title="Filtrar colunas"
              >
                <FileText size={18} />

                {/* Popover de filtro de colunas */}
                {showColumnFilter && (
                  <div
                    ref={columnFilterRef}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200 p-4"
                  >
                    <h3 className="font-medium text-gray-800 mb-2">Selecionar colunas visíveis</h3>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="space-y-2">
                        {activeTab === "acoes" && (
                          <>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-codigo"
                                checked={visibleColumns.acoes.codigo}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, codigo: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-codigo" className="ml-2 block text-sm text-gray-700">
                                Código
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-negocio"
                                checked={visibleColumns.acoes.negocio}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, negocio: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-negocio" className="ml-2 block text-sm text-gray-700">
                                Negócio
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-unidade"
                                checked={visibleColumns.acoes.unidade}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, unidade: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-unidade" className="ml-2 block text-sm text-gray-700">
                                Unidade
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-indicador"
                                checked={visibleColumns.acoes.indicador}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, indicador: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-indicador" className="ml-2 block text-sm text-gray-700">
                                Indicador
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-anomalia"
                                checked={visibleColumns.acoes.anomalia}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, anomalia: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-anomalia" className="ml-2 block text-sm text-gray-700">
                                Anomalia
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-causa"
                                checked={visibleColumns.acoes.causa}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, causa: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-causa" className="ml-2 block text-sm text-gray-700">
                                Causa
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-acao"
                                checked={visibleColumns.acoes.acao}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, acao: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-acao" className="ml-2 block text-sm text-gray-700">
                                Ação
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-responsavel"
                                checked={visibleColumns.acoes.responsavel}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, responsavel: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-responsavel" className="ml-2 block text-sm text-gray-700">
                                Responsável
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-evidencia"
                                checked={visibleColumns.acoes.evidencia}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, evidencia: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-evidencia" className="ml-2 block text-sm text-gray-700">
                                Evidência
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-itemChecklist"
                                checked={visibleColumns.acoes.itemChecklist}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, itemChecklist: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-itemChecklist" className="ml-2 block text-sm text-gray-700">
                                Item Checklist
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-descricaoAnomalia"
                                checked={visibleColumns.acoes.descricaoAnomalia}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, descricaoAnomalia: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-descricaoAnomalia" className="ml-2 block text-sm text-gray-700">
                                Descrição Anomalia
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-setor"
                                checked={visibleColumns.acoes.setor}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, setor: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-setor" className="ml-2 block text-sm text-gray-700">
                                Setor
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-previsao"
                                checked={visibleColumns.acoes.previsao}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, previsao: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-previsao" className="ml-2 block text-sm text-gray-700">
                                Previsão
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-realizado"
                                checked={visibleColumns.acoes.realizado}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, realizado: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-realizado" className="ml-2 block text-sm text-gray-700">
                                Realizado
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-criadaHa"
                                checked={visibleColumns.acoes.criadaHa}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, criadaHa: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-criadaHa" className="ml-2 block text-sm text-gray-700">
                                Criada há
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-procedimento"
                                checked={visibleColumns.acoes.procedimento}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, procedimento: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-procedimento" className="ml-2 block text-sm text-gray-700">
                                Procedimento
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-infraestrutura"
                                checked={visibleColumns.acoes.infraestrutura}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, infraestrutura: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-infraestrutura" className="ml-2 block text-sm text-gray-700">
                                Infraestrutura
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-prioridade"
                                checked={visibleColumns.acoes.prioridade}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, prioridade: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-prioridade" className="ml-2 block text-sm text-gray-700">
                                Prioridade
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-ordemServico"
                                checked={visibleColumns.acoes.ordemServico}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, ordemServico: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-ordemServico" className="ml-2 block text-sm text-gray-700">
                                Ordem de Serviço
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-status"
                                checked={visibleColumns.acoes.status}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, status: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-status" className="ml-2 block text-sm text-gray-700">
                                Status
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-editar"
                                checked={visibleColumns.acoes.editar}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    acoes: { ...visibleColumns.acoes, editar: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-editar" className="ml-2 block text-sm text-gray-700">
                                Editar
                              </label>
                            </div>
                          </>
                        )}

                        {activeTab === "consolidadoLancamentos" && (
                          <>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cl-codigo"
                                checked={visibleColumns.consolidadoLancamentos.codigo}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoLancamentos: {
                                      ...visibleColumns.consolidadoLancamentos,
                                      codigo: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cl-codigo" className="ml-2 block text-sm text-gray-700">
                                Código
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cl-indicador"
                                checked={visibleColumns.consolidadoLancamentos.indicador}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoLancamentos: {
                                      ...visibleColumns.consolidadoLancamentos,
                                      indicador: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cl-indicador" className="ml-2 block text-sm text-gray-700">
                                Indicador
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cl-negocio"
                                checked={visibleColumns.consolidadoLancamentos.negocio}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoLancamentos: {
                                      ...visibleColumns.consolidadoLancamentos,
                                      negocio: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cl-negocio" className="ml-2 block text-sm text-gray-700">
                                Negócio
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cl-filialCentralizadora"
                                checked={visibleColumns.consolidadoLancamentos.filialCentralizadora}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoLancamentos: {
                                      ...visibleColumns.consolidadoLancamentos,
                                      filialCentralizadora: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cl-filialCentralizadora" className="ml-2 block text-sm text-gray-700">
                                Filial Centralizadora
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cl-filial"
                                checked={visibleColumns.consolidadoLancamentos.filial}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoLancamentos: {
                                      ...visibleColumns.consolidadoLancamentos,
                                      filial: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cl-filial" className="ml-2 block text-sm text-gray-700">
                                Filial
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cl-responsavel"
                                checked={visibleColumns.consolidadoLancamentos.responsavel}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoLancamentos: {
                                      ...visibleColumns.consolidadoLancamentos,
                                      responsavel: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cl-responsavel" className="ml-2 block text-sm text-gray-700">
                                Responsável
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cl-data"
                                checked={visibleColumns.consolidadoLancamentos.data}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoLancamentos: {
                                      ...visibleColumns.consolidadoLancamentos,
                                      data: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cl-data" className="ml-2 block text-sm text-gray-700">
                                Data
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cl-status"
                                checked={visibleColumns.consolidadoLancamentos.status}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoLancamentos: {
                                      ...visibleColumns.consolidadoLancamentos,
                                      status: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cl-status" className="ml-2 block text-sm text-gray-700">
                                Status
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cl-qtdAcoes"
                                checked={visibleColumns.consolidadoLancamentos.qtdAcoes}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoLancamentos: {
                                      ...visibleColumns.consolidadoLancamentos,
                                      qtdAcoes: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cl-qtdAcoes" className="ml-2 block text-sm text-gray-700">
                                QTD ações
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cl-qtdPendencias"
                                checked={visibleColumns.consolidadoLancamentos.qtdPendencias}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoLancamentos: {
                                      ...visibleColumns.consolidadoLancamentos,
                                      qtdPendencias: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cl-qtdPendencias" className="ml-2 block text-sm text-gray-700">
                                QTD das Pendências
                              </label>
                            </div>
                          </>
                        )}

                        {activeTab === "consolidadoUnidades" && (
                          <>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cu-negocio"
                                checked={visibleColumns.consolidadoUnidades.negocio}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoUnidades: {
                                      ...visibleColumns.consolidadoUnidades,
                                      negocio: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cu-negocio" className="ml-2 block text-sm text-gray-700">
                                Negócio
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cu-unidadeCentralizadora"
                                checked={visibleColumns.consolidadoUnidades.unidadeCentralizadora}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoUnidades: {
                                      ...visibleColumns.consolidadoUnidades,
                                      unidadeCentralizadora: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor="col-cu-unidadeCentralizadora"
                                className="ml-2 block text-sm text-gray-700"
                              >
                                Unidade Centralizadora
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cu-unidade"
                                checked={visibleColumns.consolidadoUnidades.unidade}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoUnidades: {
                                      ...visibleColumns.consolidadoUnidades,
                                      unidade: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cu-unidade" className="ml-2 block text-sm text-gray-700">
                                Unidade
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cu-indicador"
                                checked={visibleColumns.consolidadoUnidades.indicador}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoUnidades: {
                                      ...visibleColumns.consolidadoUnidades,
                                      indicador: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cu-indicador" className="ml-2 block text-sm text-gray-700">
                                Indicador
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cu-dataFimAuditoria"
                                checked={visibleColumns.consolidadoUnidades.dataFimAuditoria}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoUnidades: {
                                      ...visibleColumns.consolidadoUnidades,
                                      dataFimAuditoria: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cu-dataFimAuditoria" className="ml-2 block text-sm text-gray-700">
                                Data fim Auditoria
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cu-diasAposAuditoria"
                                checked={visibleColumns.consolidadoUnidades.diasAposAuditoria}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoUnidades: {
                                      ...visibleColumns.consolidadoUnidades,
                                      diasAposAuditoria: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cu-diasAposAuditoria" className="ml-2 block text-sm text-gray-700">
                                Dias após auditoria
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cu-quantidadeNC"
                                checked={visibleColumns.consolidadoUnidades.quantidadeNC}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoUnidades: {
                                      ...visibleColumns.consolidadoUnidades,
                                      quantidadeNC: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cu-quantidadeNC" className="ml-2 block text-sm text-gray-700">
                                Quantidade NC
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cu-totalAcoes"
                                checked={visibleColumns.consolidadoUnidades.totalAcoes}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoUnidades: {
                                      ...visibleColumns.consolidadoUnidades,
                                      totalAcoes: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cu-totalAcoes" className="ml-2 block text-sm text-gray-700">
                                Total Ações
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cu-realizadas"
                                checked={visibleColumns.consolidadoUnidades.realizadas}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoUnidades: {
                                      ...visibleColumns.consolidadoUnidades,
                                      realizadas: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cu-realizadas" className="ml-2 block text-sm text-gray-700">
                                Realizadas
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cu-realizadasComAtraso"
                                checked={visibleColumns.consolidadoUnidades.realizadasComAtraso}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoUnidades: {
                                      ...visibleColumns.consolidadoUnidades,
                                      realizadasComAtraso: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cu-realizadasComAtraso" className="ml-2 block text-sm text-gray-700">
                                Realizadas com Atraso
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cu-atrasadas"
                                checked={visibleColumns.consolidadoUnidades.atrasadas}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoUnidades: {
                                      ...visibleColumns.consolidadoUnidades,
                                      atrasadas: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cu-atrasadas" className="ml-2 block text-sm text-gray-700">
                                Atrasadas
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cu-noPrazo"
                                checked={visibleColumns.consolidadoUnidades.noPrazo}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoUnidades: {
                                      ...visibleColumns.consolidadoUnidades,
                                      noPrazo: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cu-noPrazo" className="ml-2 block text-sm text-gray-700">
                                No Prazo
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cu-percentualResolvido"
                                checked={visibleColumns.consolidadoUnidades.percentualResolvido}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoUnidades: {
                                      ...visibleColumns.consolidadoUnidades,
                                      percentualResolvido: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cu-percentualResolvido" className="ml-2 block text-sm text-gray-700">
                                % Resolvido
                              </label>
                            </div>
                          </>
                        )}

                        {activeTab === "consolidadoMensal" && (
                          <>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cm-unidade"
                                checked={visibleColumns.consolidadoMensal.unidade}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoMensal: {
                                      ...visibleColumns.consolidadoMensal,
                                      unidade: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cm-unidade" className="ml-2 block text-sm text-gray-700">
                                Unidade
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cm-mesAno"
                                checked={visibleColumns.consolidadoMensal.mesAno}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoMensal: {
                                      ...visibleColumns.consolidadoMensal,
                                      mesAno: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cm-mesAno" className="ml-2 block text-sm text-gray-700">
                                Mês/Ano
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cm-indicador"
                                checked={visibleColumns.consolidadoMensal.indicador}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoMensal: {
                                      ...visibleColumns.consolidadoMensal,
                                      indicador: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cm-indicador" className="ml-2 block text-sm text-gray-700">
                                Indicador
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cm-totalAcoes"
                                checked={visibleColumns.consolidadoMensal.totalAcoes}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoMensal: {
                                      ...visibleColumns.consolidadoMensal,
                                      totalAcoes: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cm-totalAcoes" className="ml-2 block text-sm text-gray-700">
                                Total das Ações
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cm-realizadas"
                                checked={visibleColumns.consolidadoMensal.realizadas}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoMensal: {
                                      ...visibleColumns.consolidadoMensal,
                                      realizadas: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cm-realizadas" className="ml-2 block text-sm text-gray-700">
                                Realizadas
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cm-emAtraso"
                                checked={visibleColumns.consolidadoMensal.emAtraso}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoMensal: {
                                      ...visibleColumns.consolidadoMensal,
                                      emAtraso: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cm-emAtraso" className="ml-2 block text-sm text-gray-700">
                                Em Atraso
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cm-noPrazo"
                                checked={visibleColumns.consolidadoMensal.noPrazo}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoMensal: {
                                      ...visibleColumns.consolidadoMensal,
                                      noPrazo: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cm-noPrazo" className="ml-2 block text-sm text-gray-700">
                                No Prazo
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-cm-percentualRealizada"
                                checked={visibleColumns.consolidadoMensal.percentualRealizada}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    consolidadoMensal: {
                                      ...visibleColumns.consolidadoMensal,
                                      percentualRealizada: e.target.checked,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-cm-percentualRealizada" className="ml-2 block text-sm text-gray-700">
                                % Realizada
                              </label>
                            </div>
                          </>
                        )}

                        {activeTab === "historico" && (
                          <>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-h-codigo"
                                checked={visibleColumns.historico.codigo}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    historico: { ...visibleColumns.historico, codigo: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-h-codigo" className="ml-2 block text-sm text-gray-700">
                                Código
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-h-acao"
                                checked={visibleColumns.historico.acao}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    historico: { ...visibleColumns.historico, acao: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-h-acao" className="ml-2 block text-sm text-gray-700">
                                Ação
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-h-responsavelAnterior"
                                checked={visibleColumns.historico.responsavelAnterior}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    historico: { ...visibleColumns.historico, responsavelAnterior: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-h-responsavelAnterior" className="ml-2 block text-sm text-gray-700">
                                Responsável Anterior
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-h-novoResponsavel"
                                checked={visibleColumns.historico.novoResponsavel}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    historico: { ...visibleColumns.historico, novoResponsavel: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-h-novoResponsavel" className="ml-2 block text-sm text-gray-700">
                                Novo Responsável
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-h-dataTransferencia"
                                checked={visibleColumns.historico.dataTransferencia}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    historico: { ...visibleColumns.historico, dataTransferencia: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-h-dataTransferencia" className="ml-2 block text-sm text-gray-700">
                                Data Transferência
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="col-h-quemAtualizou"
                                checked={visibleColumns.historico.quemAtualizou}
                                onChange={(e) =>
                                  setVisibleColumns({
                                    ...visibleColumns,
                                    historico: { ...visibleColumns.historico, quemAtualizou: e.target.checked },
                                  })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="col-h-quemAtualizou" className="ml-2 block text-sm text-gray-700">
                                Quem Atualizou
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => {
                          const allTrue = {}
                          Object.keys(visibleColumns[activeTab]).forEach((key) => {
                            allTrue[key] = true
                          })
                          setVisibleColumns({
                            ...visibleColumns,
                            [activeTab]: allTrue,
                          })
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Selecionar todos
                      </button>
                      <button
                        onClick={() => {
                          // Configuração padrão para cada tipo de tabela
                          let defaultColumns = {}

                          if (activeTab === "acoes") {
                            defaultColumns = {
                              codigo: true,
                              negocio: false,
                              unidade: false,
                              indicador: false,
                              anomalia: false,
                              causa: false,
                              acao: true,
                              responsavel: true,
                              evidencia: false,
                              itemChecklist: false,
                              descricaoAnomalia: false,
                              setor: false,
                              previsao: true,
                              realizado: true,
                              criadaHa: false,
                              procedimento: false,
                              infraestrutura: false,
                              prioridade: true,
                              ordemServico: false,
                              status: true,
                              editar: true,
                            }
                          } else if (activeTab === "consolidadoLancamentos") {
                            defaultColumns = {
                              codigo: true,
                              indicador: true,
                              negocio: true,
                              filialCentralizadora: false,
                              filial: true,
                              responsavel: true,
                              data: true,
                              status: true,
                              qtdAcoes: true,
                              qtdPendencias: true,
                            }
                          } else if (activeTab === "consolidadoUnidades") {
                            defaultColumns = {
                              negocio: true,
                              unidadeCentralizadora: false,
                              unidade: true,
                              indicador: true,
                              dataFimAuditoria: true,
                              diasAposAuditoria: false,
                              quantidadeNC: true,
                              totalAcoes: true,
                              realizadas: true,
                              realizadasComAtraso: false,
                              atrasadas: true,
                              noPrazo: true,
                              percentualResolvido: true,
                            }
                          } else if (activeTab === "consolidadoMensal") {
                            defaultColumns = {
                              unidade: true,
                              mesAno: true,
                              indicador: true,
                              totalAcoes: true,
                              realizadas: true,
                              emAtraso: true,
                              noPrazo: true,
                              percentualRealizada: true,
                            }
                          } else if (activeTab === "historico") {
                            defaultColumns = {
                              codigo: true,
                              acao: true,
                              responsavelAnterior: true,
                              novoResponsavel: true,
                              dataTransferencia: true,
                              quemAtualizou: true,
                            }
                          }

                          setVisibleColumns({
                            ...visibleColumns,
                            [activeTab]: defaultColumns,
                          })
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Padrão
                      </button>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            {activeTab === "acoes" && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.acoes.codigo && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Código
                      </th>
                    )}
                    {visibleColumns.acoes.negocio && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Negócio
                      </th>
                    )}
                    {visibleColumns.acoes.unidade && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Unidade
                      </th>
                    )}
                    {visibleColumns.acoes.indicador && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Indicador
                      </th>
                    )}
                    {visibleColumns.acoes.anomalia && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Anomalia
                      </th>
                    )}
                    {visibleColumns.acoes.causa && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Causa
                      </th>
                    )}
                    {visibleColumns.acoes.acao && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ação
                      </th>
                    )}
                    {visibleColumns.acoes.responsavel && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Responsável
                      </th>
                    )}
                    {visibleColumns.acoes.evidencia && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Evidência
                      </th>
                    )}
                    {visibleColumns.acoes.itemChecklist && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Item Checklist
                      </th>
                    )}
                    {visibleColumns.acoes.descricaoAnomalia && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Descrição Anomalia
                      </th>
                    )}
                    {visibleColumns.acoes.setor && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Setor
                      </th>
                    )}
                    {visibleColumns.acoes.previsao && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Previsão
                      </th>
                    )}
                    {visibleColumns.acoes.realizado && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Realizado
                      </th>
                    )}
                    {visibleColumns.acoes.criadaHa && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Criada há
                      </th>
                    )}
                    {visibleColumns.acoes.procedimento && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Procedimento
                      </th>
                    )}
                    {visibleColumns.acoes.infraestrutura && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Infraestrutura
                      </th>
                    )}
                    {visibleColumns.acoes.prioridade && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Prioridade
                      </th>
                    )}
                    {visibleColumns.acoes.ordemServico && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ordem de Serviço
                      </th>
                    )}
                    {visibleColumns.acoes.status && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    )}
                    {visibleColumns.acoes.editar && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Editar
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((acao, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {visibleColumns.acoes.codigo && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acao.codigo}</td>
                        )}
                        {visibleColumns.acoes.negocio && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acao.negocio}</td>
                        )}
                        {visibleColumns.acoes.unidade && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acao.unidade}</td>
                        )}
                        {visibleColumns.acoes.indicador && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acao.indicador}</td>
                        )}
                        {visibleColumns.acoes.anomalia && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acao.anomalia}</td>
                        )}
                        {visibleColumns.acoes.causa && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acao.causa}</td>
                        )}
                        {visibleColumns.acoes.acao && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acao.acao}</td>
                        )}
                        {visibleColumns.acoes.responsavel && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acao.responsavel}</td>
                        )}
                        {visibleColumns.acoes.evidencia && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Paperclip size={14} className="mr-1 text-gray-500" />
                              {acao.evidencia}
                            </div>
                          </td>
                        )}
                        {visibleColumns.acoes.itemChecklist && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <FileCheck size={14} className="mr-1 text-gray-500" />
                              {acao.itemChecklist}
                            </div>
                          </td>
                        )}
                        {visibleColumns.acoes.descricaoAnomalia && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {acao.descricaoAnomalia}
                          </td>
                        )}
                        {visibleColumns.acoes.setor && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acao.setor}</td>
                        )}
                        {visibleColumns.acoes.previsao && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acao.previsao}</td>
                        )}
                        {visibleColumns.acoes.realizado && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acao.realizado}</td>
                        )}
                        {visibleColumns.acoes.criadaHa && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1 text-gray-500" />
                              {acao.criadaHa}
                            </div>
                          </td>
                        )}
                        {visibleColumns.acoes.procedimento && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acao.procedimento}</td>
                        )}
                        {visibleColumns.acoes.infraestrutura && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acao.infraestrutura}</td>
                        )}
                        {visibleColumns.acoes.prioridade && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                acao.prioridade === "Alta"
                                  ? "bg-blue-100 text-blue-800"
                                  : acao.prioridade === "Média"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {acao.prioridade}
                            </span>
                          </td>
                        )}
                        {visibleColumns.acoes.ordemServico && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acao.ordemServico}</td>
                        )}
                        {visibleColumns.acoes.status && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                acao.status === "Pendente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : acao.status === "Concluído"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {acao.status}
                            </span>
                          </td>
                        )}
                        {visibleColumns.acoes.editar && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button
                              onClick={() => {
                                // Adiciona opções personalizadas para os selects baseadas nos valores da linha
                                const acaoComOpcoes = {
                                  ...acao,
                                  // Adiciona as opções para os selects
                                  negocioOptions: [{ value: acao.negocio, label: acao.negocio }],
                                  unidadeOptions: [{ value: acao.unidade, label: acao.unidade }],
                                  indicadorOptions: [{ value: acao.indicador, label: acao.indicador }],
                                  responsavelOptions: [{ value: acao.responsavel, label: acao.responsavel }],
                                  prioridadeOptions: [{ value: acao.prioridade, label: acao.prioridade }],
                                  statusOptions: [{ value: acao.status, label: acao.status }],
                                }
                                console.log("Dados completos da linha com opções:", acaoComOpcoes)
                                handleEditAction(acaoComOpcoes)
                              }}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Editar
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={Object.values(visibleColumns.acoes).filter(Boolean).length}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "consolidadoLancamentos" && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.consolidadoLancamentos.codigo && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Código
                      </th>
                    )}
                    {visibleColumns.consolidadoLancamentos.indicador && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Indicador
                      </th>
                    )}
                    {visibleColumns.consolidadoLancamentos.negocio && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Negócio
                      </th>
                    )}
                    {visibleColumns.consolidadoLancamentos.filialCentralizadora && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Filial Centralizadora
                      </th>
                    )}
                    {visibleColumns.consolidadoLancamentos.filial && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Filial
                      </th>
                    )}
                    {visibleColumns.consolidadoLancamentos.responsavel && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Responsável
                      </th>
                    )}
                    {visibleColumns.consolidadoLancamentos.data && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Data
                      </th>
                    )}
                    {visibleColumns.consolidadoLancamentos.status && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    )}
                    {visibleColumns.consolidadoLancamentos.qtdAcoes && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        QTD ações
                      </th>
                    )}
                    {visibleColumns.consolidadoLancamentos.qtdPendencias && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        QTD das Pendências
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {visibleColumns.consolidadoLancamentos.codigo && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.codigo}</td>
                        )}
                        {visibleColumns.consolidadoLancamentos.indicador && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.indicador}</td>
                        )}
                        {visibleColumns.consolidadoLancamentos.negocio && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.negocio}</td>
                        )}
                        {visibleColumns.consolidadoLancamentos.filialCentralizadora && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.filialCentralizadora}
                          </td>
                        )}
                        {visibleColumns.consolidadoLancamentos.filial && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.filial}</td>
                        )}
                        {visibleColumns.consolidadoLancamentos.responsavel && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.responsavel}</td>
                        )}
                        {visibleColumns.consolidadoLancamentos.data && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.data}</td>
                        )}
                        {visibleColumns.consolidadoLancamentos.status && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.status === "Pendente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : item.status === "Concluído"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        )}
                        {visibleColumns.consolidadoLancamentos.qtdAcoes && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.qtdAcoes}</td>
                        )}
                        {visibleColumns.consolidadoLancamentos.qtdPendencias && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.qtdPendencias}</td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={Object.values(visibleColumns.consolidadoLancamentos).filter(Boolean).length}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "consolidadoUnidades" && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.consolidadoUnidades.negocio && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Negócio
                      </th>
                    )}
                    {visibleColumns.consolidadoUnidades.unidadeCentralizadora && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Unidade Centralizadora
                      </th>
                    )}
                    {visibleColumns.consolidadoUnidades.unidade && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Unidade
                      </th>
                    )}
                    {visibleColumns.consolidadoUnidades.indicador && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Indicador
                      </th>
                    )}
                    {visibleColumns.consolidadoUnidades.dataFimAuditoria && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Data fim Auditoria
                      </th>
                    )}
                    {visibleColumns.consolidadoUnidades.diasAposAuditoria && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Dias após auditoria
                      </th>
                    )}
                    {visibleColumns.consolidadoUnidades.quantidadeNC && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantidade NC
                      </th>
                    )}
                    {visibleColumns.consolidadoUnidades.totalAcoes && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total Ações
                      </th>
                    )}
                    {visibleColumns.consolidadoUnidades.realizadas && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Realizadas
                      </th>
                    )}
                    {visibleColumns.consolidadoUnidades.realizadasComAtraso && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Realizadas com Atraso
                      </th>
                    )}
                    {visibleColumns.consolidadoUnidades.atrasadas && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Atrasadas
                      </th>
                    )}
                    {visibleColumns.consolidadoUnidades.noPrazo && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        No Prazo
                      </th>
                    )}
                    {visibleColumns.consolidadoUnidades.percentualResolvido && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        % Resolvido
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {visibleColumns.consolidadoUnidades.negocio && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.negocio}</td>
                        )}
                        {visibleColumns.consolidadoUnidades.unidadeCentralizadora && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.unidadeCentralizadora}
                          </td>
                        )}
                        {visibleColumns.consolidadoUnidades.unidade && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.unidade}</td>
                        )}
                        {visibleColumns.consolidadoUnidades.indicador && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.indicador}</td>
                        )}
                        {visibleColumns.consolidadoUnidades.dataFimAuditoria && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.dataFimAuditoria}</td>
                        )}
                        {visibleColumns.consolidadoUnidades.diasAposAuditoria && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.diasAposAuditoria}
                          </td>
                        )}
                        {visibleColumns.consolidadoUnidades.quantidadeNC && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantidadeNC}</td>
                        )}
                        {visibleColumns.consolidadoUnidades.totalAcoes && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.totalAcoes}</td>
                        )}
                        {visibleColumns.consolidadoUnidades.realizadas && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.realizadas}</td>
                        )}
                        {visibleColumns.consolidadoUnidades.realizadasComAtraso && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.realizadasComAtraso}
                          </td>
                        )}
                        {visibleColumns.consolidadoUnidades.atrasadas && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.atrasadas}</td>
                        )}
                        {visibleColumns.consolidadoUnidades.noPrazo && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.noPrazo}</td>
                        )}
                        {visibleColumns.consolidadoUnidades.percentualResolvido && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.percentualResolvido}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={Object.values(visibleColumns.consolidadoUnidades).filter(Boolean).length}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "consolidadoMensal" && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.consolidadoMensal.unidade && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Unidade
                      </th>
                    )}
                    {visibleColumns.consolidadoMensal.mesAno && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Mês/Ano
                      </th>
                    )}
                    {visibleColumns.consolidadoMensal.indicador && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Indicador
                      </th>
                    )}
                    {visibleColumns.consolidadoMensal.totalAcoes && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total das Ações
                      </th>
                    )}
                    {visibleColumns.consolidadoMensal.realizadas && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Realizadas
                      </th>
                    )}
                    {visibleColumns.consolidadoMensal.emAtraso && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Em Atraso
                      </th>
                    )}
                    {visibleColumns.consolidadoMensal.noPrazo && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        No Prazo
                      </th>
                    )}
                    {visibleColumns.consolidadoMensal.percentualRealizada && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        % Realizada
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {visibleColumns.consolidadoMensal.unidade && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.unidade}</td>
                        )}
                        {visibleColumns.consolidadoMensal.mesAno && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.mesAno}</td>
                        )}
                        {visibleColumns.consolidadoMensal.indicador && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.indicador}</td>
                        )}
                        {visibleColumns.consolidadoMensal.totalAcoes && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.totalAcoes}</td>
                        )}
                        {visibleColumns.consolidadoMensal.realizadas && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.realizadas}</td>
                        )}
                        {visibleColumns.consolidadoMensal.emAtraso && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.emAtraso}</td>
                        )}
                        {visibleColumns.consolidadoMensal.noPrazo && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.noPrazo}</td>
                        )}
                        {visibleColumns.consolidadoMensal.percentualRealizada && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.percentualRealizada}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={Object.values(visibleColumns.consolidadoMensal).filter(Boolean).length}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "historico" && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.historico.codigo && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Código
                      </th>
                    )}
                    {visibleColumns.historico.acao && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ação
                      </th>
                    )}
                    {visibleColumns.historico.responsavelAnterior && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Responsável Anterior
                      </th>
                    )}
                    {visibleColumns.historico.novoResponsavel && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Novo Responsável
                      </th>
                    )}
                    {visibleColumns.historico.dataTransferencia && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Data Transferência
                      </th>
                    )}
                    {visibleColumns.historico.quemAtualizou && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quem Atualizou
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {visibleColumns.historico.codigo && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.codigo}</td>
                        )}
                        {visibleColumns.historico.acao && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.acao}</td>
                        )}
                        {visibleColumns.historico.responsavelAnterior && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.responsavelAnterior}
                          </td>
                        )}
                        {visibleColumns.historico.novoResponsavel && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.novoResponsavel}</td>
                        )}
                        {visibleColumns.historico.dataTransferencia && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.dataTransferencia}
                          </td>
                        )}
                        {visibleColumns.historico.quemAtualizou && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quemAtualizou}</td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={Object.values(visibleColumns.historico).filter(Boolean).length}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* Outras tabelas para as outras abas (consolidadoLancamentos, consolidadoUnidades, etc.) */}
            {/* Código omitido por brevidade, mas seria similar ao da tabela acima */}
          </div>

          {/* Paginação */}
          {renderPagination()}

          {/* Modal de Edição */}
          {editModalOpen && (
            <EditarAcaoModal
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              onSave={handleSaveEditedAction}
              acao={currentAction}
            />
          )}
        </div>
      </div>
    </div>
  )
}

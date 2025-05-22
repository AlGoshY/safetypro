"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Edit,
  Paperclip,
  Plus,
  Save,
  Search,
  X,
  Clock,
  Calendar,
  Users,
  FileText,
  AlertCircle,
  AlertTriangle,
  Mail,
} from "lucide-react"
import { NovaAcaoModal } from "./nova-acao-modal"
import { Check } from "lucide-react"

interface RealizarReuniaoProps {
  unidade: string
  tipoReuniao: string
  onVoltar: () => void
  reuniaoInfo?: {
    id: string
    titulo: string
    dataUltimaRealizacao: string
    frequencia: string
    participantes: number
    pendencias: number
  }
}

interface Participante {
  id: string
  nome: string
  presente: boolean
  ausente: boolean
  ferias: boolean
  substituto: boolean
  outros: boolean
  nomeSubstituto: string
}

interface Acao {
  id: string
  descricao: string
  responsavel: string
  previsto: string
  realizado: string
  status: string
  percentual: number
  obs?: string
}

export function RealizarReuniao({ unidade, tipoReuniao, onVoltar, reuniaoInfo }: RealizarReuniaoProps) {
  // Estados para controle de expansão das seções
  const [participantesExpanded, setParticipantesExpanded] = useState(true)
  const [pendenciasExpanded, setPendenciasExpanded] = useState(true)
  const [ataExpanded, setAtaExpanded] = useState(true)
  const [somentePendencias, setSomentePendencias] = useState(false)
  const [observacao, setObservacao] = useState("")

  // Estados para controle de edição do cabeçalho
  const [allSectionsExpanded, setAllSectionsExpanded] = useState(true)
  const [editingHeader, setEditingHeader] = useState(false)
  const [encontroNum, setEncontroNum] = useState("78")
  const [dataInicio, setDataInicio] = useState("2025-05-07")
  const [dataFim, setDataFim] = useState("")
  const [horaInicio, setHoraInicio] = useState("09:07")
  const [horaFinal, setHoraFinal] = useState("")

  const [editingParticipantes, setEditingParticipantes] = useState(false)
  const [participantesBackup, setParticipantesBackup] = useState<Participante[]>([])

  // Estado para controlar a confirmação de exclusão
  const [participanteParaExcluir, setParticipanteParaExcluir] = useState<string | null>(null)

  // Estado para controlar a confirmação de exclusão de ação
  const [acaoParaExcluir, setAcaoParaExcluir] = useState<string | null>(null)

  // Adicione este novo estado junto aos outros estados de confirmação de exclusão (por volta da linha 70)
  const [anexoParaExcluir, setAnexoParaExcluir] = useState<string | null>(null)

  // Adicione estes novos estados logo após os outros estados (por volta da linha 70)
  const [showSaveErrorModal, setShowSaveErrorModal] = useState(false)
  const [saveErrorMessages, setSaveErrorMessages] = useState<string[]>([])
  const [showEmailConfirmModal, setShowEmailConfirmModal] = useState(false)
  const [showEmailSendModal, setShowEmailSendModal] = useState(false)
  const [emailList, setEmailList] = useState("")
  const [sendToAllParticipants, setSendToAllParticipants] = useState(true)

  // Adicione o seguinte estado para controlar o processo de exportação logo após os outros estados (por volta da linha 70):
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [showDownloadConfirmModal, setShowDownloadConfirmModal] = useState(false)
  const [generatedPdfFileName, setGeneratedPdfFileName] = useState("")

  // Adicione estes novos estados para controlar as opções de exportação
  const [exportOptions, setExportOptions] = useState({
    includeParticipants: true,
    includePendingActions: true,
    includeCompletedActions: true,
    includeAttachments: true,
    includeObservations: true,
    addWatermark: false,
    format: "pdf", // Opções: pdf, docx, xlsx
  })
  const [showExportOptionsModal, setShowExportOptionsModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  // Estados para backup dos valores originais
  const [originalValues, setOriginalValues] = useState({
    dataInicio: "2025-05-07",
    dataFim: "",
    horaInicio: "09:07",
    horaFinal: "",
  })

  // Estado para verificar se houve alterações
  const [hasChanges, setHasChanges] = useState(false)

  // Adicione este novo estado logo após a declaração dos outros estados (por volta da linha 40)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchPendenciasTerm, setSearchPendenciasTerm] = useState("")

  // Adicione estes novos estados para controlar a edição de pendências
  const [editingPendenciaId, setEditingPendenciaId] = useState<string | null>(null)
  const [pendenciasBackup, setPendenciasBackup] = useState<Acao[]>([])

  // Adicione os seguintes estados logo após a declaração dos outros estados (por volta da linha 50):
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Adicione os seguintes estados para paginação de participantes (após a linha onde são declarados os outros estados de paginação, por volta da linha 50):
  const [participantesItemsPerPage, setParticipantesItemsPerPage] = useState(10)
  const [participantesCurrentPage, setParticipantesCurrentPage] = useState(1)

  // Estado para controlar o modal de nova ação
  const [isNovaAcaoModalOpen, setIsNovaAcaoModalOpen] = useState(false)

  // Adicione o seguinte estado logo após os outros estados (por volta da linha 60):
  const [acoesEditMode, setAcoesEditMode] = useState(true)

  // Adicione estes estados logo após os outros estados no início do componente (por volta da linha 60):
  const [showAnexosPanel, setShowAnexosPanel] = useState(false)
  const [anexos, setAnexos] = useState<Array<{ id: string; descricao: string; arquivo: File | null }>>([])
  const [descricaoAnexo, setDescricaoAnexo] = useState("")
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Verificar alterações quando os valores mudam
  useEffect(() => {
    if (editingHeader) {
      const changed =
        dataInicio !== originalValues.dataInicio ||
        dataFim !== originalValues.dataFim ||
        horaInicio !== originalValues.horaInicio ||
        horaFinal !== originalValues.horaFinal

      setHasChanges(changed)
    }
  }, [dataInicio, dataFim, horaInicio, horaFinal, editingHeader, originalValues])

  // Dados fictícios
  const [participantes, setParticipantes] = useState<Participante[]>([
    {
      id: "1",
      nome: "ADM",
      presente: true,
      ausente: false,
      ferias: false,
      substituto: false,
      outros: false,
      nomeSubstituto: "",
    },
    {
      id: "2",
      nome: "Gerente de Operações",
      presente: false,
      ausente: true,
      ferias: false,
      substituto: false,
      outros: false,
      nomeSubstituto: "",
    },
    {
      id: "3",
      nome: "Coordenador de Segurança",
      presente: true,
      ausente: false,
      ferias: false,
      substituto: false,
      outros: false,
      nomeSubstituto: "",
    },
  ])

  const [pendencias, setPendencias] = useState<Acao[]>([
    {
      id: "1",
      descricao: "Revisar procedimentos de segurança",
      responsavel: "João Silva",
      previsto: "2025-05-10",
      realizado: "",
      status: "Em andamento",
      percentual: 50,
    },
    {
      id: "2",
      descricao: "Atualizar manual de operações",
      responsavel: "Maria Oliveira",
      previsto: "2025-04-20",
      realizado: "",
      status: "Pendente",
      percentual: 25,
    },
    {
      id: "3",
      descricao: "Treinamento da equipe de campo",
      responsavel: "Carlos Santos",
      previsto: "2025-04-15",
      realizado: "2025-04-18",
      status: "Concluído",
      percentual: 100,
    },
    {
      id: "4",
      descricao: "Implementar novo sistema de monitoramento",
      responsavel: "Ana Costa",
      previsto: "2025-03-30",
      realizado: "2025-04-10",
      status: "Concluído",
      percentual: 100,
    },
    {
      id: "5",
      descricao: "Auditoria de equipamentos",
      responsavel: "Roberto Almeida",
      previsto: "2025-05-20",
      realizado: "",
      status: "Pendente",
      percentual: 10,
    },
    {
      id: "6",
      descricao: "Revisão do plano de emergência",
      responsavel: "Fernanda Lima",
      previsto: "2025-04-25",
      realizado: "",
      status: "Cancelado",
      percentual: 0,
    },
    {
      id: "7",
      descricao: "Manutenção preventiva dos equipamentos",
      responsavel: "Paulo Mendes",
      previsto: "2025-05-05",
      realizado: "",
      status: "Em andamento",
      percentual: 60,
    },
    {
      id: "8",
      descricao: "Atualização dos procedimentos de segurança",
      responsavel: "Luciana Ferreira",
      previsto: "2025-04-10",
      realizado: "2025-04-08",
      status: "Concluído",
      percentual: 100,
    },
  ])

  const [acoes, setAcoes] = useState<Acao[]>([])

  // Funções de manipulação
  const handleParticipanteChange = (id: string, field: keyof Participante, value: any) => {
    const updatedParticipantes = participantes.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    setParticipantes(updatedParticipantes)
  }

  const calcularParticipacao = () => {
    const presentes = participantes.filter((p) => p.presente).length
    const total = participantes.length
    return total > 0 ? Math.round((presentes / total) * 100) : 0
  }

  // Adicione esta função de filtragem logo após a função calcularParticipacao()
  const filteredParticipantes = participantes.filter((participante) =>
    participante.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Adicione o seguinte código após a função filteredParticipantes (por volta da linha 180):
  // Calcular o total de páginas para participantes
  const participantesTotalPages = Math.ceil(filteredParticipantes.length / participantesItemsPerPage)

  // Ajustar a página atual se necessário (caso a filtragem reduza o número de páginas)
  useEffect(() => {
    if (participantesCurrentPage > participantesTotalPages && participantesTotalPages > 0) {
      setParticipantesCurrentPage(participantesTotalPages)
    }
  }, [filteredParticipantes.length, participantesItemsPerPage, participantesCurrentPage, participantesTotalPages])

  // Obter apenas os participantes da página atual
  const paginatedParticipantes = filteredParticipantes.slice(
    (participantesCurrentPage - 1) * participantesItemsPerPage,
    participantesCurrentPage * participantesItemsPerPage,
  )

  // Filtrar pendências com base no checkbox "Somente Pendências" e no termo de busca
  const filteredPendencias = pendencias.filter((pendencia) => {
    // Primeiro verifica o filtro de "Somente Pendências"
    if (somentePendencias && ["Concluído", "Cancelado"].includes(pendencia.status)) {
      return false
    }

    // Depois verifica o termo de busca
    if (searchPendenciasTerm) {
      const searchLower = searchPendenciasTerm.toLowerCase()
      return (
        pendencia.descricao.toLowerCase().includes(searchLower) ||
        pendencia.responsavel.toLowerCase().includes(searchLower) ||
        pendencia.status.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  // Calcular o total de páginas
  const totalPages = Math.ceil(filteredPendencias.length / itemsPerPage)

  // Ajustar a página atual se necessário (caso a filtragem reduza o número de páginas)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [filteredPendencias.length, itemsPerPage, currentPage, totalPages])

  // Obter apenas os itens da página atual
  const paginatedPendencias = filteredPendencias.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Funções para edição de pendências
  const startEditingPendencia = (id: string) => {
    setPendenciasBackup([...pendencias])
    setEditingPendenciaId(id)
  }

  const cancelEditingPendencia = () => {
    setPendencias(pendenciasBackup)
    setEditingPendenciaId(null)
  }

  const saveEditingPendencia = () => {
    setEditingPendenciaId(null)
    // Aqui você poderia adicionar lógica para salvar no servidor
  }

  const handlePendenciaChange = (id: string, field: keyof Acao, value: any) => {
    const updatedPendencias = pendencias.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    setPendencias(updatedPendencias)
  }

  const adicionarAcao = () => {
    setIsNovaAcaoModalOpen(true)
  }

  const handleSaveNovaAcao = (novaAcao: {
    descricao: string
    responsavel: string
    previsto: string
    realizado: string
    obs: string
    percentual: number
  }) => {
    const acao: Acao = {
      id: Date.now().toString(),
      descricao: novaAcao.descricao,
      responsavel: novaAcao.responsavel,
      previsto: novaAcao.previsto,
      realizado: novaAcao.realizado,
      status: novaAcao.percentual === 100 ? "Concluído" : novaAcao.percentual > 0 ? "Em andamento" : "Pendente",
      percentual: novaAcao.percentual,
      obs: novaAcao.obs,
    }
    setAcoes([...acoes, acao])
  }

  const adicionarParticipante = () => {
    const novoParticipante: Participante = {
      id: Date.now().toString(),
      nome: "",
      presente: false,
      ausente: false,
      ferias: false,
      substituto: false,
      outros: false,
      nomeSubstituto: "",
    }
    setParticipantes([...participantes, novoParticipante])
  }

  // Função para iniciar o processo de exclusão (mostra confirmação)
  const iniciarExclusaoParticipante = (id: string) => {
    setParticipanteParaExcluir(id)
  }

  // Função para confirmar a exclusão
  const confirmarExclusaoParticipante = () => {
    if (participanteParaExcluir) {
      setParticipantes(participantes.filter((p) => p.id !== participanteParaExcluir))
      setParticipanteParaExcluir(null)
    }
  }

  // Função para cancelar a exclusão
  const cancelarExclusaoParticipante = () => {
    setParticipanteParaExcluir(null)
  }

  // Função para iniciar o processo de exclusão de ação (mostra confirmação)
  const iniciarExclusaoAcao = (id: string) => {
    setAcaoParaExcluir(id)
  }

  // Função para confirmar a exclusão de ação
  const confirmarExclusaoAcao = () => {
    if (acaoParaExcluir) {
      setAcoes(acoes.filter((a) => a.id !== acaoParaExcluir))
      setAcaoParaExcluir(null)
    }
  }

  // Função para cancelar a exclusão de ação
  const cancelarExclusaoAcao = () => {
    setAcaoParaExcluir(null)
  }

  const toggleAllSections = () => {
    const newState = !allSectionsExpanded
    setAllSectionsExpanded(newState)
    setParticipantesExpanded(newState)
    setPendenciasExpanded(newState)
    setAtaExpanded(newState)
  }

  const startEditing = () => {
    // Salvar valores originais antes de editar
    setOriginalValues({
      dataInicio,
      dataFim,
      horaInicio,
      horaFinal,
    })
    setEditingHeader(true)
  }

  const cancelEditing = () => {
    // Restaurar valores originais
    setDataInicio(originalValues.dataInicio)
    setDataFim(originalValues.dataFim)
    setHoraInicio(originalValues.horaInicio)
    setHoraFinal(originalValues.horaFinal)
    setEditingHeader(false)
    setHasChanges(false)
  }

  const saveEditing = () => {
    // Aqui você poderia adicionar validação antes de salvar
    setEditingHeader(false)
    setHasChanges(false)
    // Mostrar feedback de sucesso (em uma implementação real)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "em andamento":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "concluído":
        return "text-green-600 bg-green-50 border-green-200"
      case "cancelado":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getPercentualColor = (percentual: number) => {
    if (percentual === 0) return "bg-gray-200"
    if (percentual < 25) return "bg-red-500"
    if (percentual < 50) return "bg-orange-500"
    if (percentual < 75) return "bg-yellow-500"
    if (percentual < 100) return "bg-blue-500"
    return "bg-green-500"
  }

  // Adicione esta função para obter a cor do status baseado no status e percentual
  const getStatusCircleColor = (status: string, percentual: number) => {
    switch (status.toLowerCase()) {
      case "cancelado":
        return "stroke-gray-400"
      case "pendente":
        return percentual === 0 ? "stroke-gray-300" : "stroke-yellow-500"
      case "em andamento":
        return percentual < 50 ? "stroke-orange-500" : "stroke-blue-500"
      case "concluído":
        return percentual === 100 ? "stroke-green-500" : "stroke-blue-400"
      default:
        return "stroke-gray-300"
    }
  }

  // Função para formatar data no padrão brasileiro
  const formatarData = (dataISO: string) => {
    if (!dataISO) return "—"
    const data = new Date(dataISO)
    return data.toLocaleDateString("pt-BR")
  }

  // Função para formatar hora
  const formatarHora = (hora: string) => {
    if (!hora) return "—"
    return hora
  }

  // Encontrar o nome do participante a ser excluído
  const nomeParticipanteParaExcluir = participanteParaExcluir
    ? participantes.find((p) => p.id === participanteParaExcluir)?.nome || "este participante"
    : ""

  // Encontrar a descrição da ação a ser excluída
  const descricaoAcaoParaExcluir = acaoParaExcluir
    ? acoes.find((a) => a.id === acaoParaExcluir)?.descricao || "esta ação"
    : ""

  // Adicione esta constante junto às outras constantes de descrição (por volta da linha 350)
  // Encontrar a descrição do anexo a ser excluído
  const descricaoAnexoParaExcluir = anexoParaExcluir
    ? anexos.find((a) => a.id === anexoParaExcluir)?.descricao || "este anexo"
    : ""

  // Adicione estas funções logo após as outras funções de manipulação (por volta da linha 300):
  // Substitua a função handleExcluirAnexo existente por estas três funções (por volta da linha 300)
  // Função para iniciar o processo de exclusão de anexo (mostra confirmação)
  const iniciarExclusaoAnexo = (id: string) => {
    setAnexoParaExcluir(id)
  }

  // Função para confirmar a exclusão de anexo
  const confirmarExclusaoAnexo = () => {
    if (anexoParaExcluir) {
      setAnexos(anexos.filter((a) => a.id !== anexoParaExcluir))
      setAnexoParaExcluir(null)
    }
  }

  // Função para cancelar a exclusão de anexo
  const cancelarExclusaoAnexo = () => {
    setAnexoParaExcluir(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivoSelecionado(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setArquivoSelecionado(e.dataTransfer.files[0])
    }
  }

  const handleAnexar = () => {
    if (descricaoAnexo.trim() === "") {
      alert("Por favor, insira uma descrição para o anexo.")
      return
    }

    if (!arquivoSelecionado) {
      alert("Por favor, selecione um arquivo para anexar.")
      return
    }

    const novoAnexo = {
      id: Date.now().toString(),
      descricao: descricaoAnexo,
      arquivo: arquivoSelecionado,
    }

    setAnexos([...anexos, novoAnexo])
    setDescricaoAnexo("")
    setArquivoSelecionado(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleVisualizarAnexo = (anexo: { id: string; descricao: string; arquivo: File | null }) => {
    if (anexo.arquivo) {
      const url = URL.createObjectURL(anexo.arquivo)
      window.open(url, "_blank")
    }
  }

  // Adicione esta função antes do return (por volta da linha 400)
  const handleSaveReuniao = () => {
    // Verificar se há campos em edição
    const errorMessages = []

    if (editingHeader) {
      errorMessages.push("Há campos no cabeçalho em edição")
    }

    if (editingParticipantes) {
      errorMessages.push("Há participantes em edição")
    }

    if (editingPendenciaId) {
      errorMessages.push("Há pendências em edição")
    }

    // Só considerar acoesEditMode como erro se houver ações
    if (acoesEditMode && acoes.length > 0) {
      errorMessages.push("Há ações em edição")
    }

    if (errorMessages.length > 0) {
      // Mostrar modal de erro
      setSaveErrorMessages(errorMessages)
      setShowSaveErrorModal(true)
      return
    }

    // Se não houver erros, mostrar modal de confirmação de envio por email
    setShowEmailConfirmModal(true)
  }

  // Adicione esta função antes do return (por volta da linha 420)
  const handleConfirmEmailSend = (sendEmail: boolean) => {
    // Fechar modal de confirmação
    setShowEmailConfirmModal(false)

    if (sendEmail) {
      // Mostrar modal para informar emails
      setShowEmailSendModal(true)

      // Preencher a lista de emails com os participantes se a opção estiver marcada
      if (sendToAllParticipants) {
        const emails = participantes
          .filter((p) => p.presente)
          .map((p) => `${p.nome.toLowerCase().replace(/\s+/g, ".")}@empresa.com`)
          .join(", ")
        setEmailList(emails)
      }
    } else {
      // Apenas salvar sem enviar email
      // Aqui você adicionaria a lógica para salvar a reunião no servidor

      // Criar um elemento de notificação personalizado
      const notificacao = document.createElement("div")
      notificacao.className =
        "fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md z-50 border-l-4 border-green-500 animate-slide-in"
      notificacao.style.cssText = "animation: slideIn 0.3s ease-out forwards; transform: translateX(100%);"

      // Criar o conteúdo da notificação
      const titulo = document.createElement("div")
      titulo.className = "text-lg font-semibold text-gray-800 flex items-center"
      titulo.innerHTML =
        '<svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Reunião salva com sucesso!'

      // Mensagem de confirmação
      const mensagem = document.createElement("div")
      mensagem.className = "mt-1 text-sm text-gray-600"
      mensagem.textContent = "Todas as informações foram salvas corretamente."

      // Botão de fechar
      const botaoFechar = document.createElement("button")
      botaoFechar.className = "absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      botaoFechar.innerHTML =
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
      botaoFechar.onclick = () => {
        notificacao.style.cssText = "animation: slideOut 0.3s ease-in forwards;"
        setTimeout(() => {
          if (document.body.contains(notificacao)) {
            document.body.removeChild(notificacao)
          }
        }, 300)
      }

      // Adicionar elementos à notificação
      notificacao.appendChild(titulo)
      notificacao.appendChild(mensagem)
      notificacao.appendChild(botaoFechar)

      // Adicionar a notificação ao corpo do documento
      document.body.appendChild(notificacao)

      // Adicionar estilos de animação
      const style = document.createElement("style")
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOut {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `
      document.head.appendChild(style)

      // Remover a notificação após 5 segundos
      setTimeout(() => {
        if (document.body.contains(notificacao)) {
          notificacao.style.cssText = "animation: slideOut 0.3s ease-in forwards;"
          setTimeout(() => {
            if (document.body.contains(notificacao)) {
              document.body.removeChild(notificacao)
            }
          }, 300)
        }
      }, 5000)
    }
  }

  // Adicione esta função antes do return (por volta da linha 440)
  const handleSendEmail = () => {
    // Fechar modal de envio
    setShowEmailSendModal(false)

    // 1. Mostrar mensagem de reunião salva com sucesso
    const notificacaoSalva = document.createElement("div")
    notificacaoSalva.className =
      "fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md z-50 border-l-4 border-green-500 animate-slide-in"
    notificacaoSalva.style.cssText = "animation: slideIn 0.3s ease-out forwards; transform: translateX(100%);"

    const tituloSalva = document.createElement("div")
    tituloSalva.className = "text-lg font-semibold text-gray-800 flex items-center"
    tituloSalva.innerHTML =
      '<svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Reunião salva com sucesso!'

    const mensagemSalva = document.createElement("div")
    mensagemSalva.className = "mt-1 text-sm text-gray-600"
    mensagemSalva.textContent = "Iniciando o envio dos emails..."

    const botaoFecharSalva = document.createElement("button")
    botaoFecharSalva.className = "absolute top-2 right-2 text-gray-400 hover:text-gray-600"
    botaoFecharSalva.innerHTML =
      '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
    botaoFecharSalva.onclick = () => {
      notificacaoSalva.style.cssText = "animation: slideOut 0.3s ease-in forwards;"
      setTimeout(() => {
        if (document.body.contains(notificacaoSalva)) {
          document.body.removeChild(notificacaoSalva)
        }
      }, 300)
    }

    notificacaoSalva.appendChild(tituloSalva)
    notificacaoSalva.appendChild(mensagemSalva)
    notificacaoSalva.appendChild(botaoFecharSalva)
    document.body.appendChild(notificacaoSalva)

    // Adicionar estilos de animação se ainda não existirem
    if (!document.getElementById("notificacao-styles")) {
      const style = document.createElement("style")
      style.id = "notificacao-styles"
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOut {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes progressAnimation {
          from { width: 0%; }
          to { width: 100%; }
        }
      `
      document.head.appendChild(style)
    }

    // 2. Após um pequeno delay, mostrar a barra de progresso
    setTimeout(() => {
      // Remover a primeira notificação
      if (document.body.contains(notificacaoSalva)) {
        notificacaoSalva.style.cssText = "animation: slideOut 0.3s ease-in forwards;"
        setTimeout(() => {
          if (document.body.contains(notificacaoSalva)) {
            document.body.removeChild(notificacaoSalva)
          }
        }, 300)
      }

      // Criar notificação com barra de progresso
      const notificacaoProgresso = document.createElement("div")
      notificacaoProgresso.className =
        "fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md z-50 border-l-4 border-blue-500 animate-slide-in"
      notificacaoProgresso.style.cssText = "animation: slideIn 0.3s ease-out forwards; transform: translateX(100%);"

      const tituloProgresso = document.createElement("div")
      tituloProgresso.className = "text-lg font-semibold text-gray-800 flex items-center"
      tituloProgresso.innerHTML =
        '<svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>Enviando emails...'

      const containerProgresso = document.createElement("div")
      containerProgresso.className = "mt-2 w-full bg-gray-200 rounded-full h-2.5"

      const barraProgresso = document.createElement("div")
      barraProgresso.className = "bg-blue-600 h-2.5 rounded-full"
      barraProgresso.style.width = "0%"
      barraProgresso.style.animation = "progressAnimation 3s linear forwards"

      const infoProgresso = document.createElement("div")
      infoProgresso.className = "mt-1 text-sm text-gray-600 flex justify-between"

      const statusEnvio = document.createElement("span")
      statusEnvio.textContent = "Enviando..."

      const contadorEnvio = document.createElement("span")
      contadorEnvio.className = "text-blue-600 font-medium"
      contadorEnvio.textContent = "0%"

      infoProgresso.appendChild(statusEnvio)
      infoProgresso.appendChild(contadorEnvio)

      containerProgresso.appendChild(barraProgresso)

      notificacaoProgresso.appendChild(tituloProgresso)
      notificacaoProgresso.appendChild(containerProgresso)
      notificacaoProgresso.appendChild(infoProgresso)

      document.body.appendChild(notificacaoProgresso)

      // Simular progresso
      let progresso = 0
      const totalEmails = emailList.split(",").filter((email) => email.trim()).length || 1
      const intervalo = setInterval(() => {
        progresso += Math.floor(Math.random() * 15) + 5 // Incremento aleatório entre 5% e 20%
        if (progresso > 100) progresso = 100

        barraProgresso.style.width = `${progresso}%`
        contadorEnvio.textContent = `${progresso}%`

        if (progresso === 100) {
          clearInterval(intervalo)
          statusEnvio.textContent = "Concluído!"

          // 3. Após concluir, mostrar mensagem de sucesso
          setTimeout(() => {
            // Remover a notificação de progresso
            if (document.body.contains(notificacaoProgresso)) {
              notificacaoProgresso.style.cssText = "animation: slideOut 0.3s ease-in forwards;"
              setTimeout(() => {
                if (document.body.contains(notificacaoProgresso)) {
                  document.body.removeChild(notificacaoProgresso)
                }
              }, 300)
            }

            // Mostrar notificação de sucesso
            const notificacaoSucesso = document.createElement("div")
            notificacaoSucesso.className =
              "fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md z-50 border-l-4 border-green-500 animate-slide-in"
            notificacaoSucesso.style.cssText = "animation: slideIn 0.3s ease-out forwards; transform: translateX(100%);"

            const tituloSucesso = document.createElement("div")
            tituloSucesso.className = "text-lg font-semibold text-gray-800 flex items-center"
            tituloSucesso.innerHTML =
              '<svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Emails enviados com sucesso!'

            const mensagemSucesso = document.createElement("div")
            mensagemSucesso.className = "mt-1 text-sm text-gray-600"
            mensagemSucesso.textContent = `${totalEmails} email(s) enviado(s) com sucesso.`

            const botaoFecharSucesso = document.createElement("button")
            botaoFecharSucesso.className = "absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            botaoFecharSucesso.innerHTML =
              '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
            botaoFecharSucesso.onclick = () => {
              notificacaoSucesso.style.cssText = "animation: slideOut 0.3s ease-in forwards;"
              setTimeout(() => {
                if (document.body.contains(notificacaoSucesso)) {
                  document.body.removeChild(notificacaoSucesso)
                }
              }, 300)
            }

            notificacaoSucesso.appendChild(tituloSucesso)
            notificacaoSucesso.appendChild(mensagemSucesso)
            notificacaoSucesso.appendChild(botaoFecharSucesso)
            document.body.appendChild(notificacaoSucesso)

            // Remover a notificação após 5 segundos
            setTimeout(() => {
              if (document.body.contains(notificacaoSucesso)) {
                notificacaoSucesso.style.cssText = "animation: slideOut 0.3s ease-in forwards;"
                setTimeout(() => {
                  if (document.body.contains(notificacaoSucesso)) {
                    document.body.removeChild(notificacaoSucesso)
                  }
                }, 300)
              }
            }, 5000)
          }, 1000)
        }
      }, 300)
    }, 1500)
  }

  // Modifique a função handleExportPdf para mostrar as opções antes de exportar
  const handleExportPdf = () => {
    // Mostrar modal de opções de exportação
    setShowExportOptionsModal(true)
  }

  // Adicione esta nova função para processar a exportação após configurar as opções
  const handleProcessExport = async () => {
    if (isExportingPdf) return

    // Fechar modal de opções
    setShowExportOptionsModal(false)

    try {
      setIsExportingPdf(true)

      // Simulação do tempo de processamento para geração do arquivo
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Aqui seria implementada a lógica real de geração do arquivo
      // usando as opções selecionadas em exportOptions

      // Nome do arquivo gerado
      const fileExtension = exportOptions.format.toLowerCase()
      const fileName = `Reuniao_${encontroNum}_${new Date().toISOString().split("T")[0]}.${fileExtension}`
      setGeneratedPdfFileName(fileName)

      // Mostrar modal de confirmação para download
      setShowDownloadConfirmModal(true)

      console.log(`Arquivo gerado: ${fileName} com opções:`, exportOptions)
    } catch (error) {
      console.error("Erro ao gerar arquivo:", error)

      // Notificação de erro
      alert("Ocorreu um erro ao gerar o arquivo. Por favor, tente novamente.")
    } finally {
      setIsExportingPdf(false)
    }
  }

  // Adicione esta função para mostrar uma prévia do documento
  const handleShowPreview = () => {
    setShowPreviewModal(true)
    setShowExportOptionsModal(false)
  }

  // Adicione esta função para fechar a prévia e voltar às opções
  const handleClosePreview = () => {
    setShowPreviewModal(false)
    setShowExportOptionsModal(true)
  }

  const handleDownloadPdf = () => {
    // Fechar o modal de confirmação
    setShowDownloadConfirmModal(false)

    // Simulação de download do PDF
    // Em uma implementação real, isso seria substituído pelo código de download efetivo

    // Criar um elemento de notificação personalizado
    const notificacao = document.createElement("div")
    notificacao.className =
      "fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md z-50 border-l-4 border-green-500 animate-slide-in"
    notificacao.style.cssText = "animation: slideIn 0.3s ease-out forwards; transform: translateX(100%);"

    // Criar o conteúdo da notificação
    const titulo = document.createElement("div")
    titulo.className = "text-lg font-semibold text-gray-800 flex items-center"
    titulo.innerHTML =
      '<svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>PDF baixado com sucesso!'

    // Mensagem de confirmação
    const mensagem = document.createElement("div")
    mensagem.className = "mt-1 text-sm text-gray-600"
    mensagem.textContent = `O arquivo "${generatedPdfFileName}" foi baixado.`

    // Botão de fechar
    const botaoFechar = document.createElement("button")
    botaoFechar.className = "absolute top-2 right-2 text-gray-400 hover:text-gray-600"
    botaoFechar.innerHTML =
      '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
    botaoFechar.onclick = () => {
      notificacao.style.cssText = "animation: slideOut 0.3s ease-in forwards;"
      setTimeout(() => {
        if (document.body.contains(notificacao)) {
          document.body.removeChild(notificacao)
        }
      }, 300)
    }

    // Adicionar elementos à notificação
    notificacao.appendChild(titulo)
    notificacao.appendChild(mensagem)
    notificacao.appendChild(botaoFechar)

    // Adicionar a notificação ao corpo do documento
    document.body.appendChild(notificacao)

    // Adicionar estilos de animação se ainda não existirem
    if (!document.getElementById("notificacao-styles")) {
      const style = document.createElement("style")
      style.id = "notificacao-styles"
      style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
      @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
      }
      .animate-slide-in {
        animation: slideIn 0.3s ease-out forwards;
      }
    `
      document.head.appendChild(style)
    }

    // Remover a notificação após 5 segundos
    setTimeout(() => {
      if (document.body.contains(notificacao)) {
        notificacao.style.cssText = "animation: slideOut 0.3s ease-in forwards;"
        setTimeout(() => {
          if (document.body.contains(notificacao)) {
            document.body.removeChild(notificacao)
          }
        }, 300)
      }
    }, 5000)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Cabeçalho */}
      <div className="border-b">
        <div className="p-4 flex items-center">
          <button
            onClick={onVoltar}
            className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> VOLTAR
          </button>
          <div className="ml-4">
            <h2 className="text-lg font-semibold">{reuniaoInfo?.titulo || "Realizar Reunião"}</h2>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex items-center justify-center"
              onClick={toggleAllSections}
              title={allSectionsExpanded ? "Colapsar todas as seções" : "Expandir todas as seções"}
            >
              {allSectionsExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            <button
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex items-center justify-center ${
                editingHeader ? "bg-blue-100 text-blue-600" : ""
              }`}
              onClick={editingHeader ? cancelEditing : startEditing}
              title={editingHeader ? "Cancelar edição" : "Editar informações da reunião"}
            >
              <Edit className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-2 bg-gray-50">
          <div className="bg-white p-3 rounded-lg shadow-sm flex items-center border border-gray-100">
            <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center mr-3">
              <span className="text-gray-600 font-medium">N</span>
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500">Nº Encontro</div>
              <div className="text-sm font-semibold">{encontroNum}</div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm flex items-center border border-gray-100">
            <div className="bg-blue-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500">Data Início</div>
              {editingHeader ? (
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="text-sm w-full border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-sm font-semibold">{formatarData(dataInicio)}</div>
              )}
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm flex items-center border border-gray-100">
            <div className="bg-blue-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500">Data Fim</div>
              {editingHeader ? (
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="text-sm w-full border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-sm font-semibold">{formatarData(dataFim)}</div>
              )}
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm flex items-center border border-gray-100">
            <div className="bg-blue-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500">Hora Início</div>
              {editingHeader ? (
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="text-sm w-full border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-sm font-semibold">{formatarHora(horaInicio)}</div>
              )}
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm flex items-center border border-gray-100">
            <div className="bg-blue-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500">Hora Final</div>
              {editingHeader ? (
                <input
                  type="time"
                  value={horaFinal}
                  onChange={(e) => setHoraFinal(e.target.value)}
                  className="text-sm w-full border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-sm font-semibold">{horaFinal || "—"}</div>
              )}
            </div>
          </div>
        </div>

        {/* Botões de salvar/cancelar edição */}
        {editingHeader && (
          <div className="flex justify-end p-3 bg-gray-50 border-t border-gray-200 space-x-2">
            <button
              onClick={cancelEditing}
              className="px-3 py-1.5 bg-white text-gray-700 rounded border border-gray-300 flex items-center text-sm hover:bg-gray-50 transition-colors duration-200"
            >
              <X className="h-4 w-4 mr-1" /> Cancelar
            </button>
            <button
              onClick={saveEditing}
              className="px-3 py-1.5 bg-green-600 text-white rounded border border-green-700 flex items-center text-sm hover:bg-green-700 transition-colors duration-200"
              disabled={!hasChanges}
            >
              <Check className="h-4 w-4 mr-1" /> Salvar Alterações
            </button>
          </div>
        )}
      </div>

      {/* Participantes */}
      <div className="border-b">
        <div
          className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setParticipantesExpanded(!participantesExpanded)}
        >
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            <h2 className="text-base font-medium">Participantes</h2>
          </div>
          <div className="flex items-center">
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-2">
              Participação {calcularParticipacao()}%
            </span>
            {participantesExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>

        {/* Modifique a div que contém a seção de participantes expandida, adicionando a caixa de busca
        logo após a abertura da div com className="p-4" */}
        {participantesExpanded && (
          <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center bg-white rounded-md border border-gray-300 overflow-hidden w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Buscar participantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 px-3 text-sm border-none focus:outline-none focus:ring-0 flex-grow"
                />
                <div className="px-3 h-9 bg-gray-50 border-l border-gray-300 flex items-center">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded border border-gray-300 flex items-center text-sm hover:bg-gray-200 transition-colors duration-200"
                >
                  <X className="h-4 w-4 mr-1" /> Limpar
                </button>
              )}
            </div>
            {/* Modal de confirmação de exclusão */}
            {participanteParaExcluir && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                  <div className="flex items-center mb-4 text-amber-600">
                    <AlertTriangle className="h-6 w-6 mr-2" />
                    <h3 className="text-lg font-semibold">Confirmar exclusão</h3>
                  </div>
                  <p className="mb-6 text-gray-700">
                    Tem certeza que deseja excluir <span className="font-semibold">{nomeParticipanteParaExcluir}</span>{" "}
                    da lista de participantes?
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={cancelarExclusaoParticipante}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={confirmarExclusaoParticipante}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mb-4">
              <button
                onClick={() => {
                  if (!editingParticipantes) {
                    // Fazer backup dos participantes antes de editar
                    setParticipantesBackup([...participantes])
                    setEditingParticipantes(true)
                  }
                }}
                className={`px-3 py-1.5 rounded border flex items-center text-sm transition-colors duration-200 ${
                  editingParticipantes
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                }`}
                disabled={editingParticipantes}
              >
                <Edit className="h-4 w-4 mr-1" /> Editar Participantes
              </button>

              <div className="flex gap-2">
                {editingParticipantes ? (
                  <>
                    <button
                      onClick={() => {
                        // Restaurar backup ao cancelar
                        setParticipantes(participantesBackup)
                        setEditingParticipantes(false)
                      }}
                      className="px-3 py-1.5 bg-white text-gray-700 rounded border border-gray-300 flex items-center text-sm hover:bg-gray-50 transition-colors duration-200"
                    >
                      <X className="h-4 w-4 mr-1" /> Cancelar
                    </button>
                    <button
                      onClick={() => {
                        // Salvar alterações
                        setEditingParticipantes(false)
                      }}
                      className="px-3 py-1.5 bg-green-600 text-white rounded border border-green-700 flex items-center text-sm hover:bg-green-700 transition-colors duration-200"
                    >
                      <Check className="h-4 w-4 mr-1" /> Salvar
                    </button>
                    <button
                      onClick={adicionarParticipante}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 flex items-center text-sm hover:bg-blue-100 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Adicionar Participante
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            {/* Modifique a tabela para usar os participantes filtrados em vez de todos os participantes */}
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Participante</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-600">Presente</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-600">Ausente</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-600">Férias</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-600">Substituto</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-600">Outros</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Nome Substituto</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {/* Modifique a tabela para usar os participantes filtrados em vez de todos os participantes */}
                {paginatedParticipantes.map((participante, index) => (
                  <tr
                    key={participante.id}
                    className={`border-t border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="p-3 text-sm font-medium">
                      {editingParticipantes || !participante.nome ? (
                        <input
                          type="text"
                          value={participante.nome}
                          placeholder="Nome do participante"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          onChange={(e) => {
                            const newParticipantes = [...participantes]
                            newParticipantes[index].nome = e.target.value
                            setParticipantes(newParticipantes)
                          }}
                        />
                      ) : (
                        participante.nome
                      )}
                    </td>
                    <td className="text-center p-3">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={participante.presente}
                          onChange={(e) => {
                            if (editingParticipantes) {
                              const isChecked = e.target.checked
                              const updatedParticipante = {
                                ...participante,
                                presente: isChecked,
                                ausente: isChecked ? false : participante.ausente,
                                ferias: isChecked ? false : participante.ferias,
                              }
                              setParticipantes(
                                participantes.map((p) => (p.id === participante.id ? updatedParticipante : p)),
                              )
                            }
                          }}
                          className={`h-4 w-4 rounded focus:ring-blue-500 ${
                            editingParticipantes ? "text-blue-600 cursor-pointer" : "text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!editingParticipantes}
                        />
                      </div>
                    </td>
                    <td className="text-center p-3">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={participante.ausente}
                          onChange={(e) => {
                            if (editingParticipantes) {
                              const isChecked = e.target.checked
                              const updatedParticipante = {
                                ...participante,
                                ausente: isChecked,
                                presente: isChecked ? false : participante.presente,
                                ferias: isChecked ? false : participante.ferias,
                              }
                              setParticipantes(
                                participantes.map((p) => (p.id === participante.id ? updatedParticipante : p)),
                              )
                            }
                          }}
                          className={`h-4 w-4 rounded focus:ring-blue-500 ${
                            editingParticipantes ? "text-blue-600 cursor-pointer" : "text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!editingParticipantes}
                        />
                      </div>
                    </td>
                    <td className="text-center p-3">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={participante.ferias}
                          onChange={(e) => {
                            if (editingParticipantes) {
                              const isChecked = e.target.checked
                              const updatedParticipante = {
                                ...participante,
                                ferias: isChecked,
                                presente: isChecked ? false : participante.presente,
                                ausente: isChecked ? false : participante.ausente,
                              }
                              setParticipantes(
                                participantes.map((p) => (p.id === participante.id ? updatedParticipante : p)),
                              )
                            }
                          }}
                          className={`h-4 w-4 rounded focus:ring-blue-500 ${
                            editingParticipantes ? "text-blue-600 cursor-pointer" : "text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!editingParticipantes}
                        />
                      </div>
                    </td>
                    <td className="text-center p-3">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={participante.substituto}
                          onChange={(e) => {
                            handleParticipanteChange(participante.id, "substituto", e.target.checked)
                          }}
                          className={`h-4 w-4 rounded focus:ring-blue-500 ${
                            editingParticipantes ? "text-blue-600 cursor-pointer" : "text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!editingParticipantes}
                        />
                      </div>
                    </td>
                    <td className="text-center p-3">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={participante.outros}
                          onChange={(e) => {
                            handleParticipanteChange(participante.id, "outros", e.target.checked)
                          }}
                          className={`h-4 w-4 rounded focus:ring-blue-500 ${
                            editingParticipantes ? "text-blue-600 cursor-pointer" : "text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!editingParticipantes}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={participante.nomeSubstituto}
                        onChange={(e) => handleParticipanteChange(participante.id, "nomeSubstituto", e.target.value)}
                        disabled={!participante.substituto || !editingParticipantes}
                        placeholder={participante.substituto ? "Nome do substituto" : ""}
                        className={`w-full h-8 border rounded px-2 text-sm ${
                          participante.substituto && editingParticipantes
                            ? "border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            : "border-gray-200 bg-gray-50 text-gray-400"
                        }`}
                      />
                    </td>
                    <td className="p-3 text-center">
                      {editingParticipantes && (
                        <button
                          onClick={() => iniciarExclusaoParticipante(participante.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                          title="Excluir participante"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {/* Adicione uma mensagem quando não houver resultados na busca */}
                {filteredParticipantes.length === 0 && (
                  <tfoot>
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-gray-500 text-sm">
                        Nenhum participante encontrado para "{searchTerm}"
                      </td>
                    </tr>
                  </tfoot>
                )}
              </tbody>
            </table>

            {/* Adicione o seguinte código após o fechamento da tabela de participantes (por volta da linha 550, após o </table>): */}
            <div className="flex justify-between mt-4">
              <div className="flex gap-2">
                <button
                  className={`px-2 py-1 text-xs ${
                    participantesItemsPerPage === 10 ? "bg-blue-600 text-white" : "border hover:bg-gray-50"
                  } rounded`}
                  onClick={() => {
                    setParticipantesItemsPerPage(10)
                    setParticipantesCurrentPage(1)
                  }}
                >
                  10
                </button>
                <button
                  className={`px-2 py-1 text-xs ${
                    participantesItemsPerPage === 15 ? "bg-blue-600 text-white" : "border hover:bg-gray-50"
                  } rounded`}
                  onClick={() => {
                    setParticipantesItemsPerPage(15)
                    setParticipantesCurrentPage(1)
                  }}
                >
                  15
                </button>
                <button
                  className={`px-2 py-1 text-xs ${
                    participantesItemsPerPage === 25 ? "bg-blue-600 text-white" : "border hover:bg-gray-50"
                  } rounded`}
                  onClick={() => {
                    setParticipantesItemsPerPage(25)
                    setParticipantesCurrentPage(1)
                  }}
                >
                  25
                </button>
                <button
                  className={`px-2 py-1 text-xs ${
                    participantesItemsPerPage === 9999 ? "bg-blue-600 text-white" : "border hover:bg-gray-50"
                  } rounded`}
                  onClick={() => {
                    setParticipantesItemsPerPage(9999)
                    setParticipantesCurrentPage(1)
                  }}
                >
                  Todos
                </button>
              </div>

              {participantesTotalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setParticipantesCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={participantesCurrentPage === 1}
                    className={`px-2 py-1 text-xs rounded ${
                      participantesCurrentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Anterior
                  </button>

                  <span className="text-xs text-gray-600">
                    Página {participantesCurrentPage} de {participantesTotalPages}
                  </span>

                  <button
                    onClick={() => setParticipantesCurrentPage((prev) => Math.min(prev + 1, participantesTotalPages))}
                    disabled={participantesCurrentPage === participantesTotalPages}
                    className={`px-2 py-1 text-xs rounded ${
                      participantesCurrentPage === participantesTotalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Próxima
                  </button>
                </div>
              )}

              <div className="text-xs text-gray-500 flex items-center">
                {filteredParticipantes.length} {filteredParticipantes.length === 1 ? "registro" : "registros"}
                {filteredParticipantes.length > 0 &&
                  ` (mostrando ${Math.min(paginatedParticipantes.length, participantesItemsPerPage)})`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pendências Reunião */}
      <div className="border-b">
        <div
          className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setPendenciasExpanded(!pendenciasExpanded)}
        >
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
            <h2 className="text-base font-medium">Pendências Reunião</h2>
          </div>
          {pendenciasExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>

        {pendenciasExpanded && (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              {/* Controles de filtro (lado esquerdo) */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="somente-pendencias"
                    checked={somentePendencias}
                    onChange={(e) => setSomentePendencias(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <label htmlFor="somente-pendencias" className="text-sm">
                    Somente Pendências
                  </label>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center bg-white rounded-md border border-gray-300 overflow-hidden">
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchPendenciasTerm}
                      onChange={(e) => setSearchPendenciasTerm(e.target.value)}
                      className="h-8 px-2 text-sm border-none focus:outline-none focus:ring-0"
                    />
                    <button
                      className="px-2 h-8 bg-gray-50 border-l border-gray-300"
                      onClick={() => (searchPendenciasTerm ? setSearchPendenciasTerm("") : null)}
                    >
                      {searchPendenciasTerm ? (
                        <X className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Search className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Indicadores circulares (lado direito) */}
              <div className="flex space-x-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-200" strokeWidth="2"></circle>
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-gray-400"
                        strokeWidth="2"
                        strokeDasharray={`${
                          pendencias.length > 0
                            ? Math.round(
                                (pendencias.filter((p) => p.status.toLowerCase() === "cancelado").length /
                                  pendencias.length) *
                                  100,
                              )
                            : 0
                        } 100`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {pendencias.length > 0
                        ? Math.round(
                            (pendencias.filter((p) => p.status.toLowerCase() === "cancelado").length /
                              pendencias.length) *
                              100,
                          )
                        : 0}
                      %
                    </div>
                  </div>
                  <span className="text-xs mt-1">Cancelada</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-200" strokeWidth="2"></circle>
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-red-500"
                        strokeWidth="2"
                        strokeDasharray={`${
                          pendencias.length > 0
                            ? Math.round(
                                (pendencias.filter(
                                  (p) => new Date(p.previsto) < new Date() && p.status.toLowerCase() !== "concluído",
                                ).length /
                                  pendencias.length) *
                                  100,
                              )
                            : 0
                        } 100`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {pendencias.length > 0
                        ? Math.round(
                            (pendencias.filter(
                              (p) => new Date(p.previsto) < new Date() && p.status.toLowerCase() !== "concluído",
                            ).length /
                              pendencias.length) *
                              100,
                          )
                        : 0}
                      %
                    </div>
                  </div>
                  <span className="text-xs mt-1">Atrasada</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-200" strokeWidth="2"></circle>
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-yellow-500"
                        strokeWidth="2"
                        strokeDasharray={`${
                          pendencias.length > 0
                            ? Math.round(
                                (pendencias.filter(
                                  (p) => new Date(p.previsto) >= new Date() && p.status.toLowerCase() !== "concluído",
                                ).length /
                                  pendencias.length) *
                                  100,
                              )
                            : 0
                        } 100`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {pendencias.length > 0
                        ? Math.round(
                            (pendencias.filter(
                              (p) => new Date(p.previsto) >= new Date() && p.status.toLowerCase() !== "concluído",
                            ).length /
                              pendencias.length) *
                              100,
                          )
                        : 0}
                      %
                    </div>
                  </div>
                  <span className="text-xs mt-1">No Prazo</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-200" strokeWidth="2"></circle>
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-green-500"
                        strokeWidth="2"
                        strokeDasharray={`${
                          pendencias.length > 0
                            ? Math.round(
                                (pendencias.filter(
                                  (p) =>
                                    p.status.toLowerCase() === "concluído" &&
                                    new Date(p.realizado) <= new Date(p.previsto),
                                ).length /
                                  pendencias.length) *
                                  100,
                              )
                            : 0
                        } 100`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {pendencias.length > 0
                        ? Math.round(
                            (pendencias.filter(
                              (p) =>
                                p.status.toLowerCase() === "concluído" && new Date(p.realizado) <= new Date(p.previsto),
                            ).length /
                              pendencias.length) *
                              100,
                          )
                        : 0}
                      %
                    </div>
                  </div>
                  <span className="text-xs mt-1">Realizada</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-200" strokeWidth="2"></circle>
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-blue-500"
                        strokeWidth="2"
                        strokeDasharray={`${
                          pendencias.length > 0
                            ? Math.round(
                                (pendencias.filter(
                                  (p) =>
                                    p.status.toLowerCase() === "concluído" &&
                                    new Date(p.realizado) > new Date(p.previsto),
                                ).length /
                                  pendencias.length) *
                                  100,
                              )
                            : 0
                        } 100`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {pendencias.length > 0
                        ? Math.round(
                            (pendencias.filter(
                              (p) =>
                                p.status.toLowerCase() === "concluído" && new Date(p.realizado) > new Date(p.previsto),
                            ).length /
                              pendencias.length) *
                              100,
                          )
                        : 0}
                      %
                    </div>
                  </div>
                  <span className="text-xs mt-1">Realizada c/ Atraso</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Ação</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Quem</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Previsto</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Realizado</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Percentual</th>
                    <th className="text-center p-3 text-sm font-medium text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPendencias.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500 text-sm">
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  ) : (
                    paginatedPendencias.map((acao, index) => (
                      <tr
                        key={acao.id}
                        className={`border-t border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                      >
                        <td className="p-3 text-sm">{acao.descricao}</td>
                        <td className="p-3 text-sm">{acao.responsavel}</td>
                        <td className="p-3 text-sm">
                          {acao.previsto ? new Date(acao.previsto).toLocaleDateString("pt-BR") : ""}
                        </td>
                        <td className="p-3 text-sm">
                          {editingPendenciaId === acao.id ? (
                            <input
                              type="date"
                              value={acao.realizado}
                              onChange={(e) => handlePendenciaChange(acao.id, "realizado", e.target.value)}
                              className="w-full h-8 border border-blue-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : acao.realizado ? (
                            new Date(acao.realizado).toLocaleDateString("pt-BR")
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingPendenciaId === acao.id ? (
                            <select
                              value={acao.status}
                              onChange={(e) => handlePendenciaChange(acao.id, "status", e.target.value)}
                              className="w-full h-8 border border-blue-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Pendente">Pendente</option>
                              <option value="Em andamento">Em andamento</option>
                              <option value="Concluído">Concluído</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          ) : (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(acao.status)}`}
                            >
                              {acao.status}
                            </span>
                          )}
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={acao.percentual}
                              onChange={(e) => {
                                const value = Math.min(Number(e.target.value), 100)
                                handlePendenciaChange(acao.id, "percentual", value)
                              }}
                              disabled={editingPendenciaId !== acao.id}
                              className={`w-full h-2.5 rounded-lg appearance-none ${editingPendenciaId === acao.id ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
                              style={{
                                background: `linear-gradient(to right, ${
                                  acao.percentual === 0
                                    ? "#e5e7eb"
                                    : acao.percentual < 25
                                      ? "#ef4444"
                                      : acao.percentual < 50
                                        ? "#f97316"
                                        : acao.percentual < 75
                                          ? "#eab308"
                                          : acao.percentual < 100
                                            ? "#3b82f6"
                                            : "#22c55e"
                                } ${acao.percentual}%, #e5e7eb ${acao.percentual}%)`,
                              }}
                            />
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                acao.percentual === 0
                                  ? "bg-gray-100 text-gray-800"
                                  : acao.percentual < 25
                                    ? "bg-red-100 text-red-800"
                                    : acao.percentual < 50
                                      ? "bg-orange-100 text-orange-800"
                                      : acao.percentual < 75
                                        ? "bg-yellow-100 text-yellow-800"
                                        : acao.percentual < 100
                                          ? "#3b82f6"
                                          : "#22c55e"
                              }`}
                            >
                              {acao.percentual}%
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {editingPendenciaId === acao.id ? (
                            <div className="flex justify-center space-x-1">
                              <button
                                onClick={cancelEditingPendencia}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                                title="Cancelar edição"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <button
                                onClick={saveEditingPendencia}
                                className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-50"
                                title="Salvar alterações"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditingPendencia(acao.id)}
                              className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                              title="Editar pendência"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-4">
              <div className="flex gap-2">
                <button
                  className={`px-2 py-1 text-xs ${
                    itemsPerPage === 10 ? "bg-blue-600 text-white" : "border hover:bg-gray-50"
                  } rounded`}
                  onClick={() => {
                    setItemsPerPage(10)
                    setCurrentPage(1)
                  }}
                >
                  10
                </button>
                <button
                  className={`px-2 py-1 text-xs ${
                    itemsPerPage === 15 ? "bg-blue-600 text-white" : "border hover:bg-gray-50"
                  } rounded`}
                  onClick={() => {
                    setItemsPerPage(15)
                    setCurrentPage(1)
                  }}
                >
                  15
                </button>
                <button
                  className={`px-2 py-1 text-xs ${
                    itemsPerPage === 25 ? "bg-blue-600 text-white" : "border hover:bg-gray-50"
                  } rounded`}
                  onClick={() => {
                    setItemsPerPage(25)
                    setCurrentPage(1)
                  }}
                >
                  25
                </button>
                <button
                  className={`px-2 py-1 text-xs ${
                    itemsPerPage === 9999 ? "bg-blue-600 text-white" : "border hover:bg-gray-50"
                  } rounded`}
                  onClick={() => {
                    setItemsPerPage(9999)
                    setCurrentPage(1)
                  }}
                >
                  Todos
                </button>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 text-xs rounded ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Anterior
                  </button>

                  <span className="text-xs text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 text-xs rounded ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Próxima
                  </button>
                </div>
              )}

              <div className="text-xs text-gray-500 flex items-center">
                {filteredPendencias.length} {filteredPendencias.length === 1 ? "registro" : "registros"}
                {filteredPendencias.length > 0 && ` (mostrando ${Math.min(paginatedPendencias.length, itemsPerPage)})`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ata atual */}
      <div className="border-b">
        <div
          className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setAtaExpanded(!ataExpanded)}
        >
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            <h2 className="text-base font-medium">Ata atual</h2>
          </div>
          {ataExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>

        {ataExpanded && (
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <div>
                {acoes.length > 0 && (
                  <>
                    {acoesEditMode ? (
                      <button
                        className="px-3 py-1.5 bg-green-600 text-white rounded border border-green-700 flex items-center text-sm hover:bg-green-700 transition-colors duration-200"
                        onClick={() => {
                          // Desativar o modo de edição
                          setAcoesEditMode(false)

                          // Criar um elemento de notificação personalizado
                          const notificacao = document.createElement("div")
                          notificacao.className =
                            "fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md z-50 border-l-4 border-green-500 animate-slide-in"
                          notificacao.style.cssText =
                            "animation: slideIn 0.3s ease-out forwards; transform: translateX(100%);"

                          // Criar o conteúdo da notificação
                          const titulo = document.createElement("div")
                          titulo.className = "text-lg font-semibold text-gray-800 flex items-center"
                          titulo.innerHTML =
                            '<svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Ações salvas com sucesso!'

                          // Criar a lista de ações
                          const lista = document.createElement("div")
                          lista.className = "mt-2 text-sm text-gray-600 max-h-60 overflow-y-auto"

                          if (acoes.length > 0) {
                            const tabela = document.createElement("table")
                            tabela.className = "w-full"

                            // Cabeçalho da tabela
                            const cabecalho = document.createElement("thead")
                            cabecalho.innerHTML = `
                              <tr class="border-b border-gray-200">
                                <th class="text-left py-1 font-medium">Ação</th>
                                <th class="text-left py-1 font-medium">Responsável</th>
                              </tr>
                            `

                            // Corpo da tabela
                            const corpo = document.createElement("tbody")
                            acoes.forEach((acao) => {
                              const tr = document.createElement("tr")
                              tr.className = "border-b border-gray-100"
                              tr.innerHTML = `
                                <td class="py-1">${acao.descricao}</td>
                                <td class="py-1">${acao.responsavel}</td>
                              `
                              corpo.appendChild(tr)
                            })

                            tabela.appendChild(cabecalho)
                            tabela.appendChild(corpo)
                            lista.appendChild(tabela)
                          } else {
                            lista.textContent = "Nenhuma ação foi salva."
                          }

                          // Botão de fechar
                          const botaoFechar = document.createElement("button")
                          botaoFechar.className = "absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                          botaoFechar.innerHTML =
                            '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
                          botaoFechar.onclick = () => {
                            notificacao.style.cssText = "animation: slideOut 0.3s ease-in forwards;"
                            setTimeout(() => {
                              if (document.body.contains(notificacao)) {
                                document.body.removeChild(notificacao)
                              }
                            }, 300)
                          }

                          // Adicionar elementos à notificação
                          notificacao.appendChild(titulo)
                          notificacao.appendChild(lista)
                          notificacao.appendChild(botaoFechar)

                          // Adicionar a notificação ao corpo do documento
                          document.body.appendChild(notificacao)

                          // Adicionar estilos de animação
                          const style = document.createElement("style")
                          style.textContent = `
                            @keyframes slideIn {
                              from { transform: translateX(100%); }
                              to { transform: translateX(0); }
                            }
                            @keyframes slideOut {
                              from { transform: translateX(0); }
                              to { transform: translateX(100%); }
                            }
                            .animate-slide-in {
                              animation: slideIn 0.3s ease-out forwards;
                            }
                          `
                          document.head.appendChild(style)

                          // Remover a notificação após 5 segundos
                          setTimeout(() => {
                            if (document.body.contains(notificacao)) {
                              notificacao.style.cssText = "animation: slideOut 0.3s ease-in forwards;"
                              setTimeout(() => {
                                if (document.body.contains(notificacao)) {
                                  document.body.removeChild(notificacao)
                                }
                              }, 300)
                            }
                          }, 5000)
                        }}
                      >
                        <Save className="h-4 w-4 mr-1" /> SALVAR AÇÕES
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 flex items-center text-sm hover:bg-blue-100 transition-colors duration-200"
                        onClick={() => setAcoesEditMode(true)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> EDITAR AÇÕES
                      </button>
                    )}
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {/* Substitua o botão ANEXOS existente e adicione a interface de anexos */}
                {/* Localize este trecho (por volta da linha 1000): */}
                {/* <button className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded border border-gray-200 flex items-center text-sm hover:bg-gray-100 transition-colors duration-200">
                  <Paperclip className="h-4 w-4 mr-1" /> ANEXOS
                </button> */}

                {/* E substitua por: */}
                <button
                  className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded border border-gray-200 flex items-center text-sm hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setShowAnexosPanel(!showAnexosPanel)}
                >
                  <Paperclip className="h-4 w-4 mr-1" /> ANEXOS
                </button>
                {acoesEditMode && (
                  <button
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 flex items-center text-sm hover:bg-blue-100 transition-colors duration-200"
                    onClick={adicionarAcao}
                  >
                    <Plus className="h-4 w-4 mr-1" /> NOVA AÇÃO
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Ação</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Quem</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Previsto</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Realizado</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Percentual</th>
                    <th className="text-center p-3 text-sm font-medium text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {acoes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500 text-sm">
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  ) : (
                    acoes.map((acao, index) => (
                      <tr
                        key={acao.id}
                        className={`border-t border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                      >
                        <td className="p-3">
                          {acoesEditMode ? (
                            <input
                              type="text"
                              value={acao.descricao}
                              onChange={(e) => {
                                const newAcoes = [...acoes]
                                newAcoes[index] = { ...newAcoes[index], descricao: e.target.value }
                                setAcoes(newAcoes)
                              }}
                              className="w-full h-8 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Descrição da ação"
                            />
                          ) : (
                            <span className="text-sm">{acao.descricao}</span>
                          )}
                        </td>
                        <td className="p-3">
                          {acoesEditMode ? (
                            <input
                              type="text"
                              value={acao.responsavel}
                              onChange={(e) => {
                                const newAcoes = [...acoes]
                                newAcoes[index] = { ...newAcoes[index], responsavel: e.target.value }
                                setAcoes(newAcoes)
                              }}
                              className="w-full h-8 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Responsável"
                            />
                          ) : (
                            <span className="text-sm">{acao.responsavel}</span>
                          )}
                        </td>
                        <td className="p-3">
                          {acoesEditMode ? (
                            <input
                              type="date"
                              value={acao.previsto}
                              onChange={(e) => {
                                const newAcoes = [...acoes]
                                newAcoes[index] = { ...newAcoes[index], previsto: e.target.value }
                                setAcoes(newAcoes)
                              }}
                              className="w-full h-8 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="text-sm">
                              {acao.previsto ? new Date(acao.previsto).toLocaleDateString("pt-BR") : "—"}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {acoesEditMode ? (
                            <input
                              type="date"
                              value={acao.realizado}
                              onChange={(e) => {
                                const newAcoes = [...acoes]
                                newAcoes[index] = { ...newAcoes[index], realizado: e.target.value }
                                setAcoes(newAcoes)
                              }}
                              className="w-full h-8 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="text-sm">
                              {acao.realizado ? new Date(acao.realizado).toLocaleDateString("pt-BR") : "—"}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {acoesEditMode ? (
                            <select
                              value={acao.status}
                              onChange={(e) => {
                                const newAcoes = [...acoes]
                                newAcoes[index] = { ...newAcoes[index], status: e.target.value }
                                setAcoes(newAcoes)
                              }}
                              className="w-full h-8 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Pendente">Pendente</option>
                              <option value="Em andamento">Em andamento</option>
                              <option value="Concluído">Concluído</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          ) : (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(acao.status)}`}
                            >
                              {acao.status}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {acoesEditMode ? (
                              <>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  step="5"
                                  value={acao.percentual}
                                  onChange={(e) => {
                                    const newAcoes = [...acoes]
                                    const value = Math.min(Number.parseInt(e.target.value) || 0, 100)
                                    newAcoes[index] = { ...newAcoes[index], percentual: value }
                                    setAcoes(newAcoes)
                                  }}
                                  className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                                  style={{
                                    background: `linear-gradient(to right, ${
                                      acao.percentual === 0
                                        ? "#e5e7eb"
                                        : acao.percentual < 25
                                          ? "#ef4444"
                                          : acao.percentual < 50
                                            ? "#f97316"
                                            : acao.percentual < 75
                                              ? "#eab308"
                                              : acao.percentual < 100
                                                ? "#3b82f6"
                                                : "#22c55e"
                                    } ${acao.percentual}%, #e5e7eb ${acao.percentual}%)`,
                                  }}
                                />
                                <span
                                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                    acao.percentual === 0
                                      ? "bg-gray-100 text-gray-800"
                                      : acao.percentual < 25
                                        ? "bg-red-100 text-red-800"
                                        : acao.percentual < 50
                                          ? "bg-orange-100 text-orange-800"
                                          : acao.percentual < 75
                                            ? "bg-yellow-100 text-yellow-800"
                                            : acao.percentual < 100
                                              ? "#3b82f6"
                                              : "#22c55e"
                                  }`}
                                >
                                  {acao.percentual}%
                                </span>
                              </>
                            ) : (
                              <div className="w-full flex items-center gap-2">
                                <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      acao.percentual === 0
                                        ? "#e5e7eb"
                                        : acao.percentual < 25
                                          ? "#ef4444"
                                          : acao.percentual < 50
                                            ? "#f97316"
                                            : acao.percentual < 75
                                              ? "#eab308"
                                              : acao.percentual < 100
                                                ? "#3b82f6"
                                                : "#22c55e"
                                    }`}
                                    style={{ width: `${acao.percentual}%` }}
                                  ></div>
                                </div>
                                <span
                                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                    acao.percentual === 0
                                      ? "bg-gray-100 text-gray-800"
                                      : acao.percentual < 25
                                        ? "bg-red-100 text-red-800"
                                        : acao.percentual < 50
                                          ? "bg-orange-100 text-orange-800"
                                          : acao.percentual < 75
                                            ? "bg-yellow-100 text-yellow-800"
                                            : acao.percentual < 100
                                              ? "#3b82f6"
                                              : "#22c55e"
                                  }`}
                                >
                                  {acao.percentual}%
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {acoesEditMode && (
                            <button
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                              onClick={() => iniciarExclusaoAcao(acao.id)}
                              title="Remover ação"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal de confirmação de exclusão de ação */}
            {acaoParaExcluir && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                  <div className="flex items-center mb-4 text-amber-600">
                    <AlertTriangle className="h-6 w-6 mr-2" />
                    <h3 className="text-lg font-semibold">Confirmar exclusão</h3>
                  </div>
                  <p className="mb-6 text-gray-700">
                    Tem certeza que deseja excluir a ação{" "}
                    <span className="font-semibold">"{descricaoAcaoParaExcluir}"</span>?
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={cancelarExclusaoAcao}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={confirmarExclusaoAcao}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Adicione a interface de anexos logo após a tabela de ações (por volta da linha 1200, antes do fechamento da div que contém a tabela): */}
            {showAnexosPanel && (
              <div className="mt-4 border rounded-lg p-4 bg-white">
                <h3 className="text-lg font-semibold mb-4">Anexos</h3>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Descrição anexo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={descricaoAnexo}
                      onChange={(e) => setDescricaoAnexo(e.target.value)}
                    />
                  </div>
                  <div
                    className="flex-1 border border-gray-300 rounded-md flex items-center justify-center cursor-pointer bg-gray-50"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <p className="text-gray-500 text-sm">
                      {arquivoSelecionado ? arquivoSelecionado.name : "Arraste ou clique para selecionar o arquivo"}
                    </p>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors uppercase font-semibold"
                    onClick={handleAnexar}
                  >
                    Anexar
                  </button>
                </div>

                {anexos.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Descrição
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Visualizar
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Excluir
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {anexos.map((anexo) => (
                          <tr key={anexo.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{anexo.descricao}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                type="button"
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => handleVisualizarAnexo(anexo)}
                              >
                                Visualizar
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-900"
                                onClick={() => iniciarExclusaoAnexo(anexo.id)}
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Modal de confirmação de exclusão de anexo */}
                {anexoParaExcluir && (
                  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                      <div className="flex items-center mb-4 text-amber-600">
                        <AlertTriangle className="h-6 w-6 mr-2" />
                        <h3 className="text-lg font-semibold">Confirmar exclusão</h3>
                      </div>
                      <p className="mb-6 text-gray-700">
                        Tem certeza que deseja excluir o anexo{" "}
                        <span className="font-semibold">"{descricaoAnexoParaExcluir}"</span>?
                      </p>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={cancelarExclusaoAnexo}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={confirmarExclusaoAnexo}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Observação */}
      <div className="p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Observação</label>
        <textarea
          placeholder="Digite suas observações sobre a reunião..."
          value={observacao}
          onChange={(e) => {
            // Limita o texto a 1024 caracteres
            if (e.target.value.length <= 1024) {
              setObservacao(e.target.value)
            }
          }}
          maxLength={1024}
          className="w-full h-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <div className="flex justify-end mt-1">
          <span
            className={`text-xs ${observacao.length > 900 ? (observacao.length > 1000 ? "text-red-500 font-medium" : "text-amber-500") : "text-gray-500"}`}
          >
            {observacao.length}/1024 caracteres
          </span>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="mt-6 border-t border-gray-200 pt-4 bg-gray-50">
        <div className="flex justify-center gap-4 px-4 py-4">
          <button className="px-5 py-2.5 bg-gray-600 text-white rounded-md flex items-center justify-center min-w-[180px] transition-all duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm">
            <X className="mr-2 h-4 w-4" /> ENCERRAR REUNIÃO
          </button>
          <button
            className="px-5 py-2.5 bg-blue-500 text-white rounded-md flex items-center justify-center min-w-[180px] transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
            onClick={handleSaveReuniao}
          >
            <Save className="mr-2 h-4 w-4" /> SALVAR REUNIÃO
          </button>
          <button
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-md flex items-center justify-center min-w-[180px] transition-all duration-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-sm"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
          >
            {isExportingPdf ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                GERANDO...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" /> EXPORTAR
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de erro ao salvar */}
      {showSaveErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4 text-red-600">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Não é possível salvar</h3>
            </div>
            <p className="mb-2 text-gray-700">
              Existem campos em edição que precisam ser salvos ou cancelados antes de prosseguir:
            </p>
            <ul className="list-disc pl-5 mb-6 text-gray-700">
              {saveErrorMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSaveErrorModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de envio por email */}
      {showEmailConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4 text-blue-600">
              <Save className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Reunião pronta para salvar</h3>
            </div>
            <p className="mb-6 text-gray-700">
              Deseja enviar esta reunião por email para os participantes ou outras pessoas?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleConfirmEmailSend(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 transition-colors"
              >
                Apenas Salvar
              </button>
              <button
                onClick={() => handleConfirmEmailSend(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Salvar e Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para informar emails */}
      {showEmailSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4 text-blue-600">
              <Mail className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Enviar Reunião por Email</h3>
            </div>

            <div className="mb-4">
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={sendToAllParticipants}
                  onChange={(e) => setSendToAllParticipants(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-700">Enviar para todos os participantes presentes</span>
              </label>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Emails (separados por vírgula)</label>
              <textarea
                value={emailList}
                onChange={(e) => setEmailList(e.target.value)}
                className="w-full h-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="exemplo@email.com, outro@email.com"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEmailSendModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Enviar Reunião
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de download do PDF */}
      {showDownloadConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4 text-emerald-600">
              <FileText className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">PDF gerado com sucesso</h3>
            </div>
            <p className="mb-6 text-gray-700">
              O arquivo <span className="font-semibold">{generatedPdfFileName}</span> foi gerado com sucesso. Deseja
              baixar o arquivo agora?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDownloadConfirmModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 transition-colors"
              >
                Não
              </button>
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
              >
                Baixar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de opções de exportação */}
      {showExportOptionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4 text-emerald-600">
              <FileText className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Opções de Exportação</h3>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    exportOptions.format === "pdf"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => setExportOptions({ ...exportOptions, format: "pdf" })}
                >
                  PDF
                </button>
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    exportOptions.format === "docx"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => setExportOptions({ ...exportOptions, format: "docx" })}
                >
                  Word (DOCX)
                </button>
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    exportOptions.format === "xlsx"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => setExportOptions({ ...exportOptions, format: "xlsx" })}
                >
                  Excel (XLSX)
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeParticipants}
                    onChange={(e) => setExportOptions({ ...exportOptions, includeParticipants: e.target.checked })}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Incluir lista de participantes</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includePendingActions}
                    onChange={(e) => setExportOptions({ ...exportOptions, includePendingActions: e.target.checked })}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Incluir ações pendentes</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeCompletedActions}
                    onChange={(e) => setExportOptions({ ...exportOptions, includeCompletedActions: e.target.checked })}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Incluir ações concluídas</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeAttachments}
                    onChange={(e) => setExportOptions({ ...exportOptions, includeAttachments: e.target.checked })}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Incluir anexos</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeObservations}
                    onChange={(e) => setExportOptions({ ...exportOptions, includeObservations: e.target.checked })}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Incluir observações</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.addWatermark}
                    onChange={(e) => setExportOptions({ ...exportOptions, addWatermark: e.target.checked })}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Adicionar marca d'água da empresa</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowExportOptionsModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleShowPreview}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Visualizar
              </button>
              <button
                onClick={handleProcessExport}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
              >
                Exportar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de prévia do documento */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-emerald-600">
                <FileText className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-semibold">Prévia do Documento</h3>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-grow overflow-auto border border-gray-200 rounded-lg bg-gray-50 mb-4">
              <div className="p-8 bg-white mx-auto my-4 max-w-[800px] shadow-lg min-h-[800px]">
                {/* Cabeçalho do documento */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">Ata de Reunião</h1>
                  <p className="text-gray-600">Encontro Nº {encontroNum}</p>
                  <p className="text-gray-600">Data: {formatarData(dataInicio)}</p>
                  <p className="text-gray-600">
                    Horário: {formatarHora(horaInicio)} às {horaFinal || "—"}
                  </p>
                </div>

                {/* Participantes */}
                {exportOptions.includeParticipants && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">Participantes</h2>
                    <div className="grid grid-cols-2 gap-2">
                      {participantes.map((p) => (
                        <div key={p.id} className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${p.presente ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          <span>
                            {p.nome} {p.substituto && p.nomeSubstituto ? `(Substituto: ${p.nomeSubstituto})` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ações pendentes */}
                {exportOptions.includePendingActions && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">Ações Pendentes</h2>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-2 border">Ação</th>
                          <th className="text-left p-2 border">Responsável</th>
                          <th className="text-left p-2 border">Prazo</th>
                          <th className="text-left p-2 border">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendencias
                          .filter(
                            (p) => p.status.toLowerCase() !== "concluído" && p.status.toLowerCase() !== "cancelado",
                          )
                          .map((p) => (
                            <tr key={p.id} className="border">
                              <td className="p-2 border">{p.descricao}</td>
                              <td className="p-2 border">{p.responsavel}</td>
                              <td className="p-2 border">{formatarData(p.previsto)}</td>
                              <td className="p-2 border">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(p.status)}`}>
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Ações concluídas */}
                {exportOptions.includeCompletedActions && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">Ações Concluídas</h2>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-2 border">Ação</th>
                          <th className="text-left p-2 border">Responsável</th>
                          <th className="text-left p-2 border">Concluído em</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendencias
                          .filter((p) => p.status.toLowerCase() === "concluído")
                          .map((p) => (
                            <tr key={p.id} className="border">
                              <td className="p-2 border">{p.descricao}</td>
                              <td className="p-2 border">{p.responsavel}</td>
                              <td className="p-2 border">{formatarData(p.realizado)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Observações */}
                {exportOptions.includeObservations && observacao && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">Observações</h2>
                    <p className="text-sm whitespace-pre-line">{observacao}</p>
                  </div>
                )}

                {/* Anexos */}
                {exportOptions.includeAttachments && anexos.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">Anexos</h2>
                    <ul className="list-disc pl-5">
                      {anexos.map((a) => (
                        <li key={a.id} className="text-sm">
                          {a.descricao}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Marca d'água */}
                {exportOptions.addWatermark && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[-30deg]">
                    <div className="text-6xl font-bold text-gray-500">CONFIDENCIAL</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClosePreview}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 transition-colors"
              >
                Voltar às Opções
              </button>
              <button
                onClick={handleProcessExport}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
              >
                Exportar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Nova Ação */}
      <NovaAcaoModal
        isOpen={isNovaAcaoModalOpen}
        onClose={() => setIsNovaAcaoModalOpen(false)}
        onSave={handleSaveNovaAcao}
        responsaveis={[
          { id: "1", nome: "ADM" },
          { id: "2", nome: "Gerente de Operações" },
          { id: "3", nome: "Coordenador de Segurança" },
          { id: "4", nome: "João Silva" },
          { id: "5", nome: "Maria Oliveira" },
          { id: "6", nome: "Carlos Santos" },
          { id: "7", nome: "Ana Costa" },
          { id: "8", nome: "Roberto Almeida" },
          { id: "9", nome: "Fernanda Lima" },
          { id: "10", nome: "Paulo Mendes" },
          { id: "11", nome: "Luciana Ferreira" },
        ]}
      />
    </div>
  )
}

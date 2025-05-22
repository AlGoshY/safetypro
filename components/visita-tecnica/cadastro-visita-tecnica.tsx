"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Calendar,
  Check,
  ChevronDown,
  ClipboardCheck,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CadastroAcaoModal } from "./cadastro-acao-modal"

export default function CadastroVisitaTecnica() {
  const [mode, setMode] = useState<"consulta" | "cadastro">("consulta")
  const [currentStep, setCurrentStep] = useState(1)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [participantes, setParticipantes] = useState<Array<{ id: number; nome: string; substituto: string }>>([])
  const [assuntos, setAssuntos] = useState<Array<{ id: number; assunto: string }>>([])
  const [evidencias, setEvidencias] = useState<
    Array<{
      id: number
      requerimento: string
      levantamento: string
      evidencia: string
      observacao: string
      status: string
    }>
  >([
    {
      id: 1,
      requerimento: "Plano de Atendimento a Emergência",
      levantamento: "Simulado",
      evidencia:
        "Verificar se os simulados estão sendo realizados (ATA) Simulado de evacuação: pelo menos duas vezes no ano (um em cada semestre) Simulado de combate incêndio, primeiros socorros, vazamento de amônia, espaço confinado: um vez ao ano.",
      observacao: "",
      status: "Pendente",
    },
    {
      id: 2,
      requerimento: "Planejamento Anual",
      levantamento: "ATA",
      evidencia:
        "Verificar as ATAs das reuniões mensais realizadas junto a equipe SST para alinhamento e acompanhamento do planejamento anual.",
      observacao: "",
      status: "Pendente",
    },
    {
      id: 3,
      requerimento: "Diário de Bordo",
      levantamento: "Roteiro TST",
      evidencia:
        "Verificar se o roteiro proposto ao TST está sendo realizado semanalmente e acompanhado pelo EST através da assinatura no documento.",
      observacao: "",
      status: "Pendente",
    },
  ])
  const [anexos, setAnexos] = useState<Record<number, File | null>>({})
  const [acoes, setAcoes] = useState<
    Array<{
      id: number
      problema: string
      causa: string
      acao: string
      observacao: string
      requerimento: string
      responsavel: string
      dataPrevisao: string
      prioridade: string
      resolvido: boolean
      status: string
      anexos?: Array<{ codigo: string; tipo: string; descricao: string; data: string }>
    }>
  >([
    {
      id: 1,
      problema: "fgd",
      causa: "fdgfd",
      acao: "fgdgf",
      observacao: "dfgfd",
      requerimento: "DDS - Implementado",
      responsavel: "Chaves Gerente ADM do SST",
      dataPrevisao: "18/12/2024",
      prioridade: "Baixa",
      resolvido: false,
      status: "Atrasada",
      anexos: [{ codigo: "178", tipo: "Anomalia", descricao: "fgfdg", data: "Invalid date" }],
    },
  ])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [showVisualizarModal, setShowVisualizarModal] = useState(false)
  const [visitaParaVisualizar, setVisitaParaVisualizar] = useState<{
    id: number
    codigo: string
    unidade: string
    tipo: string
    dataInicio: string
    dataFim: string
    status: string
  } | null>(null)
  const [showAcaoModal, setShowAcaoModal] = useState(false)

  // Novos estados para controlar os valores dos campos de participante
  const [selectedParticipante, setSelectedParticipante] = useState<string>("")
  const [substitutoText, setSubstitutoText] = useState<string>("")

  // Referência para o input de substituto
  const substitutoInputRef = useRef<HTMLInputElement>(null)

  // Dados de exemplo para a tabela de consulta
  const [visitasExemplo, setVisitasExemplo] = useState<
    Array<{
      id: number
      codigo: string
      unidade: string
      tipo: string
      dataInicio: string
      dataFim: string
      status: string
    }>
  >([
    {
      id: 1,
      codigo: "VT-2023-001",
      unidade: "MATRIZ",
      tipo: "Interna",
      dataInicio: "10/04/2023",
      dataFim: "10/04/2023",
      status: "Concluída",
    },
    {
      id: 2,
      codigo: "VT-2023-002",
      unidade: "FILIAL 01",
      tipo: "Externa",
      dataInicio: "15/05/2023",
      dataFim: "15/05/2023",
      status: "Concluída",
    },
    {
      id: 3,
      codigo: "VT-2023-003",
      unidade: "DOTSE - DEMONSTRAÇÃO",
      tipo: "Auditoria",
      dataInicio: "22/06/2023",
      dataFim: "23/06/2023",
      status: "Em andamento",
    },
    {
      id: 4,
      codigo: "VT-2023-004",
      unidade: "MATRIZ",
      tipo: "Fiscalização",
      dataInicio: "05/07/2023",
      dataFim: "05/07/2023",
      status: "Pendente",
    },
  ])

  const handleAddParticipante = () => {
    if (selectedParticipante) {
      const novoParticipante = {
        id: participantes.length + 1,
        nome: selectedParticipante,
        substituto: substitutoText || "Não definido",
      }
      setParticipantes([...participantes, novoParticipante])

      // Limpar os campos após adicionar
      setSelectedParticipante("")
      setSubstitutoText("")

      // Exibir mensagem de sucesso
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    }
  }

  const handleRemoveParticipante = (id: number) => {
    setParticipantes(participantes.filter((p) => p.id !== id))
  }

  const handleAddAssunto = () => {
    const novoAssunto = {
      id: assuntos.length + 1,
      assunto: "",
    }
    setAssuntos([...assuntos, novoAssunto])
  }

  const handleRemoveAssunto = (id: number) => {
    setAssuntos(assuntos.filter((a) => a.id !== id))
  }

  const handleAddAcao = () => {
    setShowAcaoModal(true)
  }

  const handleSaveAcao = (novaAcao: any) => {
    const id = acoes.length + 1
    setAcoes([
      ...acoes,
      {
        id,
        ...novaAcao,
        status: "Pendente",
      },
    ])

    // Exibe mensagem de sucesso
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  const handleFileUpload = (evidenciaId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      setAnexos((prev) => ({
        ...prev,
        [evidenciaId]: file,
      }))

      // Exibe mensagem de sucesso
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    }
  }

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleNovaVisita = () => {
    setMode("cadastro")
    setCurrentStep(1)
  }

  const handleVoltarConsulta = () => {
    setMode("consulta")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulação de envio para API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setShowSuccessMessage(true)

      setTimeout(() => {
        setShowSuccessMessage(false)
        setMode("consulta")
      }, 3000)

      // Limpar formulário ou redirecionar
    } catch (error) {
      console.error("Erro ao salvar:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const cards = [
    {
      id: "interna",
      title: "Visita Interna",
      description: "Visita realizada dentro da própria empresa",
      icon: <FileText className="h-8 w-8 text-blue-500" />,
    },
    {
      id: "externa",
      title: "Visita Externa",
      description: "Visita realizada em outras empresas ou locais",
      icon: <ClipboardCheck className="h-8 w-8 text-green-500" />,
    },
    {
      id: "auditoria",
      title: "Auditoria",
      description: "Visita com objetivo de auditoria de processos",
      icon: <Eye className="h-8 w-8 text-amber-500" />,
    },
    {
      id: "fiscalizacao",
      title: "Fiscalização",
      description: "Visita de fiscalização de órgãos reguladores",
      icon: <Check className="h-8 w-8 text-red-500" />,
    },
  ]

  const handleDelete = (id: number) => {
    // Filtra o array removendo o item com o ID correspondente
    const novasVisitas = visitasExemplo.filter((visita) => visita.id !== id)
    setVisitasExemplo(novasVisitas)

    // Exibe mensagem de sucesso temporária
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)

    // Fecha o diálogo
    setIsDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  // Definição dos passos
  const steps = [
    { id: 1, label: "Filtros" },
    { id: 2, label: "Selecionar Cartão" },
    { id: 3, label: "Checklist" },
    { id: 4, label: "Dados da Visita" },
    { id: 5, label: "Revisão" },
  ]

  return (
    <>
      {/* Mensagem de sucesso */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center bg-white border-l-4 border-green-500 py-2 px-3 shadow-md rounded-md">
          <div className="text-green-500 rounded-full mr-3">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-sm font-medium">Operação realizada com sucesso!</div>
        </div>
      )}

      {/* Modal de Cadastro de Ação */}
      {showAcaoModal && <CadastroAcaoModal onClose={() => setShowAcaoModal(false)} onSave={handleSaveAcao} />}

      {/* Modo Consulta */}
      {mode === "consulta" && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Consulta de Visitas Técnicas</CardTitle>
              <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNovaVisita}>
                <Plus className="h-4 w-4 mr-2" />
                NOVA VISITA
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as unidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as unidades</SelectItem>
                      <SelectItem value="dotse">DOTSE - DEMONSTRAÇÃO</SelectItem>
                      <SelectItem value="matriz">MATRIZ</SelectItem>
                      <SelectItem value="filial1">FILIAL 01</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                  <div className="flex space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Data inicial"}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Data final"}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="andamento">Em andamento</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <Button type="button" className="bg-red-600 hover:bg-red-700 text-white">
                  <Search className="h-4 w-4 mr-2" />
                  CONSULTAR
                </Button>
              </div>

              <div className="border rounded-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Código
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Unidade
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
                        Data Início
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Data Fim
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
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {visitasExemplo.map((visita) => (
                      <tr key={visita.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {visita.codigo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visita.unidade}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visita.tipo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visita.dataInicio}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visita.dataFim}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            visita.status === "Concluída"
                              ? "bg-green-100 text-green-800"
                              : visita.status === "Em andamento"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                          >
                            {visita.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() => {
                              // Simular navegação para a página de visualização
                              setShowSuccessMessage(true)
                              setTimeout(() => {
                                setShowSuccessMessage(false)
                                // Em um cenário real, usaríamos router.push ou window.location
                                // Aqui vamos simular abrindo um modal com os detalhes
                                setVisitaParaVisualizar(visita)
                                setShowVisualizarModal(true)
                              }, 500)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Visualizar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setItemToDelete(visita.id)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">Linhas por página:</span>
                  <Select defaultValue="10">
                    <SelectTrigger className="w-16">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-4">1-4 de 4</span>
                  <div className="flex">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 mr-2" disabled>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="sr-only">Anterior</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M6.1584 3.13514C5.95694 3.32401 5.94673 3.64042 6.13559 3.84188L9.565 7.49991L6.13559 11.1579C5.94673 11.3594 5.95694 11.6758 6.1584 11.8647C6.35986 12.0535 6.67627 12.0433 6.86514 11.8419L10.6151 7.84188C10.7954 7.64955 10.7954 7.35027 10.6151 7.15794L6.86514 3.15794C6.67627 2.95648 6.35986 2.94628 6.1584 3.13514Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="sr-only">Próximo</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modo Cadastro */}
      {mode === "cadastro" && (
        <form onSubmit={handleSubmit}>
          {/* Novo Stepper no estilo da imagem */}
          <div className="mb-8">
            <div className="flex justify-between items-center relative">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep === step.id
                        ? "bg-blue-500 text-white"
                        : currentStep > step.id
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <span className="text-lg font-medium">{step.id}</span>
                    )}
                  </div>
                  <span className="text-sm mt-2 text-center">{step.label}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-4">
              <div
                className="absolute h-1 bg-blue-500 top-0 left-0 right-0"
                style={{ width: `${(currentStep - 1) * 25}%` }}
              ></div>
              <div className="h-1 bg-gray-200 w-full"></div>
            </div>
          </div>

          {/* Step 1: Filtros */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                      <Input placeholder="Código" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Regional</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a regional" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sul">Sul</SelectItem>
                          <SelectItem value="sudeste">Sudeste</SelectItem>
                          <SelectItem value="centro-oeste">Centro-Oeste</SelectItem>
                          <SelectItem value="nordeste">Nordeste</SelectItem>
                          <SelectItem value="norte">Norte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dotse">DOTSE - DEMONSTRAÇÃO</SelectItem>
                          <SelectItem value="matriz">MATRIZ</SelectItem>
                          <SelectItem value="filial1">FILIAL 01</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={handleVoltarConsulta}>
                      Voltar para Consulta
                    </Button>
                    <Button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={(e) => {
                        e.preventDefault()
                        handleNextStep()
                      }}
                    >
                      Próximo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Selecionar Cartão */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Selecione o Tipo de Visita</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedCard === card.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                        onClick={() => setSelectedCard(card.id)}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="mb-3">{card.icon}</div>
                          <h3 className="font-medium text-lg mb-1">{card.title}</h3>
                          <p className="text-sm text-gray-500">{card.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                      Voltar
                    </Button>
                    <Button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={(e) => {
                        e.preventDefault()
                        handleNextStep()
                      }}
                      disabled={!selectedCard}
                    >
                      Próximo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Checklist */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Checklist de Visita</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Requerimento
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Levantamento
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Evidência
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Observação
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
                            Anexo
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {evidencias.map((evidencia) => (
                          <tr key={evidencia.id}>
                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                              {evidencia.requerimento}
                            </td>
                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                              {evidencia.levantamento}
                            </td>
                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{evidencia.evidencia}</td>
                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                              <Select defaultValue={evidencia.observacao || "pendente"}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="conforme">Conforme</SelectItem>
                                  <SelectItem value="nao-conforme">Não Conforme</SelectItem>
                                  <SelectItem value="pendente">Pendente</SelectItem>
                                  <SelectItem value="na">N/A</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Select defaultValue={evidencia.status}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pendente">Pendente</SelectItem>
                                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                                  <SelectItem value="Concluído">Concluído</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="relative">
                                <input
                                  type="file"
                                  id={`file-upload-${evidencia.id}`}
                                  className="sr-only"
                                  onChange={(e) => handleFileUpload(evidencia.id, e)}
                                />
                                <label
                                  htmlFor={`file-upload-${evidencia.id}`}
                                  className={`inline-flex items-center justify-center h-8 w-8 rounded-md border ${
                                    anexos[evidencia.id]
                                      ? "bg-green-50 border-green-500 text-green-500"
                                      : "border-gray-300 hover:bg-gray-50"
                                  } cursor-pointer`}
                                >
                                  {anexos[evidencia.id] ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Upload className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Anexar</span>
                                </label>
                                {anexos[evidencia.id] && (
                                  <div className="absolute top-full left-0 mt-1 text-xs text-green-600 whitespace-nowrap">
                                    {anexos[evidencia.id]?.name.length > 15
                                      ? `${anexos[evidencia.id]?.name.substring(0, 15)}...`
                                      : anexos[evidencia.id]?.name}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                      Voltar
                    </Button>
                    <Button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={(e) => {
                        e.preventDefault()
                        handleNextStep()
                      }}
                    >
                      Próximo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Dados da Visita */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados da Visita</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>Inclusão de participantes</span>
                          <ChevronDown className="h-5 w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row gap-2 mb-4">
                          <Select value={selectedParticipante} onValueChange={setSelectedParticipante}>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Usuário" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="João Silva">João Silva</SelectItem>
                              <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                              <SelectItem value="Pedro Oliveira">Pedro Oliveira</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Substituto"
                            className="flex-1"
                            value={substitutoText}
                            onChange={(e) => setSubstitutoText(e.target.value)}
                            ref={substitutoInputRef}
                          />
                          <Button
                            type="button"
                            className="bg-red-600 hover:bg-red-700 text-white md:w-auto"
                            onClick={handleAddParticipante}
                            disabled={!selectedParticipante}
                          >
                            INCLUIR
                          </Button>
                        </div>

                        {participantes.length > 0 && (
                          <div className="border rounded-md">
                            <div className="grid grid-cols-12 bg-gray-50 p-3 border-b">
                              <div className="col-span-5 font-medium">Participante</div>
                              <div className="col-span-5 font-medium">Substituto</div>
                              <div className="col-span-2 font-medium text-right">Excluir</div>
                            </div>
                            <div className="divide-y">
                              {participantes.map((participante) => (
                                <div key={participante.id} className="grid grid-cols-12 p-3">
                                  <div className="col-span-5">{participante.nome}</div>
                                  <div className="col-span-5">{participante.substituto}</div>
                                  <div className="col-span-2 text-right">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                      onClick={() => handleRemoveParticipante(participante.id)}
                                    >
                                      <X className="h-4 w-4" />
                                      <span className="sr-only">Excluir</span>
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>Inclusão de Assuntos</span>
                          <ChevronDown className="h-5 w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row gap-2 mb-4">
                          <Input placeholder="Assuntos" className="flex-1" />
                          <Button
                            type="button"
                            className="bg-red-600 hover:bg-red-700 text-white md:w-auto"
                            onClick={handleAddAssunto}
                          >
                            INCLUIR
                          </Button>
                        </div>

                        {assuntos.length > 0 && (
                          <div className="border rounded-md">
                            <div className="grid grid-cols-12 bg-gray-50 p-3 border-b">
                              <div className="col-span-10 font-medium">Assunto</div>
                              <div className="col-span-2 font-medium text-right">Excluir</div>
                            </div>
                            <div className="divide-y">
                              {assuntos.map((assunto) => (
                                <div key={assunto.id} className="grid grid-cols-12 p-3">
                                  <div className="col-span-10">
                                    {assunto.assunto || "Verificação de procedimentos de segurança"}
                                  </div>
                                  <div className="col-span-2 text-right">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                      onClick={() => handleRemoveAssunto(assunto.id)}
                                    >
                                      <X className="h-4 w-4" />
                                      <span className="sr-only">Excluir</span>
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>Follow up Planejamento</span>
                          <ChevronDown className="h-5 w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea placeholder="Follow up" className="min-h-[120px]" maxLength={1024} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>Considerações Gerais</span>
                          <ChevronDown className="h-5 w-5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea placeholder="Considerações Gerais" className="min-h-[120px]" maxLength={1024} />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                      Voltar
                    </Button>
                    <Button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={(e) => {
                        e.preventDefault()
                        handleNextStep()
                      }}
                    >
                      Próximo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Revisão */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revisão e Ações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Resumo da Visita</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tipo de Visita</p>
                        <p className="font-medium">
                          {selectedCard ? cards.find((c) => c.id === selectedCard)?.title : "Não selecionado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Data Início</p>
                        <p className="font-medium">
                          {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Não definida"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Data Fim</p>
                        <p className="font-medium">
                          {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Não definida"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Participantes</p>
                        <p className="font-medium">{participantes.length} participante(s)</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Assuntos</p>
                        <p className="font-medium">{assuntos.length} assunto(s)</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Itens de Checklist</p>
                        <p className="font-medium">{evidencias.length} item(ns)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Ações</h3>
                    <Card>
                      <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Ações</CardTitle>
                        <Button
                          type="button"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={handleAddAcao}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          INCLUIR AÇÕES
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {acoes.length > 0 ? (
                          <div className="border rounded-md overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Anomalia
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Solução
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Problema
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Ação
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Observação
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Quem
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Previsto
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Realizado
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
                                    Editar
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {acoes.map((acao) => (
                                  <tr key={acao.id}>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                                      {acao.anexos && acao.anexos.length > 0 && acao.anexos[0].tipo === "Anomalia" ? (
                                        <div className="w-24 h-24">
                                          <img
                                            src="/qr-code-generic.png"
                                            alt="QR Code"
                                            className="w-full h-full object-contain"
                                          />
                                        </div>
                                      ) : null}
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{acao.causa}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                                      {acao.problema}
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{acao.acao}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                                      {acao.observacao}
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                                      {acao.responsavel}
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                                      {acao.dataPrevisao}
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                                      {acao.resolvido ? acao.dataPrevisao : ""}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                      ${
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Editar</span>
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            Nenhuma ação cadastrada. Clique em "INCLUIR AÇÕES" para adicionar.
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-700 mr-2">Linhas por página:</span>
                            <Select defaultValue="10">
                              <SelectTrigger className="w-16">
                                <SelectValue placeholder="10" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center">
                            <span className="text-sm text-gray-700 mr-4">1-1 de 1</span>
                            <div className="flex">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 mr-2" disabled>
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 15 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                                <span className="sr-only">Anterior</span>
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 15 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M6.1584 3.13514C5.95694 3.32401 5.94673 3.64042 6.13559 3.84188L9.565 7.49991L6.13559 11.1579C5.94673 11.3594 5.95694 11.6758 6.1584 11.8647C6.35986 12.0535 6.67627 12.0433 6.86514 11.8419L10.6151 7.84188C10.7954 7.64955 10.7954 7.35027 10.6151 7.15794L6.86514 3.15794C6.67627 2.95648 6.35986 2.94628 6.1584 3.13514Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                                <span className="sr-only">Próximo</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                      Voltar
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⊚</span>
                          SALVANDO...
                        </>
                      ) : (
                        "FINALIZAR"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </form>
      )}

      {/* Modal de visualização de visita */}
      {showVisualizarModal && visitaParaVisualizar && (
        <AlertDialog open={showVisualizarModal} onOpenChange={setShowVisualizarModal}>
          <AlertDialogContent className="max-w-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Detalhes da Visita Técnica</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Código</p>
                    <p className="font-medium">{visitaParaVisualizar.codigo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Unidade</p>
                    <p className="font-medium">{visitaParaVisualizar.unidade}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tipo</p>
                    <p className="font-medium">{visitaParaVisualizar.tipo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data Início</p>
                    <p className="font-medium">{visitaParaVisualizar.dataInicio}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data Fim</p>
                    <p className="font-medium">{visitaParaVisualizar.dataFim}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="font-medium">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                 ${
                   visitaParaVisualizar.status === "Concluída"
                     ? "bg-green-100 text-green-800"
                     : visitaParaVisualizar.status === "Em andamento"
                       ? "bg-blue-100 text-blue-800"
                       : "bg-yellow-100 text-yellow-800"
                 }`}
                      >
                        {visitaParaVisualizar.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Observações</h4>
                  <p className="text-sm text-gray-500">
                    Esta visita técnica foi realizada conforme o planejamento anual. Foram verificados todos os itens do
                    checklist de segurança e conformidade.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Fechar</AlertDialogCancel>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  setShowVisualizarModal(false)
                  // Em um cenário real, navegaríamos para a página de edição
                  setShowSuccessMessage(true)
                  setTimeout(() => setShowSuccessMessage(false), 2000)
                }}
              >
                Editar Visita
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

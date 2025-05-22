"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Printer,
  RefreshCw,
  RotateCcw,
  Search,
  X,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"

// Interface para tipagem das reuniões
interface Reuniao {
  id: string
  numero: string
  data: string
  unidade: string
  tipo: string
  participantes: number
  acoes: number
  status: string
  pauta?: string
  responsavel?: string
  duracao?: string
  conclusoes?: string
}

export default function ConsultarReunioesPage() {
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined)
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined)
  const [unidade, setUnidade] = useState("")
  const [tipoReuniao, setTipoReuniao] = useState("")
  const [isFiltering, setIsFiltering] = useState(false)
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState<Reuniao | null>(null)

  const unidades = [
    { id: "1", nome: "Unidade 1" },
    { id: "2", nome: "Unidade 2" },
    { id: "3", nome: "Unidade 3" },
    { id: "4", nome: "Matriz" },
  ]

  const tiposReuniao = [
    { id: "1", nome: "CIPA" },
    { id: "2", nome: "Diretoria" },
    { id: "3", nome: "Departamento" },
    { id: "4", nome: "Segurança" },
    { id: "5", nome: "Planejamento" },
  ]

  // Dados mockados com informações adicionais para visualização
  const reunioes: Reuniao[] = [
    {
      id: "1",
      numero: "78",
      data: "07/05/2024",
      unidade: "Unidade 1",
      tipo: "CIPA",
      participantes: 8,
      acoes: 3,
      status: "Concluída",
      pauta:
        "Análise de acidentes do mês anterior, Revisão de procedimentos de segurança, Planejamento de treinamentos",
      responsavel: "João Silva",
      duracao: "1h 30min",
      conclusoes:
        "Aprovada a revisão dos procedimentos de segurança para o setor de produção. Definido cronograma de treinamentos para o próximo trimestre.",
    },
    {
      id: "2",
      numero: "77",
      data: "23/04/2024",
      unidade: "Matriz",
      tipo: "Segurança",
      participantes: 12,
      acoes: 5,
      status: "Concluída",
      pauta: "Avaliação de riscos em novos equipamentos, Atualização de EPIs, Revisão de protocolos de emergência",
      responsavel: "Maria Oliveira",
      duracao: "2h 15min",
      conclusoes:
        "Aprovada a compra de novos EPIs para o setor de manutenção. Definido grupo de trabalho para revisão dos protocolos de emergência.",
    },
    {
      id: "3",
      numero: "76",
      data: "09/04/2024",
      unidade: "Unidade 2",
      tipo: "Departamento",
      participantes: 6,
      acoes: 2,
      status: "Em andamento",
      pauta: "Planejamento estratégico Q2, Análise de indicadores de desempenho, Distribuição de tarefas",
      responsavel: "Carlos Mendes",
      duracao: "1h 45min",
      conclusoes: "Em andamento - pendente definição final de metas para Q2.",
    },
    {
      id: "4",
      numero: "75",
      data: "02/04/2024",
      unidade: "Unidade 3",
      tipo: "Planejamento",
      participantes: 10,
      acoes: 7,
      status: "Concluída",
      pauta: "Orçamento anual, Planejamento de projetos, Alocação de recursos",
      responsavel: "Ana Souza",
      duracao: "3h",
      conclusoes: "Aprovado orçamento para novos projetos. Definida a alocação de recursos para o segundo semestre.",
    },
    {
      id: "5",
      numero: "74",
      data: "26/03/2024",
      unidade: "Matriz",
      tipo: "Diretoria",
      participantes: 5,
      acoes: 4,
      status: "Cancelada",
      pauta: "Análise de resultados Q1, Revisão de metas anuais, Estratégia de expansão",
      responsavel: "Roberto Almeida",
      duracao: "N/A",
      conclusoes: "Reunião cancelada devido a compromissos urgentes da diretoria. Remarcada para 02/04/2024.",
    },
  ]

  const handleSearch = () => {
    setIsFiltering(true)
    // Aqui seria implementada a lógica de filtro real
    setTimeout(() => {
      setIsFiltering(false)
    }, 800)
  }

  const handleReset = () => {
    setDataInicio(undefined)
    setDataFim(undefined)
    setUnidade("")
    setTipoReuniao("")
  }

  const handleVisualizarReuniao = (reuniao: Reuniao) => {
    setReuniaoSelecionada(reuniao)
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Consultar Reuniões</h1>
          <p className="text-gray-500 mt-1">Pesquise e visualize todas as reuniões registradas</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4" />
          <span>{new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
        <h2 className="text-lg font-medium mb-4 text-gray-700 flex items-center">
          <Search className="h-5 w-5 mr-2 text-blue-500" />
          Filtros de Pesquisa
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Data Início</label>
            <div className="relative">
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={dataInicio ? format(dataInicio, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    setDataInicio(new Date(e.target.value))
                  } else {
                    setDataInicio(undefined)
                  }
                }}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Data Fim</label>
            <div className="relative">
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={dataFim ? format(dataFim, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    setDataFim(new Date(e.target.value))
                  } else {
                    setDataFim(undefined)
                  }
                }}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Unidade</label>
            <select
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
            >
              <option value="">Selecione a unidade</option>
              <option value="todos">Todas as unidades</option>
              {unidades.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tipo da Reunião</label>
            <select
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={tipoReuniao}
              onChange={(e) => setTipoReuniao(e.target.value)}
            >
              <option value="">Selecione o tipo</option>
              <option value="todos">Todos os tipos</option>
              {tiposReuniao.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button variant="outline" onClick={handleReset} className="border-gray-300">
            <RotateCcw className="mr-2 h-4 w-4" /> Limpar Filtros
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSearch} disabled={isFiltering}>
            {isFiltering ? (
              <>
                <span className="animate-spin mr-2">
                  <RefreshCw className="h-4 w-4" />
                </span>
                Pesquisando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Pesquisar
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-700">Resultados da Pesquisa</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-gray-500 border-gray-300">
              <FileText className="h-4 w-4 mr-1" /> Exportar
            </Button>
            <Button variant="outline" size="sm" className="text-gray-500 border-gray-300">
              <Printer className="h-4 w-4 mr-1" /> Imprimir
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="text-left p-4 font-medium">Nº</th>
                <th className="text-left p-4 font-medium">Data</th>
                <th className="text-left p-4 font-medium">Unidade</th>
                <th className="text-left p-4 font-medium">Tipo</th>
                <th className="text-center p-4 font-medium">Status</th>
                <th className="text-center p-4 font-medium">Participantes</th>
                <th className="text-center p-4 font-medium">Ações</th>
                <th className="text-center p-4 font-medium">Visualizar</th>
              </tr>
            </thead>
            <tbody>
              {reunioes.map((reuniao) => (
                <tr key={reuniao.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="p-4 text-gray-800">{reuniao.numero}</td>
                  <td className="p-4 text-gray-800">{reuniao.data}</td>
                  <td className="p-4 text-gray-800">{reuniao.unidade}</td>
                  <td className="p-4 text-gray-800">{reuniao.tipo}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reuniao.status === "Concluída"
                          ? "bg-green-100 text-green-800"
                          : reuniao.status === "Em andamento"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {reuniao.status}
                    </span>
                  </td>
                  <td className="p-4 text-center text-gray-800">{reuniao.participantes}</td>
                  <td className="p-4 text-center text-gray-800">{reuniao.acoes}</td>
                  <td className="p-4 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => handleVisualizarReuniao(reuniao)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> Visualizar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="flex justify-between items-center">
                            <span>Detalhes da Reunião #{reuniao.numero}</span>
                            <DialogClose asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <X className="h-4 w-4" />
                              </Button>
                            </DialogClose>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Data</h4>
                              <p className="text-gray-900">{reuniao.data}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Unidade</h4>
                              <p className="text-gray-900">{reuniao.unidade}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Tipo</h4>
                              <p className="text-gray-900">{reuniao.tipo}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Status</h4>
                              <p>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    reuniao.status === "Concluída"
                                      ? "bg-green-100 text-green-800"
                                      : reuniao.status === "Em andamento"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {reuniao.status}
                                </span>
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Responsável</h4>
                              <p className="text-gray-900">{reuniao.responsavel || "Não informado"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Duração</h4>
                              <p className="text-gray-900">{reuniao.duracao || "Não informado"}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Pauta</h4>
                            <p className="text-gray-900 mt-1">{reuniao.pauta || "Não informado"}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Conclusões</h4>
                            <p className="text-gray-900 mt-1">{reuniao.conclusoes || "Não informado"}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Participantes</h4>
                              <p className="text-gray-900">{reuniao.participantes}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Ações</h4>
                              <p className="text-gray-900">{reuniao.acoes}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                          <Button variant="outline" className="border-gray-300">
                            <FileText className="h-4 w-4 mr-2" /> Exportar Ata
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Eye className="h-4 w-4 mr-2" /> Ver Ações
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <div>Exibindo 5 de 24 reuniões</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-300">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-blue-50 text-blue-600 border-blue-200">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-300">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-300">
              3
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-300">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

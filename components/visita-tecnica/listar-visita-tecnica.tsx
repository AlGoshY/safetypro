"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Download, Eye, FileText, Pencil, Search, Trash2, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Tipos
interface VisitaTecnica {
  id: number
  empresa: string
  unidade: string
  dataVisita: Date
  responsavel: string
  status: "Agendada" | "Realizada" | "Cancelada" | "Em andamento"
  acoesCount: number
}

export function ListarVisitaTecnica() {
  const [visitas, setVisitas] = useState<VisitaTecnica[]>([])
  const [filteredVisitas, setFilteredVisitas] = useState<VisitaTecnica[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined)
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // Dados de exemplo
  useEffect(() => {
    // Simulando uma chamada de API
    const mockVisitas: VisitaTecnica[] = [
      {
        id: 1,
        empresa: "Empresa ABC",
        unidade: "Unidade São Paulo",
        dataVisita: new Date(2023, 4, 15),
        responsavel: "João Silva",
        status: "Realizada",
        acoesCount: 5,
      },
      {
        id: 2,
        empresa: "Indústria XYZ",
        unidade: "Unidade Rio de Janeiro",
        dataVisita: new Date(2023, 5, 20),
        responsavel: "Maria Oliveira",
        status: "Agendada",
        acoesCount: 0,
      },
      {
        id: 3,
        empresa: "Construtora Delta",
        unidade: "Unidade Belo Horizonte",
        dataVisita: new Date(2023, 6, 10),
        responsavel: "Carlos Santos",
        status: "Em andamento",
        acoesCount: 3,
      },
      {
        id: 4,
        empresa: "Metalúrgica Omega",
        unidade: "Unidade Curitiba",
        dataVisita: new Date(2023, 7, 5),
        responsavel: "Ana Pereira",
        status: "Cancelada",
        acoesCount: 0,
      },
      {
        id: 5,
        empresa: "Química Beta",
        unidade: "Unidade Salvador",
        dataVisita: new Date(2023, 8, 12),
        responsavel: "Roberto Almeida",
        status: "Realizada",
        acoesCount: 8,
      },
      {
        id: 6,
        empresa: "Alimentos Gama",
        unidade: "Unidade Fortaleza",
        dataVisita: new Date(2023, 9, 18),
        responsavel: "Fernanda Lima",
        status: "Agendada",
        acoesCount: 0,
      },
      {
        id: 7,
        empresa: "Têxtil Sigma",
        unidade: "Unidade Recife",
        dataVisita: new Date(2023, 10, 22),
        responsavel: "Paulo Mendes",
        status: "Realizada",
        acoesCount: 4,
      },
      {
        id: 8,
        empresa: "Transportes Alfa",
        unidade: "Unidade Porto Alegre",
        dataVisita: new Date(2023, 11, 7),
        responsavel: "Luciana Costa",
        status: "Em andamento",
        acoesCount: 2,
      },
      {
        id: 9,
        empresa: "Energia Epsilon",
        unidade: "Unidade Manaus",
        dataVisita: new Date(2024, 0, 14),
        responsavel: "Ricardo Souza",
        status: "Agendada",
        acoesCount: 0,
      },
      {
        id: 10,
        empresa: "Tecnologia Lambda",
        unidade: "Unidade Brasília",
        dataVisita: new Date(2024, 1, 28),
        responsavel: "Camila Rocha",
        status: "Realizada",
        acoesCount: 6,
      },
      {
        id: 11,
        empresa: "Farmacêutica Zeta",
        unidade: "Unidade Goiânia",
        dataVisita: new Date(2024, 2, 3),
        responsavel: "Marcelo Dias",
        status: "Cancelada",
        acoesCount: 0,
      },
      {
        id: 12,
        empresa: "Varejo Ômega",
        unidade: "Unidade Belém",
        dataVisita: new Date(2024, 3, 9),
        responsavel: "Juliana Martins",
        status: "Em andamento",
        acoesCount: 1,
      },
    ]

    setVisitas(mockVisitas)
    setFilteredVisitas(mockVisitas)
  }, [])

  // Aplicar filtros
  useEffect(() => {
    let result = [...visitas]

    // Filtro de texto (empresa, unidade ou responsável)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(
        (visita) =>
          visita.empresa.toLowerCase().includes(searchLower) ||
          visita.unidade.toLowerCase().includes(searchLower) ||
          visita.responsavel.toLowerCase().includes(searchLower),
      )
    }

    // Filtro de status
    if (statusFilter !== "todos") {
      result = result.filter((visita) => visita.status === statusFilter)
    }

    // Filtro de data início
    if (dataInicio) {
      result = result.filter((visita) => visita.dataVisita >= dataInicio)
    }

    // Filtro de data fim
    if (dataFim) {
      const dataFimAjustada = new Date(dataFim)
      dataFimAjustada.setHours(23, 59, 59, 999)
      result = result.filter((visita) => visita.dataVisita <= dataFimAjustada)
    }

    setFilteredVisitas(result)
    setCurrentPage(1) // Volta para a primeira página ao filtrar
  }, [visitas, searchTerm, statusFilter, dataInicio, dataFim])

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredVisitas.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredVisitas.length / itemsPerPage)

  // Navegar para a página de edição
  const handleEdit = (id: number) => {
    router.push(`/registros/visita-tecnica/cadastrar?id=${id}`)
  }

  // Abrir diálogo de confirmação de exclusão
  const handleDeleteClick = (id: number) => {
    setDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  // Confirmar exclusão
  const confirmDelete = () => {
    if (deleteId) {
      // Aqui seria a chamada para a API para excluir o registro
      setVisitas(visitas.filter((visita) => visita.id !== deleteId))
      toast({
        title: "Visita técnica excluída",
        description: "A visita técnica foi excluída com sucesso.",
        variant: "default",
      })
    }
    setIsDeleteDialogOpen(false)
    setDeleteId(null)
  }

  // Visualizar detalhes
  const handleView = (id: number) => {
    router.push(`/registros/visita-tecnica/visualizar?id=${id}`)
  }

  // Exportar para Excel
  const handleExport = () => {
    // Simulação de exportação para Excel
    const headers = ["ID", "Empresa", "Unidade", "Data da Visita", "Responsável", "Status", "Ações Registradas"]

    // Converter dados para formato CSV
    let csvContent = headers.join(",") + "\n"

    filteredVisitas.forEach((visita) => {
      const row = [
        visita.id,
        `"${visita.empresa}"`,
        `"${visita.unidade}"`,
        format(visita.dataVisita, "dd/MM/yyyy"),
        `"${visita.responsavel}"`,
        `"${visita.status}"`,
        visita.acoesCount,
      ]
      csvContent += row.join(",") + "\n"
    })

    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `visitas-tecnicas-${format(new Date(), "dd-MM-yyyy")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Exportação concluída",
      description: "O arquivo foi baixado com sucesso.",
      variant: "default",
    })
  }

  // Importar de Excel
  const handleImport = () => {
    // Criar input de arquivo oculto
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = ".csv,.xlsx,.xls"
    fileInput.style.display = "none"

    fileInput.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        // Simulação de processamento do arquivo
        setTimeout(() => {
          toast({
            title: "Importação concluída",
            description: `Arquivo "${file.name}" importado com sucesso. Foram processados ${Math.floor(Math.random() * 20) + 5} registros.`,
            variant: "default",
          })
        }, 1500)
      }
      document.body.removeChild(fileInput)
    }

    document.body.appendChild(fileInput)
    fileInput.click()
  }

  // Gerar relatório
  const handleGenerateReport = () => {
    // Simulação de geração de relatório PDF
    toast({
      title: "Gerando relatório",
      description: "O relatório está sendo preparado...",
      variant: "default",
    })

    // Simulação de processamento
    setTimeout(() => {
      // Criar conteúdo HTML para o relatório
      const reportContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Relatório de Visitas Técnicas</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1a56db; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f7ff; }
          </style>
        </head>
        <body>
          <h1>Relatório de Visitas Técnicas</h1>
          <p>Data de geração: ${format(new Date(), "dd/MM/yyyy HH:mm")}</p>
          <p>Total de visitas: ${filteredVisitas.length}</p>
          <table>
            <tr>
              <th>ID</th>
              <th>Empresa</th>
              <th>Unidade</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
            ${filteredVisitas
              .slice(0, 10)
              .map(
                (v) => `
              <tr>
                <td>${v.id}</td>
                <td>${v.empresa}</td>
                <td>${v.unidade}</td>
                <td>${format(v.dataVisita, "dd/MM/yyyy")}</td>
                <td>${v.status}</td>
              </tr>
            `,
              )
              .join("")}
          </table>
        </body>
        </html>
      `

      // Criar blob e link para download
      const blob = new Blob([reportContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `relatorio-visitas-${format(new Date(), "dd-MM-yyyy")}.html`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Relatório concluído",
        description: "O relatório foi gerado e baixado com sucesso.",
        variant: "default",
      })
    }, 2000)
  }

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("todos")
    setDataInicio(undefined)
    setDataFim(undefined)
  }

  // Renderizar paginação
  const renderPagination = () => {
    if (totalPages <= 1) return null

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Lógica para mostrar páginas ao redor da página atual
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink onClick={() => setCurrentPage(pageNum)} isActive={currentPage === pageNum}>
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
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

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Busca por texto */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por empresa, unidade ou responsável"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filtro por status */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="Agendada">Agendada</SelectItem>
              <SelectItem value="Realizada">Realizada</SelectItem>
              <SelectItem value="Em andamento">Em andamento</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>

          {/* Data início */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" type="button">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataInicio ? (
                    format(dataInicio, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span className="text-gray-400">Data início</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataInicio}
                  onSelect={(date) => {
                    setDataInicio(date)
                    // Fechar o popover após a seleção
                    document.body.click()
                  }}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Data fim */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" type="button">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataFim ? (
                    format(dataFim, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span className="text-gray-400">Data fim</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataFim}
                  onSelect={(date) => {
                    setDataFim(date)
                    // Fechar o popover após a seleção
                    document.body.click()
                  }}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Botões de ação para filtros */}
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={clearFilters}>
            Limpar filtros
          </Button>
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <Download size={16} />
            Exportar
          </Button>
          <Button variant="outline" onClick={handleImport} className="flex items-center gap-2">
            <Upload size={16} />
            Importar
          </Button>
          <Button variant="outline" onClick={handleGenerateReport} className="flex items-center gap-2">
            <FileText size={16} />
            Relatório
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="10 por página" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 por página</SelectItem>
              <SelectItem value="10">10 por página</SelectItem>
              <SelectItem value="20">20 por página</SelectItem>
              <SelectItem value="50">50 por página</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => router.push("/registros/visita-tecnica/cadastrar")}>Nova Visita</Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Data da Visita</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações Registradas</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((visita) => (
                <TableRow key={visita.id}>
                  <TableCell className="font-medium">{visita.id}</TableCell>
                  <TableCell>{visita.empresa}</TableCell>
                  <TableCell>{visita.unidade}</TableCell>
                  <TableCell>{format(visita.dataVisita, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell>{visita.responsavel}</TableCell>
                  <TableCell>{renderStatus(visita.status)}</TableCell>
                  <TableCell>{visita.acoesCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(visita.id)} title="Visualizar">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(visita.id)} title="Editar">
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(visita.id)}
                        title="Excluir"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  Nenhuma visita técnica encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação e informações */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Mostrando {filteredVisitas.length > 0 ? indexOfFirstItem + 1 : 0} a{" "}
          {Math.min(indexOfLastItem, filteredVisitas.length)} de {filteredVisitas.length} resultados
        </div>
        {renderPagination()}
      </div>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta visita técnica? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

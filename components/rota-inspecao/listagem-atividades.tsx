"use client"

import { useState, useEffect } from "react"
import { Search, Edit, ArrowUpDown, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent } from "@/components/ui/card"

// Tipos
interface Atividade {
  id: number
  codigo: number
  processo: string
  atividade: string
  comoAvaliar: string
  frequencia: string
}

// Dados mockados para demonstração
const MOCK_ATIVIDADES: Atividade[] = [
  {
    id: 1,
    codigo: 1,
    processo: "Combinados",
    atividade: "Combinados 2023 - Queda de Mesmo Nível",
    comoAvaliar: "Os pisos dos setores possuem superfície antiderrapante?",
    frequencia: "Semanal",
  },
  {
    id: 2,
    codigo: 2,
    processo: "Combinados",
    atividade: "Combinados 2023 - Queda de Mesmo Nível",
    comoAvaliar: "Os pisos dos setores estão livres de resíduos (Carne, Sebo etc.)?",
    frequencia: "Semanal",
  },
  {
    id: 3,
    codigo: 3,
    processo: "Combinados",
    atividade: "Combinados 2023 - Queda de Mesmo Nível",
    comoAvaliar: "Os locais com risco de queda estão com sinalização (Placa 32 Book de Sinalização)?",
    frequencia: "Semanal",
  },
  {
    id: 4,
    codigo: 4,
    processo: "Combinados",
    atividade: "Combinados 2023 - Queda de Mesmo Nível",
    comoAvaliar: "Houve a Implantação da bota MaxiGripe nas tarefas mapeadas (Desossa, Bem.1° e 2°)?",
    frequencia: "Semanal",
  },
  {
    id: 5,
    codigo: 5,
    processo: "Combinados",
    atividade: "Combinados 2023 - Água Quente",
    comoAvaliar:
      "Existe dispositivo que possibilite a realização de bloqueio físico de acesso junto aos pontos de água quente nas linhas de higienização?",
    frequencia: "Semanal",
  },
  {
    id: 6,
    codigo: 6,
    processo: "Embalagem",
    atividade: "Embalagem 2023 - Ergonomia",
    comoAvaliar: "As estações de trabalho possuem altura adequada para os colaboradores?",
    frequencia: "Mensal",
  },
  {
    id: 7,
    codigo: 7,
    processo: "Expedição",
    atividade: "Expedição 2023 - Movimentação de Cargas",
    comoAvaliar: "Os equipamentos de movimentação de cargas estão em boas condições?",
    frequencia: "Diária",
  },
  {
    id: 8,
    codigo: 8,
    processo: "Manutenção",
    atividade: "Manutenção 2023 - Trabalho em Altura",
    comoAvaliar: "Os colaboradores utilizam EPI adequado para trabalho em altura?",
    frequencia: "Quinzenal",
  },
]

// Opções para os filtros
const PROCESSOS = [
  { value: "all", label: "Todos" },
  { value: "Combinados", label: "Combinados" },
  { value: "Embalagem", label: "Embalagem" },
  { value: "Expedição", label: "Expedição" },
  { value: "Manutenção", label: "Manutenção" },
]

const FREQUENCIAS = [
  { value: "all", label: "Todas" },
  { value: "Diária", label: "Diária" },
  { value: "Semanal", label: "Semanal" },
  { value: "Quinzenal", label: "Quinzenal" },
  { value: "Mensal", label: "Mensal" },
]

const ATIVIDADES = [
  { value: "all", label: "Todas" },
  { value: "Queda de Mesmo Nível", label: "Queda de Mesmo Nível" },
  { value: "Água Quente", label: "Água Quente" },
  { value: "Ergonomia", label: "Ergonomia" },
  { value: "Movimentação de Cargas", label: "Movimentação de Cargas" },
  { value: "Trabalho em Altura", label: "Trabalho em Altura" },
]

export default function ListagemAtividades({ onEdit }: { onEdit: (id: number) => void }) {
  // Estados
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [filteredAtividades, setFilteredAtividades] = useState<Atividade[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Atividade; direction: "ascending" | "descending" } | null>(
    null,
  )

  // Filtros
  const [filtros, setFiltros] = useState({
    processo: "all",
    atividade: "all",
    frequencia: "all",
    comoAvaliar: "",
  })

  const itemsPerPage = 5

  // Carregar dados
  useEffect(() => {
    // Simulação de chamada à API
    setAtividades(MOCK_ATIVIDADES)
    setFilteredAtividades(MOCK_ATIVIDADES)
  }, [])

  // Aplicar filtros e busca
  useEffect(() => {
    let result = [...atividades]

    // Aplicar filtros específicos
    if (filtros.processo && filtros.processo !== "all") {
      result = result.filter((item) => item.processo === filtros.processo)
    }

    if (filtros.atividade && filtros.atividade !== "all") {
      result = result.filter((item) => item.atividade.includes(filtros.atividade))
    }

    if (filtros.frequencia && filtros.frequencia !== "all") {
      result = result.filter((item) => item.frequencia === filtros.frequencia)
    }

    if (filtros.comoAvaliar) {
      result = result.filter((item) => item.comoAvaliar.toLowerCase().includes(filtros.comoAvaliar.toLowerCase()))
    }

    // Aplicar busca geral
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (item) =>
          item.codigo.toString().includes(term) ||
          item.processo.toLowerCase().includes(term) ||
          item.atividade.toLowerCase().includes(term) ||
          item.comoAvaliar.toLowerCase().includes(term) ||
          item.frequencia.toLowerCase().includes(term),
      )
    }

    // Aplicar ordenação
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredAtividades(result)
    setCurrentPage(1) // Reset para primeira página ao filtrar
  }, [atividades, filtros, searchTerm, sortConfig])

  // Função para ordenar
  const requestSort = (key: keyof Atividade) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })
  }

  // Calcular paginação
  const totalPages = Math.ceil(filteredAtividades.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAtividades.slice(indexOfFirstItem, indexOfLastItem)

  // Limpar todos os filtros
  const handleClearFilters = () => {
    setFiltros({
      processo: "all",
      atividade: "all",
      frequencia: "all",
      comoAvaliar: "",
    })
    setSearchTerm("")
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Cadastrar atividades TST</h1>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-md">
            <div>
              <Select value={filtros.processo} onValueChange={(value) => setFiltros({ ...filtros, processo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Processo" />
                </SelectTrigger>
                <SelectContent>
                  {PROCESSOS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={filtros.atividade} onValueChange={(value) => setFiltros({ ...filtros, atividade: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Atividade" />
                </SelectTrigger>
                <SelectContent>
                  {ATIVIDADES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filtros.frequencia}
                onValueChange={(value) => setFiltros({ ...filtros, frequencia: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Frequência" />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCIAS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                placeholder="Como Avaliar"
                value={filtros.comoAvaliar}
                onChange={(e) => setFiltros({ ...filtros, comoAvaliar: e.target.value })}
              />
            </div>

            <div className="flex gap-2 md:col-span-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </div>

          {/* Tabela de Resultados */}
          {currentItems.length > 0 ? (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <Button
                        variant="ghost"
                        onClick={() => requestSort("codigo")}
                        className="flex items-center p-0 h-auto font-medium"
                      >
                        Código
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => requestSort("processo")}
                        className="flex items-center p-0 h-auto font-medium"
                      >
                        Processo
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Atividade</TableHead>
                    <TableHead>Como avaliar</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => requestSort("frequencia")}
                        className="flex items-center p-0 h-auto font-medium"
                      >
                        Frequência
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((atividade) => (
                    <TableRow key={atividade.id}>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={() => onEdit(atividade.id)}>
                          <Edit className="h-4 w-4 mr-2 text-gray-500" />
                          {atividade.codigo}
                        </Button>
                      </TableCell>
                      <TableCell>{atividade.processo}</TableCell>
                      <TableCell>{atividade.atividade}</TableCell>
                      <TableCell>{atividade.comoAvaliar}</TableCell>
                      <TableCell>{atividade.frequencia}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginação */}
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink isActive={currentPage === index + 1} onClick={() => setCurrentPage(index + 1)}>
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <Filter className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Nenhuma atividade encontrada</h3>
              <p className="text-gray-500 mt-1">Nenhuma atividade encontrada com os critérios informados.</p>
              <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

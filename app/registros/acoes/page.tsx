"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, Download, FileText, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NovaAcaoModal } from "@/components/acoes/nova-acao-modal"

export default function GerenciadorAcoes() {
  const [dataInicio, setDataInicio] = useState(new Date("2025-01-05"))
  const [dataFim, setDataFim] = useState(new Date("2025-05-06"))
  const [carregarImagens, setCarregarImagens] = useState(false)
  const [showNovaAcaoModal, setShowNovaAcaoModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  // Dados de exemplo para a tabela
  const acoes = []

  // Função para filtrar ações
  const filteredAcoes = acoes.filter(
    (acao) =>
      acao?.codigo?.toString().includes(searchTerm) ||
      acao?.negocio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acao?.unidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acao?.indicador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acao?.anomalia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acao?.causa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acao?.acao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acao?.responsavel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acao?.status?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Paginação
  const totalPages = Math.ceil(filteredAcoes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAcoes = filteredAcoes.slice(startIndex, startIndex + itemsPerPage)

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Gerenciador de Ações</h1>
          <Button onClick={() => setShowNovaAcaoModal(true)} className="bg-red-600 hover:bg-red-700 text-white">
            Nova Ação
          </Button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Negócio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="negocio1">Negócio 1</SelectItem>
                <SelectItem value="negocio2">Negócio 2</SelectItem>
                <SelectItem value="negocio3">Negócio 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Unidade Centralizadora" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="unidade1">Unidade 1</SelectItem>
                <SelectItem value="unidade2">Unidade 2</SelectItem>
                <SelectItem value="unidade3">Unidade 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="unidade1">Unidade 1</SelectItem>
                <SelectItem value="unidade2">Unidade 2</SelectItem>
                <SelectItem value="unidade3">Unidade 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Indicador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="indicador1">Indicador 1</SelectItem>
                <SelectItem value="indicador2">Indicador 2</SelectItem>
                <SelectItem value="indicador3">Indicador 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="resp1">Responsável 1</SelectItem>
                <SelectItem value="resp2">Responsável 2</SelectItem>
                <SelectItem value="resp3">Responsável 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm mr-2">Início</span>
                      {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Selecione"}
                    </div>
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} locale={ptBR} />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm mr-2">Fim</span>
                      {dataFim ? format(dataFim, "dd/MM/yyyy") : "Selecione"}
                    </div>
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dataFim} onSelect={setDataFim} locale={ptBR} />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="em_andamento">Em andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Prioridade Ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="carregar-imagens" checked={carregarImagens} onCheckedChange={setCarregarImagens} />
          <Label htmlFor="carregar-imagens">Carregar Imagens Ação</Label>
        </div>

        <div className="flex justify-center">
          <Button className="bg-red-600 hover:bg-red-700 text-white px-8">CONSULTAR</Button>
        </div>

        {/* Abas */}
        <Tabs defaultValue="acoes" className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="acoes" className="font-semibold">
              AÇÕES
            </TabsTrigger>
            <TabsTrigger value="consolidado_lancamentos" className="font-semibold">
              CONSOLIDADO LANÇAMENTOS
            </TabsTrigger>
            <TabsTrigger value="consolidado_unidades" className="font-semibold">
              CONSOLIDADO UNIDADES
            </TabsTrigger>
            <TabsTrigger value="consolidado_mensal" className="font-semibold">
              CONSOLIDADO MENSAL
            </TabsTrigger>
            <TabsTrigger value="historico" className="font-semibold">
              HISTÓRICO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="acoes" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Relatório
                </Button>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="border rounded-md">
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
                      Negócio
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
                      Indicador
                    </th>
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
                      Causa
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
                      Responsável
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Previsão
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
                  {paginatedAcoes.length > 0 ? (
                    paginatedAcoes.map((acao, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.codigo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.negocio}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.unidade}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.indicador}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.anomalia}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.causa}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.acao}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.responsavel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.previsao}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.realizado}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acao.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Button variant="ghost" size="sm">
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12} className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full w-8 h-8 p-0 ${itemsPerPage === 10 ? "bg-red-600 text-white" : ""}`}
                  onClick={() => setItemsPerPage(10)}
                >
                  10
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full w-8 h-8 p-0 ${itemsPerPage === 15 ? "bg-red-600 text-white" : ""}`}
                  onClick={() => setItemsPerPage(15)}
                >
                  15
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full w-8 h-8 p-0 ${itemsPerPage === 25 ? "bg-red-600 text-white" : ""}`}
                  onClick={() => setItemsPerPage(25)}
                >
                  25
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`px-3 py-1 ${itemsPerPage === 9999 ? "bg-red-600 text-white" : ""}`}
                  onClick={() => setItemsPerPage(9999)}
                >
                  All
                </Button>
              </div>

              <div className="text-sm text-gray-700">
                Página {currentPage} de {totalPages || 1} ({filteredAcoes.length} registros)
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </Button>
                <Button variant="outline" size="sm" className={`rounded-full w-8 h-8 p-0 bg-red-600 text-white`}>
                  {currentPage}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
                  disabled={currentPage === (totalPages || 1)}
                >
                  &gt;
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="consolidado_lancamentos">
            <div className="p-8 text-center text-gray-500">Conteúdo do Consolidado Lançamentos</div>
          </TabsContent>

          <TabsContent value="consolidado_unidades">
            <div className="p-8 text-center text-gray-500">Conteúdo do Consolidado Unidades</div>
          </TabsContent>

          <TabsContent value="consolidado_mensal">
            <div className="p-8 text-center text-gray-500">Conteúdo do Consolidado Mensal</div>
          </TabsContent>

          <TabsContent value="historico">
            <div className="p-8 text-center text-gray-500">Conteúdo do Histórico</div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Nova Ação */}
      {showNovaAcaoModal && <NovaAcaoModal isOpen={showNovaAcaoModal} onClose={() => setShowNovaAcaoModal(false)} />}
    </MainLayout>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FileSpreadsheet, FileText, Search, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function RelatorioInspecao() {
  const [setor, setSetor] = useState("")
  const [unidade, setUnidade] = useState("")
  const [negocio, setNegocio] = useState("")
  const [dataInicio, setDataInicio] = useState<Date | undefined>(new Date(2025, 4, 1)) // 01/05/2025
  const [dataFim, setDataFim] = useState<Date | undefined>(new Date(2025, 4, 8)) // 08/05/2025
  const [searchTerm, setSearchTerm] = useState("")
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Dados de exemplo para setores, unidades e negócios
  const setores = ["Produção", "Administrativo", "Logística", "Manutenção", "Qualidade"]
  const unidades = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Salvador"]
  const negocios = ["Industrial", "Comercial", "Serviços", "Tecnologia", "Saúde"]

  // Função para formatar a data no formato brasileiro
  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return format(date, "dd/MM/yyyy", { locale: ptBR })
  }

  // Função para consultar os dados
  const handleConsultar = () => {
    // Aqui seria implementada a lógica para buscar os dados do backend
    console.log("Consultando com os filtros:", { setor, unidade, negocio, dataInicio, dataFim })

    // Adicionar feedback visual para o usuário
    alert("Consulta realizada com sucesso! Em um ambiente real, os dados seriam carregados do backend.")

    // Em uma implementação real, aqui você faria uma chamada à API
    // e atualizaria o estado com os resultados
  }

  // Função para exportar para Excel
  const handleExportExcel = () => {
    console.log("Exportando para Excel")
  }

  // Função para exportar para PDF
  const handleExportPDF = () => {
    console.log("Exportando para PDF")
  }

  return (
    <div className="w-full h-full p-0 m-0">
      <div className="w-full h-full bg-gradient-to-b from-white to-gray-50 p-4 md:p-6">
        {/* Cabeçalho do relatório */}
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Relatório de Inspeção</h2>
          <p className="text-sm text-gray-500 mt-1">Visualize e exporte dados de inspeções realizadas</p>
        </div>
        {/* Filtros */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-8">
          <h3 className="text-md font-medium text-gray-700 mb-4">Filtros de Pesquisa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="setor" className="block text-sm text-gray-500 mb-1">
                Setor
              </label>
              <select
                id="setor"
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um setor</option>
                {setores.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="unidade" className="block text-sm text-gray-500 mb-1">
                Unidade
              </label>
              <select
                id="unidade"
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma unidade</option>
                {unidades.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="negocio" className="block text-sm text-gray-500 mb-1">
                Negócio
              </label>
              <select
                id="negocio"
                value={negocio}
                onChange={(e) => setNegocio(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um negócio</option>
                {negocios.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Início</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border border-gray-300"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataInicio ? formatDate(dataInicio) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus locale={ptBR} />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Fim</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border border-gray-300"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataFim ? formatDate(dataFim) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dataFim} onSelect={setDataFim} initialFocus locale={ptBR} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-8 mt-4">
          <Button
            onClick={handleConsultar}
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium shadow-sm transition-all duration-200 transform hover:scale-105 flex items-center"
          >
            <Search className="h-4 w-4 mr-2" />
            CONSULTAR
          </Button>
        </div>

        {/* Tabela de resultados */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 border border-gray-100">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">Resultados da Consulta</h3>
          </div>

          <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
            <div className="text-sm text-gray-500">Arraste uma coluna aqui para agrupar</div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportExcel} title="Exportar para Excel">
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF} title="Exportar para PDF">
                <FileText className="h-4 w-4" />
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
                    Unidade
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
                    Data
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Qtd Itens
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    % Avaliação
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Conforme
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Não Conforme
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    NA
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    % Conformidade
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
                    Status ações
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    E-mail enviado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td colSpan={13} className="px-6 py-10 text-center text-sm text-gray-500">
                    Nenhum registro encontrado
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginação */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-lg shadow-sm border border-gray-100 mt-4">
          <div className="flex space-x-2 mb-4 sm:mb-0">
            <Button
              variant={itemsPerPage === 10 ? "default" : "outline"}
              size="sm"
              onClick={() => setItemsPerPage(10)}
              className={itemsPerPage === 10 ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              10
            </Button>
            <Button
              variant={itemsPerPage === 15 ? "default" : "outline"}
              size="sm"
              onClick={() => setItemsPerPage(15)}
              className={itemsPerPage === 15 ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              15
            </Button>
            <Button
              variant={itemsPerPage === 25 ? "default" : "outline"}
              size="sm"
              onClick={() => setItemsPerPage(25)}
              className={itemsPerPage === 25 ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              25
            </Button>
            <Button
              variant={itemsPerPage === 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setItemsPerPage(0)}
              className={itemsPerPage === 0 ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              All
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Página 1 de 1 (0 registros)</span>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" disabled>
                &lt;
              </Button>
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
